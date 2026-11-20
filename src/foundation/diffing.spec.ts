import { expect } from '@open-wc/testing';

import { compareLNodeType } from './diffing.js';

describe('LNodeType comparison', () => {
  it('reports missing specified data objects without treating extras as missing', () => {
    const doc = new DOMParser().parseFromString(
      `<SCL>
        <DataTypeTemplates>
          <LNodeType id="specified"><DO name="A" type="a"/><DO name="B" type="b"/></LNodeType>
          <LNodeType id="instance"><DO name="A" type="a"/><DO name="C" type="c"/></LNodeType>
          <DOType id="a" cdc="SPS"/>
          <DOType id="b" cdc="DPS"/>
        </DataTypeTemplates>
      </SCL>`,
      'application/xml',
    );
    const specified = doc.querySelector('LNodeType[id="specified"]')!;
    const instance = doc.querySelector('LNodeType[id="instance"]')!;
    const diff = compareLNodeType(specified, instance);

    expect(diff.different).to.equal(true);
    expect(diff.dos.map(item => item.name)).to.deep.equal(['A', 'B']);
    expect(diff.dos[0].different).to.equal(false);
    expect(diff.dos[1].diffType).to.equal('missing');
    expect(diff.dos[1].class).to.equal('DPS');
  });
});
