const expect = require('chai').expect;
const set = require('../src/index')();

describe('Testing Functionality', () => {
  const validate = (input) => {
    const result = set.decompress(set.compress(input));
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

  it('Testing Compression', () => {
    expect(set.compress(Array.from(Array(10000).keys())))
      .to.deep.equal('H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA=');
    expect(set.compress([10000]))
      .to.deep.equal('H4sIAAAAAAACA2NgGAWjYBSMguEKGAGZHN5k4wQAgA==');
  });

  it('Testing Readme Base Example', () => {
    expect(set.compress([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
      .to.deep.equal('/wc=');
    expect(set.decompress('/wc='))
      .to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    expect(set.compress(Array.from(Array(10000).keys())))
      .to.deep.equal('H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA=');
    expect(set.decompress('H4sIAAAAAAACA/v/fxSMglEwCoYrYAAAhHk44+MEAIA='))
      .to.deep.equal(Array.from(Array(10000).keys()));
  });

  it('Testing Readme Examples', () => {
    expect(set.decompress(set.compress([2, 2, 5, 1, 0])))
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
