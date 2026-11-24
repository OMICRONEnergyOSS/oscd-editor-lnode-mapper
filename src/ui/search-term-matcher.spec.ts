import { expect } from '@open-wc/testing';

import { searchTermMatcher } from './search-term-matcher.js';

describe('searchTermMatcher', () => {
  it('matches everything for a blank term', () => {
    expect(searchTermMatcher('')).to.equal(undefined);
    expect(searchTermMatcher('  ""  ')).to.equal(undefined);
  });

  it('requires every term, in any order, ignoring case', () => {
    const matches = searchTermMatcher('xswi  bay1')!;
    expect(matches('Bay1 > QB1 > XSWI 1')).to.equal(true);
    expect(matches('Bay2 > QB1 > XSWI 1')).to.equal(false);
  });

  it('supports * and ? wildcards and treats other characters literally', () => {
    expect(searchTermMatcher('q*1')!('QB1')).to.equal(true);
    expect(searchTermMatcher('q?1')!('QB1')).to.equal(true);
    expect(searchTermMatcher('q?1')!('QBB1')).to.equal(false);
    expect(searchTermMatcher('(1)')!('XSWI (1)')).to.equal(true);
    expect(searchTermMatcher('a.c')!('abc')).to.equal(false);
  });

  it('keeps quoted words together as one term', () => {
    const matches = searchTermMatcher('"bay 1"')!;
    expect(matches('Q1 bay 1')).to.equal(true);
    expect(matches('bay Q1 1')).to.equal(false);
  });
});
