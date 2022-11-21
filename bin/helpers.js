const fs = require("fs");

const fileExists = async (filename) => {
  try {
    await fs.promises.access(filename, fs.constants.R_OK);
    return true;
  } catch (error) {
    return false;
  }
};

const getPackageVersion = async () => {
  try {
    const { version } = require("../package.json");
    return version;
  } catch (error) {
    return "unknown";
  }
};

const streamToBuffer = (input) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    input.on("data", (chunk) => {
      chunks.push(chunk);
    });
    input.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    input.on("error", (e) => {
      reject(e);
    });
  });

const toHex = (n) => {
  return "0x" + n.toString(16);
};

module.exports = {
  toHex,
  streamToBuffer,
  getPackageVersion,
  fileExists,
};
