import { expect } from '@open-wc/testing';

import {
  assessCandidates,
  bindingContext,
  bindingStatus,
  conflictingSibling,
  duplicateLNodes,
  noneEdit,
} from './binding.js';

describe('LNode binding', () => {
  const parse = () =>
    new DOMParser().parseFromString(
      `<SCL>
        <Substation name="S">
          <Function name="F1">
            <LNode iedName="None" ldInst="LD" lnClass="XCBR" lnInst="1" lnType="Spec"/>
            <LNode iedName="IED1" ldInst="LD" lnClass="XCBR" lnInst="1" lnType="Spec"/>
            <LNode iedName="IED1" ldInst="LD" lnClass="XCBR" lnInst="2" lnType="Spec"/>
            <LNode iedName="IED1" ldInst="LD" lnClass="XCBR" lnInst="9" lnType="Spec"/>
            <LNode iedName="IED1" ldInst="LD" lnClass="XSWI" lnInst="1"/>
          </Function>
          <Function name="F2">
            <LNode iedName="None" ldInst="LD" lnClass="XCBR" lnInst="1" lnType="Spec"/>
          </Function>
        </Substation>
        <IED name="IED1"><AccessPoint name="AP"><Server><LDevice inst="LD">
          <LN lnClass="XCBR" inst="1" lnType="Good"/>
          <LN lnClass="XCBR" inst="2" lnType="Bad"/>
          <LN lnClass="XCBR" inst="3" lnType="Good"/>
          <LN lnClass="XSWI" inst="1"/>
        </LDevice></Server></AccessPoint></IED>
        <DataTypeTemplates>
          <LNodeType id="Spec" lnClass="XCBR"><DO name="Pos" type="P"/></LNodeType>
          <LNodeType id="Good" lnClass="XCBR"><DO name="Pos" type="P"/></LNodeType>
          <LNodeType id="Bad" lnClass="XCBR"><DO name="Other" type="P"/></LNodeType>
        </DataTypeTemplates>
      </SCL>`,
      'application/xml',
    );

  const lNodes = (doc: XMLDocument) => Array.from(doc.querySelectorAll('Function > LNode'));

  it('applies schema defaults and scopes the duplicate key to the parent', () => {
    const doc = parse();
    const [none, bound] = lNodes(doc);
    expect(conflictingSibling(bound, noneEdit(bound))).to.equal(none);
    expect(conflictingSibling(none, noneEdit(none))).to.equal(undefined);
    // The same key in another Function is schema-valid.
    expect(duplicateLNodes(doc).size).to.equal(0);
    none.removeAttribute('iedName');
    expect(conflictingSibling(bound, noneEdit(bound))).to.equal(none);
    const rebinding = { ...noneEdit(none), attributes: { iedName: 'IED1', ldInst: 'LD', lnInst: '2' } };
    expect(conflictingSibling(none, rebinding)).to.equal(lNodes(doc)[2]);
  });

  it('flags LNodes that already duplicate a sibling', () => {
    const doc = parse();
    doc.querySelector('Function')!.append(doc.querySelector('Function > LNode')!.cloneNode(true));
    expect(duplicateLNodes(doc).size).to.equal(2);
    const status = bindingStatus(lNodes(doc)[0], bindingContext(doc));
    expect(status).to.deep.include({ state: 'warning', issues: ['duplicate'] });
  });

  it('classifies unbound, bound, mismatched, missing and untyped bindings', () => {
    const doc = parse();
    const context = bindingContext(doc);
    const [unbound, bound, mismatch, missing, untyped] = lNodes(doc).slice(0, 5).map(
      lNode => bindingStatus(lNode, context),
    );
    expect(unbound.state).to.equal('unbound');
    expect(bound).to.deep.include({ state: 'bound', issues: [] });
    expect(mismatch.issues).to.deep.equal(['mismatch']);
    expect(missing.issues).to.deep.equal(['missing-target']);
    expect(untyped.issues).to.deep.equal(['missing-types']);
  });

  it('puts candidates with known problems after the others', () => {
    const doc = parse();
    const lNode = lNodes(doc)[0];
    const instances = assessCandidates(lNode, bindingContext(doc)).map(
      ({ candidate, conflict, comparison }) => [
        candidate.getAttribute('inst'),
        conflict !== undefined,
        comparison?.different,
      ],
    );
    // inst 1 and 2 are already bound by siblings; inst 2 also has a known mismatch.
    expect(instances).to.deep.equal([
      ['3', false, false],
      ['1', true, false],
      ['2', true, true],
    ]);
  });
});
