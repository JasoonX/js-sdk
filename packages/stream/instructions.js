"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var buffer_1 = require("buffer");
var web3_js_1 = require("@solana/web3.js");
var js_sha256_1 = require("js-sha256");
var Layout = __importStar(require("./layout"));
exports.createStreamInstruction = function (data, programId, accounts) {
    var keys = [
        { pubkey: accounts.sender, isSigner: true, isWritable: true },
        { pubkey: accounts.senderTokens, isSigner: false, isWritable: true },
        { pubkey: accounts.payer, isSigner: true, isWritable: true },
        { pubkey: accounts.recipient, isSigner: false, isWritable: true },
        { pubkey: accounts.metadata, isSigner: true, isWritable: true },
        { pubkey: accounts.escrowTokens, isSigner: false, isWritable: true },
        { pubkey: accounts.recipientTokens, isSigner: false, isWritable: true },
        {
            pubkey: accounts.streamflowTreasury,
            isSigner: false,
            isWritable: true,
        },
        {
            pubkey: accounts.streamflowTreasuryTokens,
            isSigner: false,
            isWritable: true,
        },
        { pubkey: accounts.withdrawor, isSigner: false, isWritable: true },
        { pubkey: accounts.partner, isSigner: false, isWritable: true },
        { pubkey: accounts.partnerTokens, isSigner: false, isWritable: true },
        { pubkey: accounts.mint, isSigner: false, isWritable: false },
        { pubkey: accounts.feeOracle, isSigner: false, isWritable: false },
        { pubkey: accounts.rent, isSigner: false, isWritable: false },
        { pubkey: accounts.timelockProgram, isSigner: false, isWritable: false },
        { pubkey: accounts.tokenProgram, isSigner: false, isWritable: false },
        {
            pubkey: accounts.associatedTokenProgram,
            isSigner: false,
            isWritable: false,
        },
        { pubkey: accounts.systemProgram, isSigner: false, isWritable: false },
    ];
    var bufferData = buffer_1.Buffer.alloc(Layout.createStreamLayout.span);
    var encodedUIntArray = new TextEncoder().encode(data.name);
    var streamNameBuffer = buffer_1.Buffer.alloc(64).fill(encodedUIntArray, 0, encodedUIntArray.byteLength);
    var decodedData = {
        start_time: data.start.toBuffer(),
        net_amount_deposited: data.depositedAmount.toBuffer(),
        period: data.period.toBuffer(),
        amount_per_period: data.amountPerPeriod.toBuffer(),
        cliff: data.cliff.toBuffer(),
        cliff_amount: data.cliffAmount.toBuffer(),
        cancelable_by_sender: data.cancelableBySender,
        cancelable_by_recipient: data.cancelableByRecipient,
        automatic_withdrawal: data.automaticWithdrawal,
        transferable_by_sender: data.transferableBySender,
        transferable_by_recipient: data.transferableByRecipient,
        can_topup: data.canTopup,
        stream_name: streamNameBuffer,
        withdraw_frequency: data.withdrawFrequency.toBuffer(),
    };
    var encodeLength = Layout.createStreamLayout.encode(decodedData, bufferData);
    bufferData = bufferData.slice(0, encodeLength);
    bufferData = buffer_1.Buffer.concat([
        buffer_1.Buffer.from(js_sha256_1.sha256.digest("global:create")).slice(0, 8),
        bufferData,
    ]);
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: programId,
        data: bufferData,
    });
};
exports.withdrawStreamInstruction = function (amount, programId, _a) {
    var authority = _a.authority, recipient = _a.recipient, recipientTokens = _a.recipientTokens, metadata = _a.metadata, escrowTokens = _a.escrowTokens, streamflowTreasury = _a.streamflowTreasury, streamflowTreasuryTokens = _a.streamflowTreasuryTokens, partner = _a.partner, partnerTokens = _a.partnerTokens, mint = _a.mint, tokenProgram = _a.tokenProgram;
    var keys = [
        { pubkey: authority, isSigner: true, isWritable: true },
        { pubkey: recipient, isSigner: false, isWritable: true },
        { pubkey: recipientTokens, isSigner: false, isWritable: true },
        { pubkey: metadata, isSigner: false, isWritable: true },
        { pubkey: escrowTokens, isSigner: false, isWritable: true },
        {
            pubkey: streamflowTreasury,
            isSigner: false,
            isWritable: true,
        },
        { pubkey: streamflowTreasuryTokens, isSigner: false, isWritable: true },
        { pubkey: partner, isSigner: false, isWritable: true },
        { pubkey: partnerTokens, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: tokenProgram, isSigner: false, isWritable: false },
    ];
    var data = buffer_1.Buffer.alloc(Layout.withdrawStreamLayout.span);
    var decodedData = { amount: amount.toBuffer() };
    var encodeLength = Layout.withdrawStreamLayout.encode(decodedData, data);
    data = data.slice(0, encodeLength);
    data = buffer_1.Buffer.concat([
        buffer_1.Buffer.from(js_sha256_1.sha256.digest("global:withdraw")).slice(0, 8),
        data,
    ]);
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: programId,
        data: data,
    });
};
exports.cancelStreamInstruction = function (programId, _a) {
    var authority = _a.authority, sender = _a.sender, senderTokens = _a.senderTokens, recipient = _a.recipient, recipientTokens = _a.recipientTokens, metadata = _a.metadata, escrowTokens = _a.escrowTokens, streamflowTreasury = _a.streamflowTreasury, streamflowTreasuryTokens = _a.streamflowTreasuryTokens, partner = _a.partner, partnerTokens = _a.partnerTokens, mint = _a.mint, tokenProgram = _a.tokenProgram;
    var keys = [
        { pubkey: authority, isSigner: true, isWritable: false },
        { pubkey: sender, isSigner: false, isWritable: true },
        { pubkey: senderTokens, isSigner: false, isWritable: true },
        { pubkey: recipient, isSigner: false, isWritable: true },
        { pubkey: recipientTokens, isSigner: false, isWritable: true },
        { pubkey: metadata, isSigner: false, isWritable: true },
        { pubkey: escrowTokens, isSigner: false, isWritable: true },
        {
            pubkey: streamflowTreasury,
            isSigner: false,
            isWritable: true,
        },
        { pubkey: streamflowTreasuryTokens, isSigner: false, isWritable: true },
        { pubkey: partner, isSigner: false, isWritable: true },
        { pubkey: partnerTokens, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: tokenProgram, isSigner: false, isWritable: false },
    ];
    var data = buffer_1.Buffer.from(js_sha256_1.sha256.digest("global:cancel")).slice(0, 8);
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: programId,
        data: data,
    });
};
exports.transferStreamInstruction = function (programId, _a) {
    var authority = _a.authority, newRecipient = _a.newRecipient, newRecipientTokens = _a.newRecipientTokens, metadata = _a.metadata, mint = _a.mint, rent = _a.rent, tokenProgram = _a.tokenProgram, associatedTokenProgram = _a.associatedTokenProgram, systemProgram = _a.systemProgram;
    var keys = [
        { pubkey: authority, isSigner: true, isWritable: true },
        { pubkey: newRecipient, isSigner: false, isWritable: true },
        { pubkey: newRecipientTokens, isSigner: false, isWritable: true },
        { pubkey: metadata, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: rent, isSigner: false, isWritable: false },
        { pubkey: tokenProgram, isSigner: false, isWritable: false },
        { pubkey: associatedTokenProgram, isSigner: false, isWritable: false },
        { pubkey: systemProgram, isSigner: false, isWritable: false },
    ];
    var data = buffer_1.Buffer.from(js_sha256_1.sha256.digest("global:transfer_recipient")).slice(0, 8);
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: programId,
        data: data,
    });
};
exports.topupStreamInstruction = function (amount, programId, _a) {
    var sender = _a.sender, senderTokens = _a.senderTokens, metadata = _a.metadata, escrowTokens = _a.escrowTokens, streamflowTreasury = _a.streamflowTreasury, streamflowTreasuryTokens = _a.streamflowTreasuryTokens, partner = _a.partner, partnerTokens = _a.partnerTokens, mint = _a.mint, tokenProgram = _a.tokenProgram, withdrawor = _a.withdrawor, systemProgram = _a.systemProgram;
    var keys = [
        { pubkey: sender, isSigner: true, isWritable: true },
        { pubkey: senderTokens, isSigner: false, isWritable: true },
        { pubkey: metadata, isSigner: false, isWritable: true },
        { pubkey: escrowTokens, isSigner: false, isWritable: true },
        {
            pubkey: streamflowTreasury,
            isSigner: false,
            isWritable: true,
        },
        { pubkey: streamflowTreasuryTokens, isSigner: false, isWritable: true },
        { pubkey: withdrawor, isSigner: false, isWritable: true },
        { pubkey: partner, isSigner: false, isWritable: true },
        { pubkey: partnerTokens, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: tokenProgram, isSigner: false, isWritable: false },
        { pubkey: systemProgram, isSigner: false, isWritable: false },
    ];
    var data = buffer_1.Buffer.alloc(Layout.topupStreamLayout.span);
    var decodedData = { amount: amount.toBuffer() };
    var encodeLength = Layout.topupStreamLayout.encode(decodedData, data);
    data = data.slice(0, encodeLength);
    data = buffer_1.Buffer.concat([
        buffer_1.Buffer.from(js_sha256_1.sha256.digest("global:topup")).slice(0, 8),
        data,
    ]);
    return new web3_js_1.TransactionInstruction({
        keys: keys,
        programId: programId,
        data: data,
    });
};
