const {
  DLF_HEADER_SIZE,
  FTS_HEADER_SIZE,
  FTS_UNIQUE_HEADER_SIZE,
  LLF_HEADER_SIZE,
} = require("./constants.js");

const getHeaderSize = (buffer, extension) => {
  const sizes = {
    total: 0,
    header: 0,
    uniqueHeaderSize: 0,
    numberOfUniqueHeaders: 0,
  };

  switch (extension) {
    case "dlf":
      sizes.total = DLF_HEADER_SIZE;
      sizes.header = DLF_HEADER_SIZE;
      break;
    case "fts":
      {
        const numberOfUniqueHeaders = buffer.readInt32LE(256);
        sizes.total =
          FTS_HEADER_SIZE + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders;
        sizes.header = FTS_HEADER_SIZE;
        sizes.uniqueHeaderSize = FTS_UNIQUE_HEADER_SIZE;
        sizes.numberOfUniqueHeaders = numberOfUniqueHeaders;
      }
      break;
    case "llf": {
      sizes.total = LLF_HEADER_SIZE;
      sizes.header = LLF_HEADER_SIZE;
    }
  }

  return sizes;
};

module.exports = { getHeaderSize };
