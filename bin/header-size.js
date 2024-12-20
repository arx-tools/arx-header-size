#!/usr/bin/env -S node --enable-source-maps

import fs from 'node:fs';
import process from 'node:process';
import minimist from 'minimist-lite';
import { toHex, getPackageVersion, streamToBuffer, fileExists } from './helpers.js';
import { getHeaderSize } from '../src/index.js';

const SUPPORTED_FORMATS = ['dlf', 'fts', 'llf', 'ftl', 'tea', 'amb', 'cin'];

const args = minimist(process.argv.slice(2), {
  string: ['format'],
  boolean: ['hex', 'verbose', 'version'],
  alias: {
    v: 'version',
  },
});

if (args.version) {
  const version = await getPackageVersion();
  console.log(`arx-header-size - version ${version}`);
  process.exit(0);
}

const filename = args._[0];

let format = args.format ? args.format.toLowerCase() : '';

let hasErrors = false;

/**
 * @type {NodeJS.ReadableStream}
 */
let input;

if (filename) {
  if (await fileExists(filename)) {
    input = fs.createReadStream(filename);
    if (!format) {
      format = filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase();
    }
  } else {
    console.error('error: input file does not exist');
    hasErrors = true;
  }
} else {
  process.stdin.resume();
  input = process.stdin;
}

if (!SUPPORTED_FORMATS.includes(format)) {
  console.error('error: unsupported format');
  hasErrors = true;
}

if (hasErrors) {
  process.exit(1);
}

const outputRequestedAsHex = args.hex;

const buffer = await streamToBuffer(input);
const sizes = getHeaderSize(buffer.buffer, format);

if (args.verbose) {
  console.log(`format: ${format.toUpperCase()}`);
  console.log(``);

  switch (sizes.compression) {
    case 'full':
      console.log('file is fully compressed');
      break;
    case 'partial':
      console.log(`total uncompressed data in bytes: ${sizes.total} (${toHex(sizes.total)})`);
      console.log(``);
      console.log(`header size: ${sizes.header} (${toHex(sizes.header)})`);
      console.log(`unique header size: ${sizes.uniqueHeaderSize} (${toHex(sizes.uniqueHeaderSize)})`);
      console.log(`number of unique headers: ${sizes.numberOfUniqueHeaders}`);
      break;
    case 'none':
      console.log('file is not compressed');
      break;
  }
} else {
  switch (sizes.compression) {
    case 'full':
      console.log(outputRequestedAsHex ? '0x0' : 0);
      break;
    case 'partial':
      console.log(outputRequestedAsHex ? toHex(sizes.total) : sizes.total);
      break;
    case 'none':
      console.log('not compressed');
      break;
  }
}
