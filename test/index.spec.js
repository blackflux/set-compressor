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

  it('Testing Compression', () => {
    expect(seq.compress(Array.from(Array(10000).keys())))
      .to.deep.equal('H4sIAAAAAAACA+3BAQkAAADDINa/9HMc1AIAAAAAAAAAAIB/AxnwOcgQJwAA');
    expect(seq.compress([10000]))
      .to.deep.equal('H4sIAAAAAAACA+3BAQkAAAACoPp/uh2BmgAAAAAAAAAAAMC/Dh7pnnkRJwAA');
  });

  it('Testing Readme Base Example', () => {
    expect(seq.compress([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]))
      .to.deep.equal('H4sIAAAAAAACA2NkhAMA6+wzGQsAAAA=');
    expect(seq.decompress('H4sIAAAAAAACA2NkhAMA6+wzGQsAAAA='))
      .to.deep.equal([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  });

  it('Testing Readme Examples', () => {
    expect(seq.decompress(seq.compress([2, 2, 5, 1, 0])))
      .to.deep.equal([0, 1, 2, 5]);
  });
});
