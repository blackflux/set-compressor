# Sequence-Compressor

[![Build Status](https://circleci.com/gh/blackflux/sequence-compressor.png?style=shield)](https://circleci.com/gh/blackflux/sequence-compressor)
[![Test Coverage](https://img.shields.io/coveralls/blackflux/sequence-compressor/master.svg)](https://coveralls.io/github/blackflux/sequence-compressor?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=blackflux/sequence-compressor)](https://dependabot.com)
[![Dependencies](https://david-dm.org/blackflux/sequence-compressor/status.svg)](https://david-dm.org/blackflux/sequence-compressor)
[![NPM](https://img.shields.io/npm/v/sequence-compressor.svg)](https://www.npmjs.com/package/sequence-compressor)
[![Downloads](https://img.shields.io/npm/dt/sequence-compressor.svg)](https://www.npmjs.com/package/sequence-compressor)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

Compress and decompress ascending Sequences of non-negative Integers.

## Getting Started

    $ npm install --save sequence-compressor

## Usage

Consider an sequential array with gaps of the form 
`[0, 1, 2, ..., 498, 499, 500, 700, 701, 702, ..., 998, 999, 1000]`. 
We want to store this efficiently. This is where this utility comes in.

<!-- eslint-disable import/no-unresolved -->
```js
const seq = require('sequence-compressor')({/* options */});

seq.compress([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
// => H4sIAAAAAAACA2NkhAMA6+wzGQsAAAA=

seq.decompress('H4sIAAAAAAACA2NkhAMA6+wzGQsAAAA=');
// => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

```

## Options

### gzipLevel

Type: `zlib.constants`<br>
Default: `9`

Can be set to control the gzip compression level.

## Functions

### compress

Takes Array of unique, positive Integers as input and returns compressed string.

### decompress

Takes compressed string as input and returns Array of unique, positive, sorted Integers.

## Examples

```js
seq.decompress(seq.compress([2, 2, 5, 1, 0]));
// => [0, 1, 2, 5]
```
