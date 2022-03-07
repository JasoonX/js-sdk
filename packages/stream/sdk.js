"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var anchor_1 = require("@project-serum/anchor");
var spl_token_1 = require("@solana/spl-token");
var buffer_1 = require("buffer");
var spl_token_2 = require("@solana/spl-token");
var web3_js_1 = require("@solana/web3.js");
var types_1 = require("./types");
var utils_1 = require("./utils");
var constants_1 = require("./constants");
var instructions_1 = require("./instructions");
var encoder = new TextEncoder();
var Stream = /** @class */ (function () {
    /**
     * Create Stream instance
     */
    function Stream(clusterUrl, cluster, commitment) {
        if (cluster === void 0) { cluster = types_1.Cluster.Mainnet; }
        if (commitment === void 0) { commitment = "confirmed"; }
        this.commitment = commitment;
        this.cluster = cluster;
        this.connection = new web3_js_1.Connection(clusterUrl, this.commitment);
        this.programId = new web3_js_1.PublicKey(constants_1.PROGRAM_ID[cluster]);
    }
    Stream.prototype.getConnection = function () {
        return this.connection;
    };
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
    Stream.prototype.create = function (_a) {
        var sender = _a.sender, recipient = _a.recipient, payer = _a.payer, mint = _a.mint, start = _a.start, depositedAmount = _a.depositedAmount, period = _a.period, cliff = _a.cliff, cliffAmount = _a.cliffAmount, amountPerPeriod = _a.amountPerPeriod, name = _a.name, canTopup = _a.canTopup, cancelableBySender = _a.cancelableBySender, cancelableByRecipient = _a.cancelableByRecipient, transferableBySender = _a.transferableBySender, transferableByRecipient = _a.transferableByRecipient, automaticWithdrawal = _a.automaticWithdrawal, partner = _a.partner;
        return __awaiter(this, void 0, void 0, function () {
            var ixs, mintPublicKey, recipientPublicKey, metadata, _b, escrowTokens, senderTokens, recipientTokens, streamflowTreasuryTokens, partnerPublicKey, partnerTokens, commitment, hash, tx, rawTx, signature;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        ixs = [];
                        mintPublicKey = new web3_js_1.PublicKey(mint);
                        recipientPublicKey = new web3_js_1.PublicKey(recipient);
                        metadata = web3_js_1.Keypair.generate();
                        return [4 /*yield*/, anchor_1.web3.PublicKey.findProgramAddress([buffer_1.Buffer.from("strm"), metadata.publicKey.toBuffer()], this.programId)];
                    case 1:
                        _b = __read.apply(void 0, [_d.sent(), 1]), escrowTokens = _b[0];
                        return [4 /*yield*/, ata(mintPublicKey, sender.publicKey)];
                    case 2:
                        senderTokens = _d.sent();
                        return [4 /*yield*/, ata(mintPublicKey, recipientPublicKey)];
                    case 3:
                        recipientTokens = _d.sent();
                        return [4 /*yield*/, ata(mintPublicKey, constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY)];
                    case 4:
                        streamflowTreasuryTokens = _d.sent();
                        partnerPublicKey = partner
                            ? new web3_js_1.PublicKey(partner)
                            : constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY;
                        return [4 /*yield*/, ata(mintPublicKey, partnerPublicKey)];
                    case 5:
                        partnerTokens = _d.sent();
                        ixs.push(instructions_1.createStreamInstruction({
                            start: new spl_token_1.u64(start),
                            depositedAmount: depositedAmount,
                            period: new spl_token_1.u64(period),
                            amountPerPeriod: amountPerPeriod,
                            cliff: new spl_token_1.u64(cliff),
                            cliffAmount: cliffAmount,
                            cancelableBySender: cancelableBySender,
                            cancelableByRecipient: cancelableByRecipient,
                            automaticWithdrawal: automaticWithdrawal,
                            transferableBySender: transferableBySender,
                            transferableByRecipient: transferableByRecipient,
                            canTopup: canTopup,
                            name: name,
                            withdrawFrequency: new spl_token_1.u64(period),
                        }, this.programId, {
                            sender: sender.publicKey,
                            senderTokens: senderTokens,
                            payer: new web3_js_1.PublicKey(payer),
                            recipient: new web3_js_1.PublicKey(recipient),
                            metadata: metadata.publicKey,
                            escrowTokens: escrowTokens,
                            recipientTokens: recipientTokens,
                            streamflowTreasury: constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY,
                            streamflowTreasuryTokens: streamflowTreasuryTokens,
                            partner: partnerPublicKey,
                            partnerTokens: partnerTokens,
                            mint: new web3_js_1.PublicKey(mint),
                            feeOracle: constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY,
                            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                            timelockProgram: this.programId,
                            tokenProgram: spl_token_2.TOKEN_PROGRAM_ID,
                            associatedTokenProgram: spl_token_2.ASSOCIATED_TOKEN_PROGRAM_ID,
                            withdrawor: constants_1.WITHDRAWOR_PUBLIC_KEY,
                            systemProgram: web3_js_1.SystemProgram.programId,
                        }));
                        commitment = typeof this.commitment == "string"
                            ? this.commitment
                            : this.commitment.commitment;
                        return [4 /*yield*/, this.connection.getRecentBlockhash(commitment)];
                    case 6:
                        hash = _d.sent();
                        tx = (_c = new web3_js_1.Transaction({
                            feePayer: sender.publicKey,
                            recentBlockhash: hash.blockhash,
                        })).add.apply(_c, __spread(ixs));
                        tx.partialSign(metadata);
                        return [4 /*yield*/, sender.signTransaction(tx)];
                    case 7:
                        _d.sent();
                        rawTx = tx.serialize();
                        return [4 /*yield*/, web3_js_1.sendAndConfirmRawTransaction(this.connection, rawTx)];
                    case 8:
                        signature = _d.sent();
                        return [2 /*return*/, { ixs: ixs, tx: signature, metadata: metadata }];
                }
            });
        });
    };
    /**
     * Attempts withdrawal from the specified stream.
     * @param {WithdrawStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match authorized wallet (recipient) or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be withdrawn from.
     * @param {u64} data.amount - Requested amount (in the smallest units) to withdraw (while streaming). If stream is completed, the whole amount will be withdrawn.
     */
    Stream.prototype.withdraw = function (_a) {
        var invoker = _a.invoker, id = _a.id, amount = _a.amount;
        return __awaiter(this, void 0, void 0, function () {
            var ixs, streamPublicKey, escrow, data, streamflowTreasuryTokens, partnerTokens, commitment, hash, tx, signedAndSerializedTx, signature;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ixs = [];
                        streamPublicKey = new web3_js_1.PublicKey(id);
                        return [4 /*yield*/, this.connection.getAccountInfo(streamPublicKey)];
                    case 1:
                        escrow = _c.sent();
                        if (!(escrow === null || escrow === void 0 ? void 0 : escrow.data)) {
                            throw new Error("Couldn't get account info");
                        }
                        data = utils_1.decodeStream(escrow.data);
                        return [4 /*yield*/, ata(data.mint, constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY)];
                    case 2:
                        streamflowTreasuryTokens = _c.sent();
                        return [4 /*yield*/, ata(data.mint, data.partner)];
                    case 3:
                        partnerTokens = _c.sent();
                        ixs.push(instructions_1.withdrawStreamInstruction(amount, this.programId, {
                            authority: invoker.publicKey,
                            recipient: invoker.publicKey,
                            recipientTokens: data.recipientTokens,
                            metadata: streamPublicKey,
                            escrowTokens: data.escrowTokens,
                            streamflowTreasury: constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY,
                            streamflowTreasuryTokens: streamflowTreasuryTokens,
                            partner: data.partner,
                            partnerTokens: partnerTokens,
                            mint: data.mint,
                            tokenProgram: spl_token_2.TOKEN_PROGRAM_ID,
                        }));
                        commitment = typeof this.commitment == "string"
                            ? this.commitment
                            : this.commitment.commitment;
                        return [4 /*yield*/, this.connection.getRecentBlockhash(commitment)];
                    case 4:
                        hash = _c.sent();
                        tx = (_b = new web3_js_1.Transaction({
                            feePayer: invoker.publicKey,
                            recentBlockhash: hash.blockhash,
                        })).add.apply(_b, __spread(ixs));
                        return [4 /*yield*/, invoker.signTransaction(tx)];
                    case 5:
                        signedAndSerializedTx = (_c.sent()).serialize();
                        return [4 /*yield*/, web3_js_1.sendAndConfirmRawTransaction(this.connection, signedAndSerializedTx)];
                    case 6:
                        signature = _c.sent();
                        return [2 /*return*/, { ixs: ixs, tx: signature }];
                }
            });
        });
    };
    /**
     * Attempts canceling the specified stream.
     * @param {CancelStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match authorized wallet (sender or recipient) or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be canceled.
     */
    Stream.prototype.cancel = function (_a) {
        var invoker = _a.invoker, id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var streamPublicKey, escrow_acc, data, streamflowTreasuryTokens, partnerTokens, ixs, commitment, hash, tx, rawTx, signature;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        streamPublicKey = new web3_js_1.PublicKey(id);
                        return [4 /*yield*/, this.connection.getAccountInfo(streamPublicKey)];
                    case 1:
                        escrow_acc = _c.sent();
                        if (!(escrow_acc === null || escrow_acc === void 0 ? void 0 : escrow_acc.data)) {
                            throw new Error("Couldn't get account info");
                        }
                        data = utils_1.decodeStream(escrow_acc === null || escrow_acc === void 0 ? void 0 : escrow_acc.data);
                        return [4 /*yield*/, ata(data.mint, constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY)];
                    case 2:
                        streamflowTreasuryTokens = _c.sent();
                        return [4 /*yield*/, ata(data.mint, data.partner)];
                    case 3:
                        partnerTokens = _c.sent();
                        ixs = [];
                        ixs.push(instructions_1.cancelStreamInstruction(this.programId, {
                            authority: invoker.publicKey,
                            sender: data.sender,
                            senderTokens: data.senderTokens,
                            recipient: data.recipient,
                            recipientTokens: data.recipientTokens,
                            metadata: streamPublicKey,
                            escrowTokens: data.escrowTokens,
                            streamflowTreasury: constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY,
                            streamflowTreasuryTokens: streamflowTreasuryTokens,
                            partner: data.partner,
                            partnerTokens: partnerTokens,
                            mint: data.mint,
                            tokenProgram: spl_token_2.TOKEN_PROGRAM_ID,
                        }));
                        commitment = typeof this.commitment == "string"
                            ? this.commitment
                            : this.commitment.commitment;
                        return [4 /*yield*/, this.connection.getRecentBlockhash(commitment)];
                    case 4:
                        hash = _c.sent();
                        tx = (_b = new web3_js_1.Transaction({
                            feePayer: invoker.publicKey,
                            recentBlockhash: hash.blockhash,
                        })).add.apply(_b, __spread(ixs));
                        return [4 /*yield*/, invoker.signTransaction(tx)];
                    case 5:
                        _c.sent();
                        rawTx = tx.serialize();
                        return [4 /*yield*/, web3_js_1.sendAndConfirmRawTransaction(this.connection, rawTx)];
                    case 6:
                        signature = _c.sent();
                        return [2 /*return*/, { ixs: ixs, tx: signature }];
                }
            });
        });
    };
    /**
     * Attempts changing the stream/vesting contract's recipient (effectively transferring the stream/vesting contract).
     * Potential associated token account rent fee (to make it rent-exempt) is paid by the transaction initiator.
     * @param {TransferStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match authorized wallet (sender or recipient) or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be transferred.
     * @param {string} data.recipientId - Address of a new recipient.
     */
    Stream.prototype.transfer = function (_a) {
        var invoker = _a.invoker, id = _a.id, recipientId = _a.recipientId;
        return __awaiter(this, void 0, void 0, function () {
            var ixs, stream, newRecipient, escrow, mint, newRecipientTokens, commitment, hash, tx, rawTx, signature;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        ixs = [];
                        stream = new web3_js_1.PublicKey(id);
                        newRecipient = new web3_js_1.PublicKey(recipientId);
                        return [4 /*yield*/, this.connection.getAccountInfo(stream)];
                    case 1:
                        escrow = _c.sent();
                        if (!(escrow === null || escrow === void 0 ? void 0 : escrow.data)) {
                            throw new Error("Couldn't get account info");
                        }
                        mint = utils_1.decodeStream(escrow === null || escrow === void 0 ? void 0 : escrow.data).mint;
                        return [4 /*yield*/, ata(mint, newRecipient)];
                    case 2:
                        newRecipientTokens = _c.sent();
                        ixs.push(instructions_1.transferStreamInstruction(this.programId, {
                            authority: invoker.publicKey,
                            newRecipient: newRecipient,
                            newRecipientTokens: newRecipientTokens,
                            metadata: stream,
                            mint: mint,
                            rent: web3_js_1.SYSVAR_RENT_PUBKEY,
                            tokenProgram: spl_token_2.TOKEN_PROGRAM_ID,
                            associatedTokenProgram: spl_token_2.ASSOCIATED_TOKEN_PROGRAM_ID,
                            systemProgram: anchor_1.web3.SystemProgram.programId,
                        }));
                        commitment = typeof this.commitment == "string"
                            ? this.commitment
                            : this.commitment.commitment;
                        return [4 /*yield*/, this.connection.getRecentBlockhash(commitment)];
                    case 3:
                        hash = _c.sent();
                        tx = (_b = new web3_js_1.Transaction({
                            feePayer: invoker.publicKey,
                            recentBlockhash: hash.blockhash,
                        })).add.apply(_b, __spread(ixs));
                        return [4 /*yield*/, invoker.signTransaction(tx)];
                    case 4:
                        _c.sent();
                        rawTx = tx.serialize();
                        return [4 /*yield*/, web3_js_1.sendAndConfirmRawTransaction(this.connection, rawTx)];
                    case 5:
                        signature = _c.sent();
                        return [2 /*return*/, { ixs: ixs, tx: signature }];
                }
            });
        });
    };
    /**
     * Tops up stream account deposited amount.
     * @param {TopupStreamParams} data
     * @param {Wallet} data.invoker - Wallet signing the transaction. It's address should match current stream sender or transaction will fail.
     * @param {string} data.id - Identifier of a stream (escrow account with metadata) to be topped up.
     * @param {u64} data.amount - Specified amount (in the smallest units) to topup (increases deposited amount).
     */
    Stream.prototype.topup = function (_a) {
        var invoker = _a.invoker, id = _a.id, amount = _a.amount;
        return __awaiter(this, void 0, void 0, function () {
            var ixs, streamPublicKey, escrow, _b, mint, partner, senderTokens, escrowTokens, streamflowTreasuryTokens, partnerTokens, commitment, hash, tx, signedAndSerializedTx, signature;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        ixs = [];
                        streamPublicKey = new web3_js_1.PublicKey(id);
                        return [4 /*yield*/, this.connection.getAccountInfo(streamPublicKey)];
                    case 1:
                        escrow = _d.sent();
                        if (!(escrow === null || escrow === void 0 ? void 0 : escrow.data)) {
                            throw new Error("Couldn't get account info");
                        }
                        _b = utils_1.decodeStream(escrow === null || escrow === void 0 ? void 0 : escrow.data), mint = _b.mint, partner = _b.partner, senderTokens = _b.senderTokens, escrowTokens = _b.escrowTokens;
                        return [4 /*yield*/, ata(mint, constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY)];
                    case 2:
                        streamflowTreasuryTokens = _d.sent();
                        return [4 /*yield*/, ata(mint, partner)];
                    case 3:
                        partnerTokens = _d.sent();
                        ixs.push(instructions_1.topupStreamInstruction(amount, this.programId, {
                            sender: invoker.publicKey,
                            senderTokens: senderTokens,
                            metadata: streamPublicKey,
                            escrowTokens: escrowTokens,
                            streamflowTreasury: constants_1.STREAMFLOW_TREASURY_PUBLIC_KEY,
                            streamflowTreasuryTokens: streamflowTreasuryTokens,
                            partner: partner,
                            partnerTokens: partnerTokens,
                            mint: mint,
                            tokenProgram: spl_token_2.TOKEN_PROGRAM_ID,
                            withdrawor: constants_1.WITHDRAWOR_PUBLIC_KEY,
                            systemProgram: anchor_1.web3.SystemProgram.programId,
                        }));
                        commitment = typeof this.commitment == "string"
                            ? this.commitment
                            : this.commitment.commitment;
                        return [4 /*yield*/, this.connection.getRecentBlockhash(commitment)];
                    case 4:
                        hash = _d.sent();
                        tx = (_c = new web3_js_1.Transaction({
                            feePayer: invoker.publicKey,
                            recentBlockhash: hash.blockhash,
                        })).add.apply(_c, __spread(ixs));
                        return [4 /*yield*/, invoker.signTransaction(tx)];
                    case 5:
                        signedAndSerializedTx = (_d.sent()).serialize();
                        return [4 /*yield*/, web3_js_1.sendAndConfirmRawTransaction(this.connection, signedAndSerializedTx)];
                    case 6:
                        signature = _d.sent();
                        return [2 /*return*/, { ixs: ixs, tx: signature }];
                }
            });
        });
    };
    /**
     * Fetch stream data by its id (address).
     * @param {GetStreamParams} data
     * @param {Connection} data.connection - A connection to the cluster.
     * @param {string} data.id - Identifier of a stream that is fetched.
     */
    Stream.prototype.getOne = function (_a) {
        var id = _a.id;
        return __awaiter(this, void 0, void 0, function () {
            var escrow;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.connection.getAccountInfo(new web3_js_1.PublicKey(id), constants_1.TX_FINALITY_CONFIRMED)];
                    case 1:
                        escrow = _b.sent();
                        if (!(escrow === null || escrow === void 0 ? void 0 : escrow.data)) {
                            throw new Error("Couldn't get account info.");
                        }
                        return [2 /*return*/, utils_1.formatDecodedStream(utils_1.decodeStream(escrow === null || escrow === void 0 ? void 0 : escrow.data))];
                }
            });
        });
    };
    /**
     * Fetch streams/contracts by providing direction.
     * Streams are sorted by start time in ascending order.
     * @param {GetStreamsParams} data
     * @param {PublicKey} data.wallet - PublicKey of the wallet for which the streams/contracts are fetched.
     * @param {StreamType} [data.type = StreamType.All] - It can be one of: stream, vesting, all.
     * @param {StreamDirection} [data.direction = StreamDirection.All] - It can be one of: incoming, outgoing, all.
     */
    Stream.prototype.get = function (_a) {
        var wallet = _a.wallet, _b = _a.type, type = _b === void 0 ? types_1.StreamType.All : _b, _c = _a.direction, direction = _c === void 0 ? types_1.StreamDirection.All : _c;
        return __awaiter(this, void 0, void 0, function () {
            var accounts, outgoingAccounts, incomingAccounts, offset, streams, sortedStreams;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        accounts = [];
                        if (!(direction === "all")) return [3 /*break*/, 3];
                        return [4 /*yield*/, getProgramAccounts(this.connection, wallet, constants_1.STREAM_STRUCT_OFFSET_SENDER, this.cluster)];
                    case 1:
                        outgoingAccounts = _d.sent();
                        return [4 /*yield*/, getProgramAccounts(this.connection, wallet, constants_1.STREAM_STRUCT_OFFSET_RECIPIENT, this.cluster)];
                    case 2:
                        incomingAccounts = _d.sent();
                        accounts = __spread(outgoingAccounts, incomingAccounts);
                        return [3 /*break*/, 5];
                    case 3:
                        offset = direction === "outgoing"
                            ? constants_1.STREAM_STRUCT_OFFSET_SENDER
                            : constants_1.STREAM_STRUCT_OFFSET_RECIPIENT;
                        return [4 /*yield*/, getProgramAccounts(this.connection, wallet, offset, this.cluster)];
                    case 4:
                        accounts = _d.sent();
                        _d.label = 5;
                    case 5:
                        streams = {};
                        accounts.forEach(function (account) {
                            var _a;
                            var decoded = utils_1.formatDecodedStream(utils_1.decodeStream(account.account.data));
                            streams = __assign(__assign({}, streams), (_a = {}, _a[account.pubkey.toBase58()] = decoded, _a));
                        });
                        sortedStreams = Object.entries(streams).sort(function (_a, _b) {
                            var _c = __read(_a, 2), stream1 = _c[1];
                            var _d = __read(_b, 2), stream2 = _d[1];
                            return stream2.startTime - stream1.startTime;
                        });
                        if (type === "all")
                            return [2 /*return*/, sortedStreams];
                        return [2 /*return*/, type === "stream"
                                ? sortedStreams.filter(function (stream) { return stream[1].canTopup; })
                                : sortedStreams.filter(function (stream) { return !stream[1].canTopup; })];
                }
            });
        });
    };
    return Stream;
}());
exports.default = Stream;
function getProgramAccounts(connection, wallet, offset, cluster) {
    if (cluster === void 0) { cluster = types_1.Cluster.Mainnet; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, connection === null || connection === void 0 ? void 0 : connection.getProgramAccounts(new web3_js_1.PublicKey(constants_1.PROGRAM_ID[cluster]), {
                    filters: [
                        {
                            memcmp: {
                                offset: offset,
                                bytes: wallet.toBase58(),
                            },
                        },
                    ],
                })];
        });
    });
}
function ata(mint, account) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, spl_token_2.Token.getAssociatedTokenAddress(spl_token_2.ASSOCIATED_TOKEN_PROGRAM_ID, spl_token_2.TOKEN_PROGRAM_ID, mint, account)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
