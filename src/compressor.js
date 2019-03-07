/* eslint-disable no-bitwise */
const zlib = require('zlib');
const assert = require('assert');
const constants = require('./constants');

module.exports.Compressor = (args) => {
  const options = Object.assign({
    gzip: constants.GZIP_MODE.AUTO,
    gzipLevel: zlib.constants.Z_BEST_COMPRESSION
  }, args);
  assert(Object.keys(options).length === 2);
  assert(Object.keys(constants.GZIP_MODE).includes(options.gzip));
  assert([0, 1, 2, 3, 4, 5, 6, 7, 8, 9].includes(options.gzipLevel));

  return {
    compress: (iterable) => {
      assert(
        iterable !== null && typeof iterable[Symbol.iterator] === 'function',
        'Input Not Iterable'
      );
      let bitLength = 0;
      iterable.forEach((entry) => {
        assert(
          Number.isInteger(entry) && entry >= 0,
          'Input Not Non-Negative Integer'
        );
        if (bitLength < entry) {
          bitLength = entry;
        }
      });
      const byteLength = Math.ceil((bitLength + 2) / 8);
      const uncompressed = Buffer.alloc(byteLength);
      iterable.forEach((entry) => {
        uncompressed[Math.floor(entry / 8)] |= (1 << (entry % 8));
      });
      if (options.gzip === constants.GZIP_MODE.NEVER) {
        return uncompressed.toString('base64');
      }

      const compressed = zlib.gzipSync(uncompressed, { level: options.gzipLevel });
      // Last byte of uncompressed and compressed is zero
      // => uncompressed: by definition
      // => compressed: contains ISIZE, so is zero unless input gets HUGE (several GB)
      assert(
        (uncompressed[uncompressed.length - 1] & (1 << 7)) === 0,
        'Internal Error (Uncompressed)'
      );
      assert(
        (compressed[compressed.length - 1] & (1 << 7)) === 0,
        'Internal Error (Compressed)'
      );
      compressed[compressed.length - 1] |= (1 << 7);
      if (options.gzip === constants.GZIP_MODE.AUTO) {
        return (compressed.length < uncompressed.length ? compressed : uncompressed).toString('base64');
      }
      // constants.GZIP_MODE.FORCE
      return compressed.toString('base64');
    },
    decompress: (string) => {
      assert(
        typeof string === 'string',
        'Input Not String'
      );
      const decoded = Buffer.from(string, 'base64');
      let uncompressed;
      if ((decoded[decoded.length - 1] & (1 << 7)) !== 0) {
        decoded[decoded.length - 1] &= ~(1 << 7);
        uncompressed = zlib.gunzipSync(decoded);
      } else {
        uncompressed = decoded;
      }
      const array = [];
      uncompressed.forEach((e, idx) => {
        for (let bit = 0; bit < 8; bit += 1) {
          if ((e & (1 << bit)) !== 0) {
            array.push(idx * 8 + bit);
          }
        }
      });
      return array;
    }
  };
};
