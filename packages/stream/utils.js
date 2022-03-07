"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
var spl_token_1 = require("@solana/spl-token");
var layout_1 = require("./layout");
var decoder = new TextDecoder("utf-8");
var LE = "le"; //little endian
exports.decodeStream = function (buf) {
    var raw = layout_1.streamLayout.decode(buf);
    return {
        magic: new spl_token_1.u64(raw.magic, LE),
        version: new spl_token_1.u64(raw.version, LE),
        createdAt: new spl_token_1.u64(raw.created_at, LE),
        withdrawnAmount: new spl_token_1.u64(raw.withdrawn_amount, LE),
        canceledAt: new spl_token_1.u64(raw.canceled_at, LE),
        end: new spl_token_1.u64(raw.end_time, LE),
        lastWithdrawnAt: new spl_token_1.u64(raw.last_withdrawn_at, LE),
        sender: new web3_js_1.PublicKey(raw.sender),
        senderTokens: new web3_js_1.PublicKey(raw.sender_tokens),
        recipient: new web3_js_1.PublicKey(raw.recipient),
        recipientTokens: new web3_js_1.PublicKey(raw.recipient_tokens),
        mint: new web3_js_1.PublicKey(raw.mint),
        escrowTokens: new web3_js_1.PublicKey(raw.escrow_tokens),
        streamflowTreasury: new web3_js_1.PublicKey(raw.streamflow_treasury),
        streamflowTreasuryTokens: new web3_js_1.PublicKey(raw.streamflow_treasury_tokens),
        streamflowFeeTotal: new spl_token_1.u64(raw.streamflow_fee_total, LE),
        streamflowFeeWithdrawn: new spl_token_1.u64(raw.streamflow_fee_withdrawn, LE),
        streamflowFeePercent: new spl_token_1.u64(raw.streamflow_fee_percent, LE),
        partnerFeeTotal: new spl_token_1.u64(raw.partner_fee_total, LE),
        partnerFeeWithdrawn: new spl_token_1.u64(raw.partner_fee_withdrawn, LE),
        partnerFeePercent: new spl_token_1.u64(raw.partner_fee_percent, LE),
        partner: new web3_js_1.PublicKey(raw.partner),
        partnerTokens: new web3_js_1.PublicKey(raw.partner_tokens),
        start: new spl_token_1.u64(raw.start_time, LE),
        depositedAmount: new spl_token_1.u64(raw.net_amount_deposited, LE),
        period: new spl_token_1.u64(raw.period, LE),
        amountPerPeriod: new spl_token_1.u64(raw.amount_per_period, LE),
        cliff: new spl_token_1.u64(raw.cliff, LE),
        cliffAmount: new spl_token_1.u64(raw.cliff_amount, LE),
        cancelableBySender: Boolean(raw.cancelable_by_sender),
        cancelableByRecipient: Boolean(raw.cancelable_by_recipient),
        automaticWithdrawal: Boolean(raw.automatic_withdrawal),
        transferableBySender: Boolean(raw.transferable_by_sender),
        transferableByRecipient: Boolean(raw.transferable_by_recipient),
        canTopup: Boolean(raw.can_topup),
        name: decoder.decode(raw.stream_name),
        withdrawFrequency: new spl_token_1.u64(raw.withdraw_frequency, LE),
    };
};
exports.formatDecodedStream = function (stream) {
    var _a;
    return ({
        magic: stream.magic.toNumber(),
        version: stream.version.toNumber(),
        createdAt: stream.createdAt.toNumber(),
        withdrawnAmount: stream.withdrawnAmount,
        canceledAt: stream.canceledAt.toNumber(),
        end: stream.end.toNumber(),
        lastWithdrawnAt: stream.lastWithdrawnAt.toNumber(),
        sender: stream.sender.toBase58(),
        senderTokens: stream.senderTokens.toBase58(),
        recipient: stream.recipient.toBase58(),
        recipientTokens: stream.recipientTokens.toBase58(),
        mint: stream.mint.toBase58(),
        escrowTokens: stream.escrowTokens.toBase58(),
        streamflowTreasury: stream.streamflowTreasury.toBase58(),
        streamflowTreasuryTokens: stream.streamflowTreasuryTokens.toBase58(),
        streamflowFeeTotal: stream.streamflowFeeTotal,
        streamflowFeeWithdrawn: stream.streamflowFeeWithdrawn,
        streamflowFeePercent: stream.streamflowFeePercent.toNumber(),
        partnerFeeTotal: stream.partnerFeeTotal,
        partnerFeeWithdrawn: stream.partnerFeeWithdrawn,
        partnerFeePercent: stream.partnerFeePercent.toNumber(),
        partner: stream.partner.toBase58(),
        partnerTokens: (_a = stream.partnerTokens) === null || _a === void 0 ? void 0 : _a.toBase58(),
        start: stream.start.toNumber(),
        depositedAmount: stream.depositedAmount,
        period: stream.period.toNumber(),
        amountPerPeriod: stream.amountPerPeriod,
        cliff: stream.cliff.toNumber(),
        cliffAmount: stream.cliffAmount,
        cancelableBySender: stream.cancelableBySender,
        cancelableByRecipient: stream.cancelableByRecipient,
        automaticWithdrawal: stream.automaticWithdrawal,
        transferableBySender: stream.transferableBySender,
        transferableByRecipient: stream.transferableByRecipient,
        canTopup: stream.canTopup,
        name: stream.name,
        withdrawFrequency: stream.withdrawFrequency.toNumber(),
    });
};
/**
 * Used for conversion of token amounts to their Big Number representation.
 * Get Big Number representation in the smallest units from the same value in the highest units.
 * @param {number} value - Number of tokens you want to convert to its u64 representation.
 * @param {number} decimals - Number of decimals the token has.
 */
exports.getBN = function (value, decimals) {
    return value > (Math.pow(2, 53) - 1) / Math.pow(10, decimals)
        ? new spl_token_1.u64(value).mul(new spl_token_1.u64(Math.pow(10, decimals)))
        : new spl_token_1.u64(value * Math.pow(10, decimals));
};
/**
 * Used for token amounts conversion from their Big Number representation to number.
 * Get value in the highest units from u64 representation of the same value in the smallest units.
 * @param {u64} value - Big Number representation of value in the smallest units.
 * @param {number} decimals - Number of decimals the token has.
 */
exports.getNumberFromBN = function (value, decimals) {
    return value.gt(new spl_token_1.u64(Math.pow(2, 53) - 1))
        ? value.div(new spl_token_1.u64(Math.pow(10, decimals))).toNumber()
        : value.toNumber() / Math.pow(10, decimals);
};
