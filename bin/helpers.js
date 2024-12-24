import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * @param {ArrayBufferLike[]} buffers
 * @returns {ArrayBuffer}
 *
 * @see https://stackoverflow.com/a/49129872/1806628
 */
export function concatArrayBuffers(buffers) {
  if (buffers.length === 0) {
    return new ArrayBuffer(0);
  }

  const totalLength = buffers.reduce((sum, buffer) => {
    return sum + buffer.byteLength;
  }, 0);

  const combinedBuffer = new Uint8Array(totalLength);

  let offset = 0;
  buffers.forEach((buffer) => {
    combinedBuffer.set(new Uint8Array(buffer), offset);
    offset = offset + buffer.byteLength;
  });

  return combinedBuffer.buffer;
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
 * @returns {Promise<ArrayBuffer>}
 */
export async function streamToBuffer(input) {
  return new Promise((resolve, reject) => {
    /**
     * @type {ArrayBufferLike[]}
     */
    const chunks = [];

    input.on('data', (chunk) => {
      chunks.push(chunk.buffer);
    });

    input.on('end', () => {
      resolve(concatArrayBuffers(chunks));
    });

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
