const zlib = require('zlib');


module.exports = (args) => {
  const options = Object.assign({
    gzipLevel: zlib.constants.Z_BEST_COMPRESSION
  }, args);

  return {
    compress: (array) => {
      const uncompressed = Buffer.alloc(Math.max(0, ...array) + 1);
      array.forEach((entry) => {
        uncompressed[entry] = 1;
      });
      const compressed = zlib.gzipSync(uncompressed, { level: options.gzipLevel });
      return (
        compressed.length < uncompressed.length
          ? Buffer.concat([Buffer.from([1]), compressed])
          : Buffer.concat([Buffer.from([0]), uncompressed])
      ).toString('base64');
    },
    decompress: (string) => {
      const decoded = Buffer.from(string, 'base64');
      const uncompressed = decoded[0] !== 0 ? zlib.gunzipSync(decoded.slice(1)) : decoded.slice(1);
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
