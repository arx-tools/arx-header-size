import {
  DLF_HEADER_SIZE,
  FTS_HEADER_SIZE,
  FTS_HEADER_SIZE_LEGACY,
  FTS_UNIQUE_HEADER_SIZE,
} from './constants.js';

export { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_HEADER_SIZE_LEGACY, FTS_UNIQUE_HEADER_SIZE };

/**
 * The format version of the FTS files whose header carries the uncompressed size and the padding.
 *
 * @remarks
 * The files before it (the demo is 0.139) have a 264 byte header, the unique headers start right after the version.
 */
const FTS_VERSION_WITH_SIZE_FIELDS = 0.141;

/**
 * @param {ArrayBufferLike} buffer
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
        const version = dataView.getFloat32(260, true);
        // 0.141 added the uncompressed size and the padding: an older file starts the unique headers 16 bytes earlier
        const headerSize = version < FTS_VERSION_WITH_SIZE_FIELDS ? FTS_HEADER_SIZE_LEGACY : FTS_HEADER_SIZE;

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
        if (headerSize === FTS_HEADER_SIZE && dataView.getInt32(264, true) === 0) {
          sizes.compression = 'none';
        } else {
          sizes.total = headerSize + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders;
          sizes.header = headerSize;
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
