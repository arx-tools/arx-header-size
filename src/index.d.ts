export declare function getHeaderSize(
  buffer: ArrayBufferLike,
  format: 'dlf' | 'fts' | 'llf' | 'ftl' | 'tea' | 'amb' | 'cin'
): {
  total: number;
  header: number;
  uniqueHeaderSize: number;
  numberOfUniqueHeaders: number;
  compression: 'full' | 'partial' | 'none';
};

export declare const DLF_HEADER_SIZE: 8520;
export declare const FTS_HEADER_SIZE: 280;
export declare const FTS_UNIQUE_HEADER_SIZE: 768;
