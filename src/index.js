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
        const uncompressedSize = dataView.getInt32(264, true);
        /**
         * Arx Libertatis feature: setting the uncompressed bytes' size in the header of an FTS file to 0 gets
         * interpreted as the file being uncompressed
         *
         * source of discussion: https://arx-libertatis.org/irclogs/2022/%23arx.2022-09-06.log
         * and https://arx-libertatis.org/irclogs/2022/%23arx.2022-09-07.log
         *
         * implemented in: https://github.com/arx/ArxLibertatis/commit/2d2226929780b6202f54982bacc79ddf75dbec53
         *
         * available in Arx Libertatis 1.3 snapshots that came after `2022-09-17` in https://arx-libertatis.org/files/snapshots/
         */
        if (uncompressedSize === 0) {
          sizes.compression = 'none';
        } else {
          const numberOfUniqueHeaders = dataView.getInt32(256, true);

          sizes.total = FTS_HEADER_SIZE + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders;
          sizes.header = FTS_HEADER_SIZE;
          sizes.uniqueHeaderSize = FTS_UNIQUE_HEADER_SIZE;
          sizes.numberOfUniqueHeaders = numberOfUniqueHeaders;
        }
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
