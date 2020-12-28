const { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_UNIQUE_HEADER_SIZE, LLF_HEADER_SIZE } = require('./constants.js')

const getHeaderSize = (buffer, extension) => {
  let size = 0

  switch (extension) {
    case 'dlf':
      size = DLF_HEADER_SIZE
      break
    case 'fts': {
      const numberOfUniqueHeaders = buffer.readInt32LE(256)
      size = FTS_HEADER_SIZE + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders
    }
      break
    case 'llf': {
      size = LLF_HEADER_SIZE
    }
  }

  return size
}

module.exports = { getHeaderSize }
