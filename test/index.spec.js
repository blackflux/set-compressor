const expect = require('chai').expect;
const SetCompressor = require('../src/index');

describe('Testing Functionality', () => {
  const compressor = SetCompressor.Compressor();

  const validate = (input) => {
    const result = compressor.decompress(compressor.compress(input));
    expect(input).to.deep.equal(Array.isArray(input) ? result : new Set(result));
  };

  it('Testing Basic Array', () => {
    validate([1, 2, 3, 160, 235, 657, 5634]);
    validate(Array.from(Array(10000).keys()));
  });

  it('Testing Basic Set', () => {
    validate(new Set([1, 2, 3, 160, 235, 657, 5634]));
  });

  it('Testing Empty Array', () => {
    validate([]);
  });

  it('Test Large Array Size', () => {
    validate(Array.from(Array(1000000).keys()));
  });

  it('Test Random Bits', () => {
    for (let n = 0; n < 1000; n += 1){
      const input = [];
      const perentage = Math.random();
      for (let i = 0; i < 10000; i += 1) {
        if (Math.random() < perentage) {
          input.push(i);
        }
      }
      validate(input);
    }
  }).timeout(10000);

  describe('Testing Gzip Modes', () => {
    const compressorAuto = SetCompressor.Compressor({
      gzip: SetCompressor.constants.GZIP_MODE.AUTO
    });
    const compressorForce = SetCompressor.Compressor({
      gzip: SetCompressor.constants.GZIP_MODE.FORCE
    });
    const compressorNever = SetCompressor.Compressor({
      gzip: SetCompressor.constants.GZIP_MODE.NEVER
    });
    const compressororceButNoCompression = SetCompressor.Compressor({
      gzip: SetCompressor.constants.GZIP_MODE.FORCE,
      gzipLevel: 0
    });

    it('Testing Empty', () => {
      const input = [];
      expect(compressorAuto.compress(input)).to.equal('AA==');
      expect(compressorForce.compress(input)).to.equal('H4sIAAAAAAACA2MAAI3vAtIBAACA');
      expect(compressorNever.compress(input)).to.equal('AA==');
      expect(compressororceButNoCompression.compress(input)).to.equal('H4sIAAAAAAAEAwEBAP7/AI3vAtIBAACA');
    });

    it('Testing Small', () => {
      const input = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      expect(compressorAuto.compress(input)).to.equal('/wc=');
      expect(compressorForce.compress(input)).to.equal('H4sIAAAAAAACA/vPDgAueplMAgAAgA==');
      expect(compressorNever.compress(input)).to.equal('/wc=');
      expect(compressororceButNoCompression.compress(input)).to.equal('H4sIAAAAAAAEAwECAP3//wcueplMAgAAgA==');
    });

    it('Testing Medium', () => {
      const input = Array.from(Array(200).keys());
      expect(compressorAuto.compress(input)).to.equal('H4sIAAAAAAACA/v/HwdgAADNM+XfGgAAgA==');
      expect(compressorForce.compress(input)).to.equal('H4sIAAAAAAACA/v/HwdgAADNM+XfGgAAgA==');
      expect(compressorNever.compress(input)).to.equal('/////////////////////////////////wA=');
      expect(compressororceButNoCompression.compress(input))
        .to.equal('H4sIAAAAAAAEAwEaAOX//////////////////////////////////wDNM+XfGgAAgA==');
    });
  });

  it('Testing Compression', () => {
    expect(compressor.compress(Array.from(Array(10000).keys())))
      .to.deep.equal('H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA=');
    expect(compressor.compress([10000]))
      .to.deep.equal('H4sIAAAAAAACA2NgGAWjYBSMguEKGAGZHN5k4wQAgA==');
  });

  it('Testing Readme Base Example', () => {
    expect(compressor.compress([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
      .to.deep.equal('/wc=');
    expect(compressor.decompress('/wc='))
      .to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    expect(compressor.compress(Array.from(Array(10000).keys())))
      .to.deep.equal('H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA=');
    expect(compressor.decompress('H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA='))
      .to.deep.equal(Array.from(Array(10000).keys()));
  });

  it('Testing Readme Examples', () => {
    expect(compressor.decompress(compressor.compress([2, 2, 5, 1, 0])))
      .to.deep.equal([0, 1, 2, 5]);
  });

  it('Batch Testing Correctness', () => {
    for (let count = 0; count < 1000; count += 1) {
      const input = new Set();
      const subSetsCount = Math.floor(Math.random() * 10);
      for (let subSet = 0; subSet < subSetsCount; subSet += 1) {
        const n1 = Math.floor(Math.random() * 10000);
        const n2 = Math.floor(Math.random() * 10000);
        for (let s = Math.min(n1, n2); s < Math.max(n1, n2); s += 1) {
          input.add(s);
        }
      }
      const toValidate = [...input].sort((a, b) => a - b);
      validate(toValidate);
    }
  }).timeout(10000);
});
