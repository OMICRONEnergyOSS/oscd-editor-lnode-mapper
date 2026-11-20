import { expect, fixture, html } from '@open-wc/testing';

import OscdEditorLnodeMapper from './oscd-editor-lnode-mapper.js';

import type { OscdActionList } from '@omicronenergy/oscd-ui/action-list/OscdActionList.js';
import type { SldSubstationViewer } from '@omicronenergy/oscd-editor-sld/sld-substation-viewer.js';
import type { EditDetailV2 } from '@openscd/oscd-api';

customElements.define('oscd-editor-lnode-mapper', OscdEditorLnodeMapper);

describe('LNode mapper', () => {
  it('handles an absent document and explains when no Substation exists', async () => {
    const plugin = await fixture<OscdEditorLnodeMapper>(html`
      <oscd-editor-lnode-mapper></oscd-editor-lnode-mapper>
    `);
    expect(plugin.shadowRoot?.textContent).to.include('No document loaded');
    plugin.doc = new DOMParser().parseFromString(
      '<SCL xmlns="http://www.iec.ch/61850/2003/SCL"/>',
      'application/xml',
    );
    await plugin.updateComplete;
    expect(plugin.shadowRoot?.textContent).to.include('No Substation detected');
    expect(plugin.shadowRoot?.textContent).to.include('Add a Substation to view and map its LNodes.');
    expect(plugin.shadowRoot?.querySelectorAll('input[type="file"]').length).to.equal(0);
  });

  it('renders LNodes and emits an EditV2 when linking an LN in a later IED', async () => {
    const doc = new DOMParser().parseFromString(
      `<SCL xmlns="http://www.iec.ch/61850/2003/SCL"
          xmlns:sld="https://openscd.org/SCL/SSD/SLD/v0">
        <Substation name="S">
          <Private type="OpenSCD-SLD-Layout"><sld:SLDAttributes sld:w="20" sld:h="10"/></Private>
          <VoltageLevel name="V">
            <Private type="OpenSCD-SLD-Layout"><sld:SLDAttributes sld:w="10" sld:h="8"/></Private>
            <Bay name="B">
              <Private type="OpenSCD-SLD-Layout"><sld:SLDAttributes sld:w="5" sld:h="5"/></Private>
              <LNode iedName="None" lnClass="XSWI" lnInst="1"/>
              <ConductingEquipment name="CB1" type="CBR">
                <Private type="OpenSCD-SLD-Layout"><sld:SLDAttributes sld:x="2" sld:y="2"/></Private>
                <LNode iedName="None" lnClass="XCBR" lnInst="1"/>
              </ConductingEquipment>
            </Bay>
          </VoltageLevel>
        </Substation>
        <IED name="IED1"><AccessPoint name="AP"><Server><LDevice inst="LD">
          <LN lnClass="XSWI" inst="1"/>
        </LDevice></Server></AccessPoint></IED>
        <IED name="IED2"><AccessPoint name="AP"><Server><LDevice inst="LD">
          <LN lnClass="XCBR" inst="1"/>
        </LDevice></Server></AccessPoint></IED>
      </SCL>`,
      'application/xml',
    );
    const plugin = await fixture<OscdEditorLnodeMapper>(html`
      <oscd-editor-lnode-mapper .doc=${doc}></oscd-editor-lnode-mapper>
    `);
    const list = plugin.shadowRoot!.querySelector('main > oscd-action-list') as OscdActionList;
    await list.updateComplete;
    expect(list.items).to.have.length(2);
    list.searchValue = 'XSWI';
    await list.updateComplete;
    expect(list.shadowRoot!.querySelectorAll('oscd-list.listitems > oscd-list-item:not(.hidden)').length)
      .to.equal(1);
    list.searchValue = '';
    await list.updateComplete;
    const viewer = plugin.shadowRoot!.querySelector('sld-substation-viewer') as SldSubstationViewer;
    await viewer.updateComplete;
    const viewport = plugin.shadowRoot!.querySelector('.viewport') as HTMLElement;
    viewport.style.width = '400px';
    viewport.style.height = '240px';
    viewport.style.flex = 'none';
    Object.defineProperty(viewport, 'clientWidth', { configurable: true, value: 400 });
    Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: 240 });
    const fit = plugin.shadowRoot!.querySelector('.zoom-fit') as HTMLElement;
    fit.click();
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.equal(18.4);
    const canvas = plugin.shadowRoot!.querySelector('.canvas')!;
    const x = viewport.getBoundingClientRect().left + 200;
    const before = (x - canvas.getBoundingClientRect().left) / viewer.gridSize;
    viewport.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, clientX: x, cancelable: true }));
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.be.greaterThan(18.4);
    const after = (x - canvas.getBoundingClientRect().left) / viewer.gridSize;
    expect(Math.abs(after - before)).to.be.lessThan(0.1);
    const beforeKeyboardZoom = viewer.gridSize;
    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: '-', bubbles: true }));
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.be.lessThan(beforeKeyboardZoom);
    viewport.setPointerCapture = () => {};
    const pointer = (type: string, x: number) => viewport.dispatchEvent(
      new PointerEvent(type, { pointerId: 1, clientX: x, clientY: x, bubbles: true }),
    );
    pointer('pointerdown', 100);
    pointer('pointermove', 99);
    expect(viewport.classList.contains('panning')).to.equal(false);
    pointer('pointermove', 50);
    expect(viewport.classList.contains('panning')).to.equal(true);
    pointer('pointerup', 50);
    expect(viewport.classList.contains('panning')).to.equal(false);
    const equipment = viewer.shadowRoot!.querySelector('g.equipment rect');
    expect(equipment !== null).to.equal(true);
    // The click following a drag must not select the equipment.
    let selected = 0;
    viewer.addEventListener('oscd-sld-selected', () => {
      selected += 1;
    });
    equipment!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(selected).to.equal(0);
    await new Promise(requestAnimationFrame);
    equipment!.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
    expect(selected).to.equal(1);
    await plugin.updateComplete;
    await list.updateComplete;
    const item = list.items[0];
    expect(item.headline).to.equal('XCBR1');
    expect(viewer.disabled).to.equal(true);
    const action = list.shadowRoot!.querySelector('oscd-list:not(.listitems) > oscd-list-item') as HTMLElement;
    action.click();
    await plugin.updateComplete;
    const picker = plugin.shadowRoot!.querySelector('oscd-dialog oscd-action-list') as OscdActionList;
    await picker.updateComplete;
    expect(picker.items).to.have.length(1);
    expect(picker.items[0].supportingText).to.equal('IED2 LD');
    let detail: EditDetailV2 | undefined;
    plugin.addEventListener('oscd-edit-v2', (event) => {
      detail = (event as CustomEvent<EditDetailV2>).detail;
    });
    const choice = picker.shadowRoot!.querySelector('.listitems > oscd-list-item') as HTMLElement;
    choice.click();
    expect(detail?.edit).to.deep.equal({
      element: doc.querySelector('ConductingEquipment > LNode'),
      attributes: { iedName: 'IED2', ldInst: 'LD', prefix: null, lnClass: 'XCBR', lnInst: '1' },
      attributesNS: {},
    });
    expect(doc.querySelector('ConductingEquipment > LNode')!.getAttribute('iedName')).to.equal('None');
  });

  it('explains why the picker is empty when there are no matching logical nodes', async () => {
    const doc = new DOMParser().parseFromString(
      '<SCL><Substation name="S"><LNode iedName="None" lnClass="XCBR" lnInst="1"/></Substation></SCL>',
      'application/xml',
    );
    const plugin = await fixture<OscdEditorLnodeMapper>(html`
      <oscd-editor-lnode-mapper .doc=${doc}></oscd-editor-lnode-mapper>
    `);
    const list = plugin.shadowRoot!.querySelector('main > oscd-action-list') as OscdActionList;
    const item = list.items[0];
    item.actions?.[0].callback(item);
    await plugin.updateComplete;
    expect(plugin.shadowRoot!.querySelector('oscd-dialog')?.textContent)
      .to.include('No matching logical nodes found');
  });

  it('explains unavailable comparisons and renders available differences in a tree', async () => {
    const doc = new DOMParser().parseFromString(
      `<SCL>
        <Substation name="S">
          <LNode iedName="Absent" ldInst="LD" lnClass="XCBR" lnInst="1"/>
          <LNode iedName="IED1" ldInst="LD" lnClass="XCBR" lnInst="1"/>
          <LNode iedName="IED1" ldInst="LD" lnClass="XCBR" lnInst="2" lnType="Spec"/>
        </Substation>
        <IED name="IED1"><AccessPoint name="AP"><Server><LDevice inst="LD">
          <LN lnClass="XCBR" inst="1" lnType="Actual"/>
          <LN lnClass="XCBR" inst="2" lnType="Actual"/>
        </LDevice></Server></AccessPoint></IED>
        <DataTypeTemplates>
          <LNodeType id="Spec" lnClass="XCBR">
            <DO name="Pos" type="Position"/><DO name="OpCnt" type="Count"/>
          </LNodeType>
          <LNodeType id="Actual" lnClass="XCBR"><DO name="Pos" type="Position"/></LNodeType>
        </DataTypeTemplates>
      </SCL>`,
      'application/xml',
    );
    const plugin = await fixture<OscdEditorLnodeMapper>(html`
      <oscd-editor-lnode-mapper .doc=${doc}></oscd-editor-lnode-mapper>
    `);
    const list = plugin.shadowRoot!.querySelector('main > oscd-action-list') as OscdActionList;
    const dialog = plugin.shadowRoot!.querySelector<HTMLElement & { open: boolean }>('.link-details')!;
    const openDetails = async (index: number) => {
      const item = list.items[index];
      item.actions?.[0].callback(item);
      await plugin.updateComplete;
      expect(dialog.open).to.equal(true);
    };

    await openDetails(0);
    expect(dialog.textContent).to.include('The referenced logical node was not found');
    expect(dialog.querySelector('oscd-tree') === null).to.equal(true);
    await openDetails(1);
    expect(dialog.textContent).to.include('one or both LNode type definitions are missing');
    expect(dialog.querySelector('oscd-tree') === null).to.equal(true);
    await openDetails(2);
    const tree = dialog.querySelector('oscd-tree')!;
    await tree.updateComplete;
    expect(tree.shadowRoot!.textContent).to.include('OpCnt');
    expect(tree.shadowRoot!.textContent).to.include('Missing from referenced type');
    dialog.querySelector<HTMLElement>('oscd-outlined-button')!.click();
    await plugin.updateComplete;
    expect(dialog.open).to.equal(false);
  });
});
