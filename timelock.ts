import {
  Address,
  BN,
  Idl,
  Program,
  Provider,
  web3,
} from "@project-serum/anchor";
import { Wallet } from "@project-serum/anchor/src/provider";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  TransactionSignature,
} from "@solana/web3.js";
import idl from "./idl";
import { decode_token_stream_data as decode } from "./layout";

function initProgram(
  connection: Connection,
  wallet: Wallet,
  timelockProgramId: Address
): Program {
  const provider = new Provider(connection, wallet, {});
  return new Program(idl as Idl, timelockProgramId, provider);
}

export default class Timelock {
  /**
   * Creates a new stream/vesting contract. All fees are paid by sender. (escrow metadata account rent, escrow token account, recipient's associated token account creation
   * @param {Connection} connection
   * @param {Wallet} wallet - Wallet signing the transaction.
   * @param {Address} timelockProgramId - Program ID of a timelock program on chain.
   * @param {Keypair} newAcc - New escrow account containing all of the stream/vesting contract metadata.
   * @param {PublicKey} recipient - Solana address of a recipient. Associated token account will be derived from this address and SPL Token mint address.
   * @param {PublicKey} mint - SPL Token mint.
   * @param {BN} depositedAmount - Initially deposited amount of tokens.
   * @param {BN} start - Timestamp (in seconds) when the tokens start vesting
   * @param {BN} end - Timestamp when all tokens are fully vested
   * @param {BN} period - Time step (period) in seconds per which the vesting occurs
   * @param {BN} cliff - Vesting contract "cliff" timestamp
   * @param {BN} cliffAmount - Amount unlocked at the "cliff" timestamp
   */
  static async create(
    connection: Connection,
    wallet: Wallet,
    timelockProgramId: Address,
    newAcc: Keypair,
    recipient: PublicKey,
    mint: PublicKey,
    depositedAmount: BN,
    start: BN,
    end: BN,
    period: BN,
    cliff: BN,
    cliffAmount: BN
  ): Promise<TransactionSignature> {
    const program = initProgram(connection, wallet, timelockProgramId);
    const metadata = newAcc;
    const [escrowTokens] = await web3.PublicKey.findProgramAddress(
      [metadata.publicKey.toBuffer()],
      program.programId
    );
    let senderTokens = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      wallet.publicKey
    );
    let signers = [metadata];
    let instructions = undefined;
    // if (mint.toBase58() === NATIVE_MINT.toBase58()) {
    //   //this effectively means new account is created for each wSOL stream, as we can't derive it.
    //   instructions = [];
    //   const balanceNeeded = await Token.getMinBalanceRentForExemptAccount(
    //     connection
    //   );
    //   // Create a new account
    //   const newAccount = Keypair.generate(); //todo this is not an associated token account????
    //
    //   signers.push(newAccount);
    //
    //   senderTokens = newAccount.publicKey;
    //   instructions.push(
    //     SystemProgram.createAccount({
    //       fromPubkey: wallet.publicKey,
    //       newAccountPubkey: newAccount.publicKey,
    //       lamports: balanceNeeded,
    //       space: AccountLayout.span,
    //       programId: TOKEN_PROGRAM_ID,
    //     })
    //   );
    //
    //   // Send lamports to it (these will be wrapped into native tokens by the token program)
    //   instructions.push(
    //     SystemProgram.transfer({
    //       fromPubkey: wallet.publicKey,
    //       toPubkey: newAccount.publicKey,
    //       lamports: depositedAmount.toNumber(),
    //     })
    //   );
    //
    //   // Assign the new account to the native token mint.
    //   // the account will be initialized with a balance equal to the native token balance.
    //   // (i.e. amount)
    //   instructions.push(
    //     Token.createInitAccountInstruction(
    //       TOKEN_PROGRAM_ID,
    //       NATIVE_MINT,
    //       newAccount.publicKey,
    //       wallet.publicKey
    //     )
    //   );
    //   //TODO: figure out a way to create wrapped SOL account as an associated token account
    //   //instructions.push(Token.createAssociatedTokenAccountInstruction(ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, mint, newAccount.publicKey, wallet.publicKey, wallet.publicKey))
    // }

    const recipientTokens = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      recipient
    );

    return await program.rpc.create(
      // Order of the parameters must match the ones in program
      depositedAmount,
      start,
      end,
      period,
      cliff,
      cliffAmount,
      {
        accounts: {
          sender: wallet.publicKey,
          senderTokens,
          recipient,
          recipientTokens,
          metadata: metadata.publicKey,
          escrowTokens,
          mint,
          rent: SYSVAR_RENT_PUBKEY,
          timelockProgram: program.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        },
        signers,
        instructions,
      }
    );
  }

  /**
   * Attempts withdrawal from a specified stream.
   * @param {Connection} connection
   * @param {Wallet} wallet - Wallet signing the transaction. It's address should match current stream recipient or transaction will fail.
   * @param {Address} timelockProgramId - Program ID of a timelock program on chain.
   * @param {PublicKey} stream - Identifier of a stream (escrow account with metadata) to be withdrawn from.
   * @param {BN} amount - Requested amount to withdraw. If BN(0), program attempts to withdraw maximum available amount.
   */
  static async withdraw(
    connection: Connection,
    wallet: Wallet,
    timelockProgramId: Address,
    stream: PublicKey,
    amount: BN
  ): Promise<TransactionSignature> {
    const program = initProgram(connection, wallet, timelockProgramId);
    const escrow = await connection.getAccountInfo(stream);
    if (!escrow?.data) {
      throw new Error("Couldn't get account info");
    }
    const data = decode(escrow.data);

    return await program.rpc.withdraw(amount, {
      accounts: {
        withdrawAuthority: wallet.publicKey,
        sender: data.sender,
        recipient: wallet.publicKey,
        recipientTokens: data.recipient_tokens,
        metadata: stream,
        escrowTokens: data.escrow_tokens,
        mint: data.mint,
        tokenProgram: TOKEN_PROGRAM_ID,
      },
    });
  }

  /**
   * Attempts canceling the specified stream.
   * @param {Connection} connection
   * @param {Wallet} wallet - Wallet signing the transaction. It's address should match current stream sender or transaction will fail.
   * @param {Address} timelockProgramId - Program ID of a timelock program on chain.
   * @param {PublicKey} stream - Identifier of a stream (escrow account with metadata) to be canceled.
   */
  static async cancel(
    connection: Connection,
    wallet: Wallet,
    timelockProgramId: Address,
    stream: PublicKey
  ): Promise<TransactionSignature> {
    const program = initProgram(connection, wallet, timelockProgramId);
    let escrow_acc = await connection.getAccountInfo(stream);
    if (!escrow_acc?.data) {
      throw new Error("Couldn't get account info");
    }
    let data = decode(escrow_acc?.data);

    return await program.rpc.cancel({
      accounts: {
        cancelAuthority: wallet.publicKey,
        sender: wallet.publicKey,
        senderTokens: data.sender_tokens,
        recipient: data.recipient,
        recipientTokens: data.recipient_tokens,
        metadata: stream,
        escrowTokens: data.escrow_tokens,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        mint: data.mint,
      },
    });
  }

  /**
   * Attempts changing the stream/vesting contract's recipient (effectively transferring the stream/vesting contract).
   * Potential associated token account rent fee (to make it rent-exempt) is paid by the transaction initiator (i.e. current recipient)
   * @param {Connection} connection
   * @param {Wallet} wallet - Wallet signing the transaction. It's address should match current stream recipient or transaction will fail.
   * @param {Address} timelockProgramId - Program ID of a timelock program on chain.
   * @param {PublicKey} stream - Identifier of a stream (escrow account with metadata) to be transferred.
   * @param {PublicKey} newRecipient - Address of a new stream/vesting contract recipient.
   */
  static async transferRecipient(
    connection: Connection,
    wallet: Wallet,
    timelockProgramId: Address,
    stream: PublicKey,
    newRecipient: PublicKey
  ): Promise<TransactionSignature> {
    const program = initProgram(connection, wallet, timelockProgramId);
    let escrow = await connection.getAccountInfo(stream);
    if (!escrow?.data) {
      throw new Error("Couldn't get account info");
    }
    let data = decode(escrow?.data);

    const mint = data.mint;
    const newRecipientTokens = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      mint,
      newRecipient
    );

    return await program.rpc.transferRecipient({
      accounts: {
        existingRecipient: wallet.publicKey,
        newRecipient,
        newRecipientTokens,
        metadata: stream,
        escrowTokens: data.escrow_tokens,
        mint,
        rent: SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        system: web3.SystemProgram.programId,
      },
    });
  }
}
