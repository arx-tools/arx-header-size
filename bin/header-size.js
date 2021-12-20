#!/usr/bin/env node

const fs = require("fs");
const minimist = require("minimist-lite");
const {
  toHex,
  fileExists,
  getPackageVersion,
  streamToBuffer,
} = require("./helpers.js");
const { getHeaderSize } = require("../src/index.js");

const SUPPORTED_EXTENSIONS = ["dlf", "fts", "llf"];

const args = minimist(process.argv.slice(2), {
  string: ["ext"],
  boolean: ["hex", "verbose", "version"],
  alias: {
    v: "version",
  },
});

(async () => {
  if (args.version) {
    console.log(await getPackageVersion());
    process.exit(0);
  }

  let filename = args._[0];
  let extension = args.ext ? args.ext.toLowerCase() : "";

  let hasErrors = false;

  let input;
  if (filename) {
    if (await fileExists(filename)) {
      input = fs.createReadStream(filename);
      if (!extension) {
        extension = filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase();
      }
    } else {
      console.error("error: input file does not exist");
      hasErrors = true;
    }
  } else {
    input = process.openStdin();
  }

  if (!SUPPORTED_EXTENSIONS.includes(extension)) {
    console.error("error: unsupported extension");
    hasErrors = true;
  }

  if (hasErrors) {
    process.exit(1);
  }

  const outputRequestedAsHex = args.hex;

  const buffer = await streamToBuffer(input);
  const sizes = getHeaderSize(buffer, extension);

  if (args.verbose) {
    console.log(`format: ${extension.toUpperCase()}`);
    console.log(``);
    console.log(
      `total uncompressed data in bytes: ${buffer.length} (${toHex(
        buffer.length
      )})`
    );
    console.log(``);
    console.log(`header size: ${sizes.header} (${toHex(sizes.header)})`);
    console.log(
      `unique header size: ${sizes.uniqueHeaderSize} (${toHex(
        sizes.uniqueHeaderSize
      )})`
    );
    console.log(`number of unique headers: ${sizes.numberOfUniqueHeaders}`);
  } else {
    console.log(outputRequestedAsHex ? toHex(sizes.total) : sizes.total);
  }
})();
