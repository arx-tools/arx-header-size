import { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_UNIQUE_HEADER_SIZE } from './constants.js';

/**
 * @param {ArrayBuffer} buffer
 * @param {"dlf" | "fts" | "llf" | "ftl" | "tea" | "amb" | "cin"} format
 * @returns {{ total: number, header: number, uniqueHeaderSize: number, numberOfUniqueHeaders: number, compression: "full" | "partial" | "none" }}
 */
export function getHeaderSize(buffer, format) {
  /**
   * @type {{ total: number, header: number, uniqueHeaderSize: number, numberOfUniqueHeaders: number, compression: "full" | "partial" | "none" }}
   */
  const sizes = {
    total: 0,
    header: 0,
    uniqueHeaderSize: 0,
    numberOfUniqueHeaders: 0,
    compression: 'partial',
  };

  switch (format) {
    case 'dlf':
      {
        sizes.total = DLF_HEADER_SIZE;
        sizes.header = DLF_HEADER_SIZE;
      }
      break;
    case 'fts':
      {
        const dataView = new DataView(buffer);
        const numberOfUniqueHeaders = dataView.getInt32(256, true);

        sizes.total = FTS_HEADER_SIZE + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders;
        sizes.header = FTS_HEADER_SIZE;
        sizes.uniqueHeaderSize = FTS_UNIQUE_HEADER_SIZE;
        sizes.numberOfUniqueHeaders = numberOfUniqueHeaders;
      }
      break;
    case 'llf':
      {
        sizes.compression = 'full';
      }
      break;
    case 'ftl':
    case 'tea':
    case 'amb':
    case 'cin':
      {
        sizes.compression = 'none';
      }
      break;
  }

  return sizes;
}
