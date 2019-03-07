const zlib = require('zlib');


module.exports = (args) => {
  const options = Object.assign({
    gzipLevel: zlib.constants.Z_BEST_COMPRESSION
  }, args);

  return {
    compress: (array) => {
      const buffer = Buffer.alloc(Math.max(...array) + 1);
      array.forEach((entry) => {
        buffer[entry] = 1;
      });
      const compressed = zlib.gzipSync(buffer, { level: options.gzipLevel });
      return compressed.toString('base64');
    },
    decompress: (string) => {
      const decoded = Buffer.from(string, 'base64');
      const uncompressed = zlib.gunzipSync(decoded);
      const array = [];
      uncompressed.forEach((e, idx) => {
        if (e === 1) {
          array.push(idx);
        }
      });
      return array;
    }
  };
};
