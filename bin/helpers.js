import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {Uint8Array[]} buffers
 * @returns {Uint8Array}
 *
 * @see https://stackoverflow.com/a/49129872/1806628
 */
function concatUint8Arrays(buffers) {
  if (buffers.length === 0) {
    return new Uint8Array(0);
  }

  const totalLength = buffers.reduce((sum, buffer) => {
    return sum + buffer.length;
  }, 0);

  const combinedBuffer = new Uint8Array(totalLength);

  let offset = 0;
  buffers.forEach((buffer) => {
    combinedBuffer.set(buffer, offset);
    offset = offset + buffer.length;
  });

  return combinedBuffer;
}

/**
 * @returns {string}
 */
function pathToPackageJson() {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  return path.resolve(dirname, '../package.json');
}

/**
 * @returns {Promise<string>}
 */
export async function getPackageVersion() {
  try {
    const rawIn = await fs.promises.readFile(pathToPackageJson(), 'utf8');
    /**
     * @type {{ version: string }}
     */
    const data = JSON.parse(rawIn);
    return data.version;
  } catch {
    return 'unknown';
  }
}

/**
 * @param {string} filename
 * @returns {Promise<boolean>}
 */
export async function fileExists(filename) {
  try {
    await fs.promises.access(filename, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * @param {NodeJS.ReadableStream} input
 * @returns {Promise<Uint8Array>}
 */
export async function streamToBuffer(input) {
  return new Promise((resolve, reject) => {
    /**
     * @type {Uint8Array[]}
     */
    const chunks = [];

    // chunk is techincally a Buffer, but here it's Uint8Array
    // "The Buffer class is a subclass of JavaScript's Uint8Array class and extends it"
    // source: https://nodejs.org/api/buffer.html#buffer
    input.on('data', (chunk) => {
      chunks.push(chunk);
    });

    input.on('end', () => {
      resolve(concatUint8Arrays(chunks));
    });

    // e is unknown
    input.on('error', (e) => {
      if (e instanceof Error) {
        reject(e);
      } else {
        reject(new Error('unknown error happened while converting stream to buffer'));
      }
    });
  });
}

/**
 * @param {number} n
 * @returns
 */
export function toHex(n) {
  return '0x' + n.toString(16);
}
