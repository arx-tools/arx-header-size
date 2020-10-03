#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import minimist from 'minimist'
import { toHex } from '../src/helpers.mjs'
import { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_UNIQUE_HEADER_SIZE } from '../src/constants.mjs'
import { fileExists, getPackageVersion } from './helpers.mjs'

const args = minimist(process.argv.slice(2), {
  boolean: ['hex', 'verbose', 'version']
})

if (args.version) {
  console.log(getPackageVersion())
  process.exit(0)
}

const filename = args._[0]

let hasErrors = false

if (!filename) {
  console.error('error: filename not specified')
  hasErrors = true
} else if (!fileExists(filename)) {
  console.error('error: given file does not exist')
  hasErrors = true
}

if (hasErrors) {
  process.exit(1)
}

const extension = filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase()
const supportedExtensions = ['dlf', 'fts', 'llf']

if (!supportedExtensions.includes(extension)) {
  console.error('error: unsupported file format')
  process.exit(1)
}

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
