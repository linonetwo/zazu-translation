# [Zazu](https://github.com/tinytacoteam/zazu) translation

## Usage

Start a query with any supported language (`ch`, `en`, `es`, `fr`, `it`, `pl`, `pt`, `ru`). i.e.

For example, `en Schloss` will show possible translations from detected language to english,

## Screenshots

## Installation

Add `"linonetwo/zazu-translation"` to your `~/.zazurc.json` plugins, like:

```json
{
  "plugins": ["linonetwo/zazu-translation"]
}
```

or with config variables:

```json
{
  "hotkey": "alt+space",
  "theme": "tinytacoteam/zazu-light-theme",
  "displayOn": "detect",
  "plugins": [
    {
      "name": "linonetwo/zazu-translation",
      "variables": {
        "anki": "true",
        "deckName": "English",
        "modelName": "基础",
        "fields": {
          "raw": "正面",
          "result": "背面"
        }
      }
    },
    "other-plugins"
  ]
}
```

### Add to Anki

First, make sure you have [anki-connect](https://foosoft.net/projects/anki-connect/) installed, then set `variables` in the `~/.zazurc.json`:

- `anki` set to `true`
- `deckName` make sure it exists and not misspelled
- `modelName` the card type you are going to use
- `fields` mapping from `raw` and `result` to the fields in your model

Make sure your Anki is open in the background, otherwise this plugin won't work.

## Disclaimer

This is a [zazu](https://github.com/tinytacoteam/zazu) plugin and I've reuse the code from [sagold/zazu-dict](https://github.com/sagold/zazu-dict)
