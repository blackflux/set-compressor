const zlib = require('zlib');


module.exports = (args) => {
  const options = Object.assign({
    gzipLevel: zlib.constants.Z_BEST_COMPRESSION
  }, args);

  return {
    compress: input => zlib
      .gzipSync(input
        .reduce((p, c) => {
          // eslint-disable-next-line no-param-reassign
          p[c] = 1;
          return p;
        }, Buffer.alloc(Math.max(...input) + 1)), { level: options.gzipLevel })
      .toString('base64'),
    decompress: input => zlib
      .gunzipSync(Buffer.from(input, 'base64')).reduce(
        (p, c, idx) => {
          if (c === 1) {
            p.push(idx);
          }
          return p;
        },
        []
      )
  };
};
