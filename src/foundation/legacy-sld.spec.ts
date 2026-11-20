import { expect } from '@open-wc/testing';

import { hasLegacySldLayout } from './legacy-sld.js';

describe('legacy SLD detection', () => {
  const parse = (xml: string) => new DOMParser().parseFromString(xml, 'application/xml');

  it('detects namespaced legacy coordinates regardless of prefix or decoy attributes', () => {
    const doc = parse(`<SCL xmlns="http://www.iec.ch/61850/2003/SCL"
      xmlns:old="https://transpower.co.nz/SCL/SSD/SLD/v0">
      <Substation name="S" x="9"><VoltageLevel name="V" old:x="3"/></Substation>
    </SCL>`);
    expect(hasLegacySldLayout(doc)).to.equal(true);
    doc.querySelector('VoltageLevel')!.removeAttributeNS(
      'https://transpower.co.nz/SCL/SSD/SLD/v0',
      'x',
    );
    expect(hasLegacySldLayout(doc)).to.equal(false);
  });

  it('detects old connectivity Private sections and accepts current layout', () => {
    const doc = parse(`<SCL xmlns="http://www.iec.ch/61850/2003/SCL">
      <Substation name="S"><ConnectivityNode name="C">
        <Private type="Transpower-SLD-Vertices"/>
      </ConnectivityNode></Substation>
    </SCL>`);
    expect(hasLegacySldLayout(doc)).to.equal(true);
    doc.querySelector('Private')!.setAttribute('type', 'OpenSCD-SLD-Layout');
    expect(hasLegacySldLayout(doc)).to.equal(false);
  });
});
