import { web3 } from "@project-serum/anchor";
import { Commitment, ConnectionConfig } from "@solana/web3.js";
import { Stream as StreamData, CreateStreamParams, WithdrawStreamParams, TopupStreamParams, CancelStreamParams, TransferStreamParams, ClusterExtended, GetStreamParams, GetStreamsParams, CreateStreamResponse, TransactionResponse } from "./types";
export default class Stream {
    private connection;
    private cluster;
    private programId;
    private commitment;
    /**
     * Create Stream instance
     */
    constructor(clusterUrl: string, cluster?: ClusterExtended, commitment?: Commitment | ConnectionConfig);
    getConnection(): web3.Connection;
    /**
     * Creates a new stream/vesting contract.
     * All fees are paid by sender (escrow metadata account rent, escrow token account rent, recipient's associated token account rent, Streamflow's service fee).
     * @param {CreateStreamParams} data
     * @param {Wallet} data.sender - Wallet signing the transaction. Its address should match the authorized wallet (sender) or transaction will fail.
     * @param {string} data.recipient - Solana address of the recipient. Associated token account will be derived using this address and token mint address.
     * @param {string} data.payer - Solana address of the payer.
     * @param {string} data.mint - SPL Token mint.
     * @param {number} data.start - Timestamp (in seconds) when the stream/token vesting starts.
     * @param {u64} data.depositedAmount - Initially deposited amount of tokens (in the smallest units).
     * @param {number} data.period - Time step (period) in seconds per which the unlocking occurs.
     * @param {number} data.cliff - Vesting contract "cliff" timestamp in seconds.
     * @param {u64} data.cliffAmount - Amount unlocked at the "cliff".
     * @param {u64} data.amountPerPeriod - Amount unlocked per each period.
     * @param {string} data.name - Stream name/subject.
     * @param {boolean} data.canTopup - TRUE for streams, FALSE for vesting contracts.
     * @param {boolean} data.cancelableBySender - Whether or not sender can cancel the stream.
     * @param {boolean} data.cancelableByRecipient - Whether or not recipient can cancel the stream.
     * @param {boolean} data.transferableBySender - Whether or not sender can transfer the stream.
     * @param {boolean} data.transferableByRecipient - Whether or not recipient can transfer the stream.
     * @param {boolean} data.automaticWithdrawal - Whether or not a 3rd party can initiate withdraw in the name of recipient.
     * @param {string | null} [data.partner = null] - Partner's wallet address (optional).
     */
    create({ sender, recipient, payer, mint, start, depositedAmount, period, cliff, cliffAmount, amountPerPeriod, name, canTopup, cancelableBySender, cancelableByRecipient, transferableBySender, transferableByRecipient, automaticWithdrawal, partner, }: CreateStreamParams): Promise<CreateStreamResponse>;
    /**
     * Attempts withdrawal from the specified stream.
     * @param {WithdrawStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match authorized wallet (recipient) or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be withdrawn from.
     * @param {u64} data.amount - Requested amount (in the smallest units) to withdraw (while streaming). If stream is completed, the whole amount will be withdrawn.
     */
    withdraw({ invoker, id, amount, }: WithdrawStreamParams): Promise<TransactionResponse>;
    /**
     * Attempts canceling the specified stream.
     * @param {CancelStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match authorized wallet (sender or recipient) or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be canceled.
     */
    cancel({ invoker, id, }: CancelStreamParams): Promise<TransactionResponse>;
    /**
     * Attempts changing the stream/vesting contract's recipient (effectively transferring the stream/vesting contract).
     * Potential associated token account rent fee (to make it rent-exempt) is paid by the transaction initiator.
     * @param {TransferStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match authorized wallet (sender or recipient) or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be transferred.
     * @param {string} data.recipientId - Address of a new recipient.
     */
    transfer({ invoker, id, recipientId, }: TransferStreamParams): Promise<TransactionResponse>;
    /**
     * Tops up stream account deposited amount.
     * @param {TopupStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match current stream sender or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be topped up.
     * @param {u64} data.amount - Specified amount (in the smallest units) to topup (increases deposited amount).
     */
    topup({ invoker, id, amount, }: TopupStreamParams): Promise<TransactionResponse>;
    /**
     * Fetch stream data by its id (address).
     * @param {GetStreamParams} data
     * @param {Connection} data.connection - A connection to the cluster.
     * @param {string} data.id - Identifier of a stream that is fetched.
     */
    getOne({ id }: GetStreamParams): Promise<StreamData>;
    /**
     * Fetch streams/contracts by providing direction.
     * Streams are sorted by start time in ascending order.
     * @param {GetStreamsParams} data
     * @param {PublicKey} data.wallet - PublicKey of the wallet for which the streams/contracts are fetched.
     * @param {StreamType} [data.type = StreamType.All] - It can be one of: stream, vesting, all.
     * @param {StreamDirection} [data.direction = StreamDirection.All] - It can be one of: incoming, outgoing, all.
     */
    get({ wallet, type, direction, }: GetStreamsParams): Promise<[string, StreamData][]>;
}
