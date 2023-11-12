const {
  DLF_HEADER_SIZE,
  FTS_HEADER_SIZE,
  FTS_UNIQUE_HEADER_SIZE,
} = require("./constants.js");

const getHeaderSize = (buffer, format) => {
  const sizes = {
    total: 0,
    header: 0,
    uniqueHeaderSize: 0,
    numberOfUniqueHeaders: 0,
    compression: "partial", // full | partial | none
  };

  switch (format) {
    case "dlf":
      {
        sizes.total = DLF_HEADER_SIZE;
        sizes.header = DLF_HEADER_SIZE;
      }
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
    case "llf":
      {
        sizes.compression = "full";
      }
      break;
    case "ftl":
    case "tea":
    case "amb":
    case "cin":
      {
        sizes.compression = "none";
      }
      break;
  }

  return sizes;
};

module.exports = { getHeaderSize };
