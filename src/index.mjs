import fs from 'fs'

const { readFile } = fs.promises

const filename = process.argv.slice(2)[0]
const extension = filename.match(/\.([a-zA-Z]+)$/)[1].toLowerCase()

const outputRequestedAsHex = process.argv[3] === '--hex'

  ; (async () => {
    let size = 0

    switch (extension) {
      case 'dlf':
        size = 8520
        break
      case 'fts': {
        const buffer = await readFile(filename)
        const numberOfUniqueHeaders = buffer.readInt32LE(256)
        size = 280 + 768 * numberOfUniqueHeaders
      }
        break
    }

    if (outputRequestedAsHex) {
      console.log('0x' + size.toString(16))
    } else {
      console.log(size)
    }
  })()
