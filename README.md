# arx-header-size

Returns the header size for Arx Fatalis files

This is needed, because the files are partially compressed and this number can be given
as an offset for [node-pkware](https://github.com/arx-tools/node-pkware)

## Supported formats

- `dlf` (Danae Level File, contains general information about the level, used items and paths)
- `fts` (FasT Scene, contains the level mesh and textures)
- `llf` (Level Lighting File?, contains light entities and vertex colors)
- `ftl` (?, model files for entities)
- `tea` (?, animation files for entities)
- `amb` (Ambience, contains a list of audio files which are played in different locations)
- `cin` (Cinematics)

( https://wiki.arx-libertatis.org/Filetypes )

## Compression for each format

### DLF

DLF files are **partially compressed**, they have a fixed header size of `8520` bytes.

### FTS

FTS files are **partially compressed**, they have a fixed basic header with an arbitrary
amount of unique headers, where the amount of unique headers is stored on byte `256`.

The total uncompressed header size is `280 + 768 * <amount of unique headers>`.

Arx Libertatis 1.3 snapshots released after 2022-09-17 contain a feature
where if byte `264` of an FTS file is set to 0 then it means the whole
file is uncompressed.

### LLF

LLF files are **fully compressed**, there's no uncompressed header.

### Other files

All other files (FTL, TEA, AMB, CIN) are not compressed, they don't need to be uncompressed.

## JS API

```ts
const rawFtsData: ArrayBuffer = ... // load the contents of an FTS file as an ArrayBuffer

const { total, header, uniqueHeaderSize, numberOfUniqueHeaders, compression } = getHeaderSize(rawFtsData)
switch (compression) {
  case 'none': {
    // file is uncompressed
    break
  }
  case 'partial': {
    // first <total> bytes are uncompressed, the rest is compressed
    break
  }
  case 'full': {
    // the whole file is compressed
    break
  }
}
```

## CLI

`npx arx-header-size "C:\arx\arx-pak-full\final\GAME\GRAPH\Levels\level8\fast.fts"`

outputs `1816`

`npx arx-header-size fast.fts --hex`

outputs `0x718`

`npx arx-header-size level8.dlf.unpacked.json --format=dlf`

outputs `8520`

`cat level8.fts | arx-header-size --format=fts`

## Command Line Parameters

### version

`arx-header-size --version` or `arx-header-size -v`

gives back the version of arx-header-size

### hex

`arx-header-size --hex fast.fts`

gives back the header size in hexadecimal string instead of decimal with `0x` prefix

### verbose

`arx-header-size fast.fts --verbose`

prints out more details of the header

```
format: FTS

total uncompressed data in bytes: 1816 (0x718)

header size: 280 (0x118)
unique header size: 768 (0x300)
number of unique headers: 2
```
