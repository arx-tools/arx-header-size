# arx-header-size

Returns the header size for Arx Fatalis files with dynamic headers

This is needed, because the files are partially compressed and this number can be given as an offset for [node-pkware](https://github.com/meszaros-lajos-gyorgy/node-pkware)

## Supported formats

`dlf`, `fts` and `llf`

## Usage

`npx arx-header-size "C:\arx\arx-pak-full\final\GAME\GRAPH\Levels\level8\fast.fts"`

outputs `1816`

`npx arx-header-size "C:\arx\arx-pak-full\final\GAME\GRAPH\Levels\level8\fast.fts" --hex`

outputs `0x718`

## Todos

* implement for FTL files
* add --verbose option, which would list out the elements of calculation

verbose option would output something, like:

```
format: FTS

total uncompressed data in bytes: 1816 (0x718)

header size: 280 (0x118)
unique header size: 768 (0x300)
number of unique headers: 2
```
