import { expect } from '@open-wc/testing';

import {
  anyLnPath,
  linkEdit,
  linkedLogicalNode,
  lNodePath,
  matchingLogicalNodes,
} from './lnode-mapping.js';

describe('LNode mapping', () => {
  const parse = () =>
    new DOMParser().parseFromString(
      `<SCL>
        <Substation name="S"><VoltageLevel name="V"><Bay name="B">
          <LNode iedName="None" lnClass="XCBR" lnInst="1"/>
        </Bay></VoltageLevel></Substation>
        <IED name="IED1"><AccessPoint name="AP"><Server><LDevice inst="LD">
          <LN lnClass="XSWI" inst="1"/>
        </LDevice></Server></AccessPoint></IED>
        <IED name="IED2"><AccessPoint name="AP"><Server><LDevice inst="LD">
          <LN lnClass="XCBR" inst="1" prefix="P"/>
        </LDevice></Server></AccessPoint></IED>
      </SCL>`,
      'application/xml',
    );

  it('finds a matching class in a later IED and creates a complete EditV2 link', () => {
    const doc = parse();
    const lNode = doc.querySelector('LNode')!;
    const candidates = matchingLogicalNodes(doc, lNode);
    expect(candidates).to.have.length(1);
    expect(lNodePath(lNode)).to.equal('S/V/B');
    expect(anyLnPath(candidates[0])).to.equal('IED2 LD');
    expect(linkEdit(lNode, candidates[0])).to.deep.equal({
      element: lNode,
      attributes: {
        iedName: 'IED2',
        ldInst: 'LD',
        prefix: 'P',
        lnClass: 'XCBR',
        lnInst: '1',
      },
      attributesNS: {},
    });
  });

  it('resolves the selected LN and handles missing references', () => {
    const doc = parse();
    const lNode = doc.querySelector('LNode')!;
    expect(linkedLogicalNode(lNode)).to.equal(undefined);
    lNode.setAttribute('iedName', 'IED2');
    lNode.setAttribute('ldInst', 'LD');
    lNode.setAttribute('prefix', 'P');
    expect(linkedLogicalNode(lNode)).to.equal(doc.querySelector('LN[lnClass="XCBR"]'));
    lNode.setAttribute('prefix', 'other');
    expect(linkedLogicalNode(lNode)).to.equal(undefined);
  });

  it('rejects a logical node without a complete parent reference', () => {
    const doc = parse();
    expect(() => linkEdit(doc.querySelector('LNode')!, doc.createElement('LN'))).to.throw();
  });
});
