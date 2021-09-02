# Set-Compressor

[![Build Status](https://circleci.com/gh/blackflux/set-compressor.png?style=shield)](https://circleci.com/gh/blackflux/set-compressor)
[![Test Coverage](https://img.shields.io/coveralls/blackflux/set-compressor/master.svg)](https://coveralls.io/github/blackflux/set-compressor?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=blackflux/set-compressor)](https://dependabot.com)
[![Dependencies](https://david-dm.org/blackflux/set-compressor/status.svg)](https://david-dm.org/blackflux/set-compressor)
[![NPM](https://img.shields.io/npm/v/set-compressor.svg)](https://www.npmjs.com/package/set-compressor)
[![Downloads](https://img.shields.io/npm/dt/set-compressor.svg)](https://www.npmjs.com/package/set-compressor)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

Compress and decompress Sets of non-negative Integers.

## Getting Started

    $ npm install --save set-compressor

## Usage

Consider an sequential array with gaps of the form 
`[0, 1, 2, ..., 498, 499, 500, 700, 701, 702, ..., 998, 999, 1000]`. 
We want to store this efficiently. This is where this utility comes in handy.

<!-- eslint-disable import/no-unresolved -->
```js
const compressor = require('set-compressor').Compressor({/* options */});

compressor.compress([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// => /wc=

compressor.decompress('/wc=');
// => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

Further examples can be found below.

## Compressor

### Options

The following options can be passed in when creating a Compressor.

#### gzip

Type: `constants.GZIP_MODE`<br>
Default: `AUTO`

Controls how to use gzip: `AUTO`, `FORCE` and `NEVER`, 
where the default only uses compression if it improves the result size.

#### gzipLevel

Type: `zlib.constants`<br>
Default: `Z_BEST_COMPRESSION`

Can be set to control the gzip compression level.

### Functions

The following functions are available on the created Compressor.

#### compress(\<iterable\>)

Takes Iterable of non-negative Integers as input and returns compressed string.

#### decompress(\<string\>)

Takes compressed string as input and returns Array of unique, non-negative, sorted Integers.

## Constants

### GZIP_MODE

Values `AUTO`, `NEVER`, `FORCE`

Defines gzip mode used internally.

## Examples

<!-- eslint-disable import/no-unresolved -->
```js
const compressor = require('set-compressor').Compressor({/* options */});

compressor.compress([0, 1, 2, /* ..., */ 9998, 9999, 10000]);
// => "H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA="

compressor.decompress('H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA=');
// => [0, 1, 2, ..., 9998, 9999, 10000]

compressor.decompress(compressor.compress([2, 2, 5, 1, 0]));
// => [0, 1, 2, 5]
```

## Gotchas and Lmitations

This library operates with Arrays for performance reasons.

Any iterable containing non-negative integers can be provided as input,
but re-inflating always outputs a unique and ordered Array.

This library is not meant to be used with and wont work well with huge Integers. 
