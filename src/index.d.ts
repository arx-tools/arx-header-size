export declare function getHeaderSize(
  buffer: ArrayBuffer,
  format: 'dlf' | 'fts' | 'llf' | 'ftl' | 'tea' | 'amb' | 'cin'
): {
  total: number;
  header: number;
  uniqueHeaderSize: number;
  numberOfUniqueHeaders: number;
  compression: 'full' | 'partial' | 'none';
};
