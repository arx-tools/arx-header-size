export const DLF_HEADER_SIZE = 8520;

export const FTS_HEADER_SIZE = 280;

/**
 * The header of the FTS files of the format before 0.141.
 *
 * @remarks
 * Those files have the path, the number of unique headers and the version, and nothing else: the uncompressed size and
 * the padding came with 0.141, so the unique headers of an older file start 16 bytes earlier (the demo is 0.139).
 */
export const FTS_HEADER_SIZE_LEGACY = 264;

export const FTS_UNIQUE_HEADER_SIZE = 768;
