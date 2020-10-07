# arx-header-size

Returns the header size for Arx Fatalis files with dynamic headers

This is needed, because the files are partially compressed and this number can be given as an offset for [node-pkware](https://github.com/meszaros-lajos-gyorgy/node-pkware)

## Supported formats

`dlf`, `fts` and `llf`

## Usage

`npx arx-header-size "C:\arx\arx-pak-full\final\GAME\GRAPH\Levels\level8\fast.fts"`

outputs `1816`

`npx arx-header-size fast.fts --hex`

outputs `0x718`

`npx arx-header-size level8.dlf.unpacked.json --ext=dlf`

outputs `8520`

`cat level8.fts | arx-header-size --ext=fts`
