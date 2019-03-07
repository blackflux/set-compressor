const expect = require('chai').expect;
const seq = require('../src/index')();

describe('Testing Functionality', () => {
  const validate = (input) => {
    expect(input).to.deep.equal(seq.decompress(seq.compress(input)));
  };

  it('Testing Basic', () => {
    validate([1, 2, 3, 160, 235, 657, 5634]);
    validate(Array.from(Array(10000).keys()));
  });

  it('Testing Empty Array', () => {
    validate([]);
  });

  it('Testing Compression', () => {
    expect(seq.compress(Array.from(Array(10000).keys())))
      .to.deep.equal('AR+LCAAAAAAAAgPtwQEJAAAAwyDWv/RzHNQCAAAAAAAAAACAfwMZ8DnIECcAAA==');
    expect(seq.compress([10000]))
      .to.deep.equal('AR+LCAAAAAAAAgPtwQEJAAAAAqD6f7odgZoAAAAAAAAAAADAvw4e6Z55EScAAA==');
  });

  it('Testing Readme Base Example', () => {
    expect(seq.compress([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
      .to.deep.equal('AAEBAQEBAQEBAQEB');
    expect(seq.decompress('AAEBAQEBAQEBAQEB'))
      .to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('Testing Readme Examples', () => {
    expect(seq.decompress(seq.compress([2, 2, 5, 1, 0])))
      .to.deep.equal([0, 1, 2, 5]);
  });

  it('Batch Testing Correctness', () => {
    for (let count = 0; count < 1000; count += 1) {
      const input = new Set();
      const subSequences = Math.floor(Math.random() * 10);
      for (let subSeq = 0; subSeq < subSequences; subSeq += 1) {
        const n1 = Math.floor(Math.random() * 10000);
        const n2 = Math.floor(Math.random() * 10000);
        for (let s = Math.min(n1, n2); s < Math.max(n1, n2); s += 1) {
          input.add(s);
        }
      }
      const toValidate = [...input].sort((a, b) => a - b);
      validate(toValidate);
    }
  });
});
