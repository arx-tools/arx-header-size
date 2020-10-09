#!/usr/bin/env node --experimental-modules

import fs from 'fs'
import minimist from 'minimist'
import { toHex } from '../src/helpers.mjs'
import { DLF_HEADER_SIZE, FTS_HEADER_SIZE, FTS_UNIQUE_HEADER_SIZE } from '../src/constants.mjs'
import { fileExists, getPackageVersion, streamToBuffer } from './helpers.mjs'

const SUPPORTED_EXTENSIONS = ['dlf', 'fts', 'llf']

const args = minimist(process.argv.slice(2), {
  string: ['ext'],
  boolean: ['hex', 'verbose', 'version']
});

(async () => {
  if (args.version) {
    console.log(await getPackageVersion())
    process.exit(0)
  }

  let filename = args._[0]
  let extension = args.ext ? args.ext.toLowerCase() : ''

  let hasErrors = false

  let input
  if (filename) {
    if (await fileExists(filename)) {
      input = fs.createReadStream(filename)
      if (!extension) {
        extension = filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase()
      }
    } else {
      console.error('error: input file does not exist')
      hasErrors = true
    }
  } else {
    input = process.openStdin()
  }

  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    console.error('error: unsupported extension')
    hasErrors = true
  }

  if (hasErrors) {
    process.exit(1)
  }

  const outputRequestedAsHex = args.hex

  let size = 0

  switch (extension) {
    case 'dlf':
      size = DLF_HEADER_SIZE
      break
    case 'fts': {
      const buffer = await streamToBuffer(input)
      const numberOfUniqueHeaders = buffer.readInt32LE(256)
      size = FTS_HEADER_SIZE + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders
    }
      break
    case 'llf': {
      size = LLF_HEADER_SIZE
    }
  }

  console.log(outputRequestedAsHex ? toHex(size) : size)
})()
