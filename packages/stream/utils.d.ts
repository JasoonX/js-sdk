/// <reference types="node" />
import { u64 } from "@solana/spl-token";
import { Stream, DecodedStream } from "./types";
export declare const decodeStream: (buf: Buffer) => DecodedStream;
export declare const formatDecodedStream: (stream: DecodedStream) => Stream;
/**
 * Used for conversion of token amounts to their Big Number representation.
 * Get Big Number representation in the smallest units from the same value in the highest units.
 * @param {number} value - Number of tokens you want to convert to its u64 representation.
 * @param {number} decimals - Number of decimals the token has.
 */
export declare const getBN: (value: number, decimals: number) => u64;
/**
 * Used for token amounts conversion from their Big Number representation to number.
 * Get value in the highest units from u64 representation of the same value in the smallest units.
 * @param {u64} value - Big Number representation of value in the smallest units.
 * @param {number} decimals - Number of decimals the token has.
 */
export declare const getNumberFromBN: (value: u64, decimals: number) => number;
