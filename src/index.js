/* eslint-disable no-bitwise */
const zlib = require('zlib');
const assert = require('assert');


module.exports = (args) => {
  const options = Object.assign({
    gzipLevel: zlib.constants.Z_BEST_COMPRESSION
  }, args);

  return {
    compress: (array) => {
      const uncompressed = Buffer.alloc(Math.ceil((Math.max(0, ...array) + 2) / 8));
      array.forEach((entry) => {
        uncompressed[Math.floor(entry / 8)] |= (1 << (entry % 8));
      });
      const compressed = zlib.gzipSync(uncompressed, { level: options.gzipLevel });

      // Last byte of uncompressed and compressed is zero
      // => uncompressed: by definition
      // => compressed: contains ISIZE, so is zero unless input gets HUGE (several GB)
      assert((uncompressed[uncompressed.length - 1] & (1 << 7)) === 0);
      assert((compressed[compressed.length - 1] & (1 << 7)) === 0);

      compressed[compressed.length - 1] |= (1 << 7);
      return (compressed.length < uncompressed.length ? compressed : uncompressed).toString('base64');
    },
    decompress: (string) => {
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
