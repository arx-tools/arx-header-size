import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  DLF_HEADER_SIZE,
  FTS_HEADER_SIZE,
  FTS_HEADER_SIZE_LEGACY,
  FTS_UNIQUE_HEADER_SIZE,
  getHeaderSize,
} from '../src/index.js'

/**
 * The path the header of a level file carries.
 */
const LEVEL_PATH = 'C:\\ARX\\Game\\Graph\\Levels\\level12\\'

/**
 * Builds a buffer with the header of an FTS file.
 *
 * @param {object} options The shape of the header.
 * @param {number} options.version The format version of the file.
 * @param {number} options.numberOfUniqueHeaders How many unique headers the file has.
 * @param {number} [options.uncompressedSize] The size of the scene, when the header carries it.
 * @param {boolean} [options.legacy] Whether the header is the 264 byte one of the format before 0.141.
 *
 * @returns {ArrayBuffer} The bytes of a file that starts with that header.
 */
function ftsBufferOf({ version, numberOfUniqueHeaders, uncompressedSize = 1, legacy = false }) {
  const headerSize = legacy ? FTS_HEADER_SIZE_LEGACY : FTS_HEADER_SIZE
  const buffer = new ArrayBuffer(headerSize + FTS_UNIQUE_HEADER_SIZE * numberOfUniqueHeaders + 64)
  const bytes = new Uint8Array(buffer)
  const view = new DataView(buffer)

  for (const [index, character] of [...LEVEL_PATH].entries()) {
    view.setUint8(index, character.charCodeAt(0))
  }

  view.setInt32(256, numberOfUniqueHeaders, true)
  view.setFloat32(260, version, true)

  if (legacy) {
    // the first unique header starts right after the version: its path is what the newer header's size and pad are
    if (numberOfUniqueHeaders > 0) {
      for (const [index, character] of [...'level12.scn'].entries()) {
        bytes[FTS_HEADER_SIZE_LEGACY + index] = character.charCodeAt(0)
      }
    }
  } else {
    view.setInt32(264, uncompressedSize, true)
    // the three padding words stay zero
  }

  return buffer
}

void test('the constants of the formats', () => {
  assert.equal(DLF_HEADER_SIZE, 8520)
  assert.equal(FTS_HEADER_SIZE, 280)
  assert.equal(FTS_HEADER_SIZE_LEGACY, 264)
  assert.equal(FTS_UNIQUE_HEADER_SIZE, 768)
})

void test('a 0.141 FTS starts its unique headers after the 280 byte header', () => {
  const sizes = getHeaderSize(ftsBufferOf({ version: 0.141, numberOfUniqueHeaders: 2 }), 'fts')

  assert.deepEqual(sizes, {
    total: 280 + 768 * 2,
    header: 280,
    uniqueHeaderSize: 768,
    numberOfUniqueHeaders: 2,
    compression: 'partial',
  })
})

void test('a 0.139 FTS starts its unique headers after the 264 byte header', () => {
  const sizes = getHeaderSize(ftsBufferOf({ version: 0.139, numberOfUniqueHeaders: 2, legacy: true }), 'fts')

  assert.deepEqual(sizes, {
    total: 264 + 768 * 2,
    header: 264,
    uniqueHeaderSize: 768,
    numberOfUniqueHeaders: 2,
    compression: 'partial',
  })
})

void test('the legacy header without unique headers is 264 bytes', () => {
  const sizes = getHeaderSize(ftsBufferOf({ version: 0.139, numberOfUniqueHeaders: 0, legacy: true }), 'fts')

  assert.equal(sizes.total, 264)
  assert.equal(sizes.header, 264)
  assert.equal(sizes.compression, 'partial')
})

void test('the newer header without unique headers is 280 bytes', () => {
  const sizes = getHeaderSize(ftsBufferOf({ version: 0.141, numberOfUniqueHeaders: 0 }), 'fts')

  assert.equal(sizes.total, 280)
  assert.equal(sizes.header, 280)
})

void test('a 0.141 FTS with a zero uncompressed size is not compressed', () => {
  const sizes = getHeaderSize(ftsBufferOf({ version: 0.141, numberOfUniqueHeaders: 2, uncompressedSize: 0 }), 'fts')

  assert.equal(sizes.compression, 'none')
})

void test('the older format has no uncompressed variant', () => {
  // the bytes of the newer uncompressed size are the path of the first unique header here, which may start with a zero
  const buffer = ftsBufferOf({ version: 0.139, numberOfUniqueHeaders: 1, legacy: true })
  const view = new DataView(buffer)

  view.setInt32(264, 0, true)

  const sizes = getHeaderSize(buffer, 'fts')

  assert.equal(sizes.compression, 'partial')
  assert.equal(sizes.total, 264 + 768)
})

void test('a DLF keeps its fixed header', () => {
  const sizes = getHeaderSize(new ArrayBuffer(DLF_HEADER_SIZE + 16), 'dlf')

  assert.equal(sizes.total, DLF_HEADER_SIZE)
  assert.equal(sizes.header, DLF_HEADER_SIZE)
  assert.equal(sizes.compression, 'partial')
})
