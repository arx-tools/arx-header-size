import fs from 'fs'
import { toHex } from './helpers.mjs'
import { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_UNIQUE_HEADER_SIZE } from './constants.mjs'

const filename = process.argv.slice(2)[0]
const extension = filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase()

const outputRequestedAsHex = process.argv[3] === '--hex'

  ; (async () => {
    let size = 0

    switch (extension) {
      case 'dlf':
        size = DLF_HEADER_SIZE
        break
      case 'fts': {
        const buffer = await fs.promises.readFile(filename)
        const numberOfUniqueHeaders = buffer.readInt32LE(256)
        size = FTS_HEADER_SIZE + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders
      }
        break
    }

    if (outputRequestedAsHex) {
      console.log(toHex(size))
    } else {
      console.log(size)
    }
  })()
