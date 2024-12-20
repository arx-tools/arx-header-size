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

### Uncompressed FTS files in Arx Libertatis 1.3

Arx Libertatis feature: setting the uncompressed bytes' size in the header of an FTS file to 0 gets
interpreted as the file being uncompressed

source of discussion: https://arx-libertatis.org/irclogs/2022/%23arx.2022-09-06.log
and https://arx-libertatis.org/irclogs/2022/%23arx.2022-09-07.log

implemented in: https://github.com/arx/ArxLibertatis/commit/2d2226929780b6202f54982bacc79ddf75dbec53

available in Arx Libertatis 1.3 snapshots that came after `2022-09-17` in https://arx-libertatis.org/files/snapshots/
