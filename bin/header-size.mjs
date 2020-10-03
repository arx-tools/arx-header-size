#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import minimist from 'minimist'
import { toHex } from '../src/helpers.mjs'
import { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_UNIQUE_HEADER_SIZE } from '../src/constants.mjs'
import { exit } from 'process'

const args = minimist(process.argv.slice(2), {
  boolean: ['hex', 'verbose']
})

const filename = args._[0]

const extension = filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase()
const outputRequestedAsHex = args.hex

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
      case 'llf': {
        size = LLF_HEADER_SIZE
      }
    }

    if (outputRequestedAsHex) {
      console.log(toHex(size))
    } else {
      console.log(size)
    }
  })()
