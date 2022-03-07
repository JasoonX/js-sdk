"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
exports.Cluster = wallet_adapter_base_1.WalletAdapterNetwork;
var StreamDirection;
(function (StreamDirection) {
    StreamDirection["Outgoing"] = "outgoing";
    StreamDirection["Incoming"] = "incoming";
    StreamDirection["All"] = "all";
})(StreamDirection = exports.StreamDirection || (exports.StreamDirection = {}));
var StreamType;
(function (StreamType) {
    StreamType["Stream"] = "stream";
    StreamType["Vesting"] = "vesting";
    StreamType["All"] = "all";
})(StreamType = exports.StreamType || (exports.StreamType = {}));
var LocalCluster;
(function (LocalCluster) {
    LocalCluster["Local"] = "local";
})(LocalCluster = exports.LocalCluster || (exports.LocalCluster = {}));
