import { PublicKey } from "@solana/web3.js";
import { Cluster, LocalCluster } from "./types";
export declare const TX_FINALITY_CONFIRMED = "confirmed";
export declare const STREAM_STRUCT_OFFSET_SENDER = 49;
export declare const STREAM_STRUCT_OFFSET_RECIPIENT = 113;
export declare const PROGRAM_ID: {
    devnet: string;
    "mainnet-beta": string;
    testnet: string;
    local: string;
};
export declare const STREAMFLOW_PROGRAM_ID = "strmRqUCoQUgGUan5YhzUZa6KqdzwX5L6FpUxfmKg5m";
export declare const STREAMFLOW_DEVNET_PROGRAM_ID = "HqDGZjaVRXJ9MGRQEw7qDc2rAr6iH1n1kAQdCZaCMfMZ";
export declare const STREAMFLOW_TREASURY_PUBLIC_KEY: PublicKey;
export declare const WITHDRAWOR_PUBLIC_KEY: PublicKey;
