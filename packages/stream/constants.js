"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var web3_js_1 = require("@solana/web3.js");
var types_1 = require("./types");
exports.TX_FINALITY_CONFIRMED = "confirmed";
exports.STREAM_STRUCT_OFFSET_SENDER = 49;
exports.STREAM_STRUCT_OFFSET_RECIPIENT = 113;
exports.PROGRAM_ID = (_a = {},
    _a[types_1.Cluster.Devnet] = "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ",
    _a[types_1.Cluster.Mainnet] = "strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m",
    _a[types_1.Cluster.Testnet] = "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ",
    _a[types_1.LocalCluster.Local] = "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ",
    _a);
exports.STREAMFLOW_PROGRAM_ID = "strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m";
exports.STREAMFLOW_DEVNET_PROGRAM_ID = "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ";
exports.STREAMFLOW_TREASURY_PUBLIC_KEY = new web3_js_1.PublicKey("5SEpbdjFK5FxwTvfsGMXVQTD2v4M2c5tyRTxhdsPkgDw");
exports.WITHDRAWOR_PUBLIC_KEY = new web3_js_1.PublicKey("wdrwhnCv4pzW8beKsbPa4S2UDZrXenjg16KJdKSpb5u");
