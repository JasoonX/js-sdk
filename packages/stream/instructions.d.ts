import { PublicKey, TransactionInstruction } from "@solana/web3.js";
import { u64 } from "@solana/spl-token";
interface CreateStreamData {
    start: u64;
    depositedAmount: u64;
    period: u64;
    amountPerPeriod: u64;
    cliff: u64;
    cliffAmount: u64;
    cancelableBySender: boolean;
    cancelableByRecipient: boolean;
    automaticWithdrawal: boolean;
    transferableBySender: boolean;
    transferableByRecipient: boolean;
    canTopup: boolean;
    name: string;
    withdrawFrequency: u64;
}
interface CreateStreamAccounts {
    sender: PublicKey;
    senderTokens: PublicKey;
    payer: PublicKey;
    recipient: PublicKey;
    recipientTokens: PublicKey;
    metadata: PublicKey;
    escrowTokens: PublicKey;
    streamflowTreasury: PublicKey;
    streamflowTreasuryTokens: PublicKey;
    partner: PublicKey;
    partnerTokens: PublicKey;
    mint: PublicKey;
    feeOracle: PublicKey;
    rent: PublicKey;
    timelockProgram: PublicKey;
    tokenProgram: PublicKey;
    associatedTokenProgram: PublicKey;
    withdrawor: PublicKey;
    systemProgram: PublicKey;
}
export declare const createStreamInstruction: (data: CreateStreamData, programId: PublicKey, accounts: CreateStreamAccounts) => TransactionInstruction;
interface WithdrawAccounts {
    authority: PublicKey;
    recipient: PublicKey;
    recipientTokens: PublicKey;
    metadata: PublicKey;
    escrowTokens: PublicKey;
    streamflowTreasury: PublicKey;
    streamflowTreasuryTokens: PublicKey;
    partner: PublicKey;
    partnerTokens: PublicKey;
    mint: PublicKey;
    tokenProgram: PublicKey;
}
export declare const withdrawStreamInstruction: (amount: u64, programId: PublicKey, { authority, recipient, recipientTokens, metadata, escrowTokens, streamflowTreasury, streamflowTreasuryTokens, partner, partnerTokens, mint, tokenProgram, }: WithdrawAccounts) => TransactionInstruction;
interface CancelAccounts {
    authority: PublicKey;
    sender: PublicKey;
    senderTokens: PublicKey;
    recipient: PublicKey;
    recipientTokens: PublicKey;
    metadata: PublicKey;
    escrowTokens: PublicKey;
    streamflowTreasury: PublicKey;
    streamflowTreasuryTokens: PublicKey;
    partner: PublicKey;
    partnerTokens: PublicKey;
    mint: PublicKey;
    tokenProgram: PublicKey;
}
export declare const cancelStreamInstruction: (programId: PublicKey, { authority, sender, senderTokens, recipient, recipientTokens, metadata, escrowTokens, streamflowTreasury, streamflowTreasuryTokens, partner, partnerTokens, mint, tokenProgram, }: CancelAccounts) => TransactionInstruction;
interface TransferAccounts {
    authority: PublicKey;
    newRecipient: PublicKey;
    newRecipientTokens: PublicKey;
    metadata: PublicKey;
    mint: PublicKey;
    rent: PublicKey;
    tokenProgram: PublicKey;
    associatedTokenProgram: PublicKey;
    systemProgram: PublicKey;
}
export declare const transferStreamInstruction: (programId: PublicKey, { authority, newRecipient, newRecipientTokens, metadata, mint, rent, tokenProgram, associatedTokenProgram, systemProgram, }: TransferAccounts) => TransactionInstruction;
interface TopupAccounts {
    sender: PublicKey;
    senderTokens: PublicKey;
    metadata: PublicKey;
    escrowTokens: PublicKey;
    streamflowTreasury: PublicKey;
    streamflowTreasuryTokens: PublicKey;
    partner: PublicKey;
    partnerTokens: PublicKey;
    mint: PublicKey;
    tokenProgram: PublicKey;
    withdrawor: PublicKey;
    systemProgram: PublicKey;
}
export declare const topupStreamInstruction: (amount: u64, programId: PublicKey, { sender, senderTokens, metadata, escrowTokens, streamflowTreasury, streamflowTreasuryTokens, partner, partnerTokens, mint, tokenProgram, withdrawor, systemProgram, }: TopupAccounts) => TransactionInstruction;
export {};
