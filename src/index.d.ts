/// <reference types="node" />
import { Buffer } from "node:buffer";

export declare const getHeaderSize: (
  buffer: Buffer,
  format: "dlf" | "fts" | "llf" | "ftl" | "tea" | "amb" | "cin"
) => {
  total: number;
  header: number;
  uniqueHeaderSize: number;
  numberOfUniqueHeaders: number;
  compression: "full" | "partial" | "none";
};
