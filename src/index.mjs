import fs from 'fs'
import minimist from 'minimist'
import { toHex } from './helpers.mjs'
import { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_UNIQUE_HEADER_SIZE } from './constants.mjs'

const args = minimist(process.argv.slice(2), {
  string: ['filename'],
  boolean: ['hex', 'verbose']
})

const extension = args.filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase()
const outputRequestedAsHex = args.hex

  ; (async () => {
    let size = 0

    switch (extension) {
      case 'dlf':
        size = DLF_HEADER_SIZE
        break
      case 'fts': {
        const buffer = await fs.promises.readFile(args.filename)
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
