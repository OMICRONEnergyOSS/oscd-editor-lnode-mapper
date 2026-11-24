import { expect, fixture, html, waitUntil } from '@open-wc/testing';

import OscdEditorLnodeMapper from './oscd-editor-lnode-mapper.js';

import type { OscdOutlinedSearchField } from '@omicronenergy/oscd-ui/search-field/OscdOutlinedSearchField.js';
import type { SldSubstationViewer } from '@omicronenergy/oscd-editor-sld/sld-substation-viewer.js';
import type { EditDetailV2 } from '@openscd/oscd-api';
import type { OscdVirtualizedList } from './ui/OscdVirtualizedList.js';

customElements.define('oscd-editor-lnode-mapper', OscdEditorLnodeMapper);

const rowsOf = (list: HTMLElement) => Array.from(list.shadowRoot!.querySelectorAll('oscd-list-item'));

const slotText = (row: Element, slot: string) => row.querySelector(`[slot="${slot}"]`)!.textContent!.trim();

const startIcons = (list: HTMLElement) => rowsOf(list).map(row => slotText(row, 'start'));

const mainList = (plugin: OscdEditorLnodeMapper) => plugin.shadowRoot!.querySelector(
  'main oscd-virtualized-list',
) as OscdVirtualizedList;

const pickerList = (plugin: OscdEditorLnodeMapper) => plugin.shadowRoot!.querySelector(
  'oscd-dialog oscd-virtualized-list',
) as OscdVirtualizedList;

async function waitForRows(list: HTMLElement, count: number) {
  await waitUntil(() => rowsOf(list).length === count, `expected ${count} rows`);
}

async function settle(plugin: OscdEditorLnodeMapper, list: HTMLElement & { updateComplete: Promise<boolean> }) {
  await plugin.updateComplete;
  await list.updateComplete;
}

async function search(field: OscdOutlinedSearchField, value: string) {
  field.value = value;
  field.dispatchEvent(new Event('input', { bubbles: true }));
  await field.updateComplete;
}

describe('LNode mapper', () => {
  it('caps automatic fit at the designer scale but allows an explicit fit to zoom in', async () => {
    const documentWithSize = (width: number, height: number) => new DOMParser().parseFromString(
      `<SCL xmlns:sld="https://openscd.org/SCL/SSD/SLD/v0">
        <Substation name="S">
          <Private type="OpenSCD-SLD-Layout"><sld:SLDAttributes sld:w="${width}" sld:h="${height}"/></Private>
        </Substation>
      </SCL>`,
      'application/xml',
    );
    const plugin = await fixture<OscdEditorLnodeMapper>(html`
      <oscd-editor-lnode-mapper style="width: 1000px; height: 500px"
        .doc=${documentWithSize(4, 4)}></oscd-editor-lnode-mapper>
    `);
    const viewer = plugin.shadowRoot!.querySelector('sld-substation-viewer') as SldSubstationViewer;
    const viewport = plugin.shadowRoot!.querySelector('.viewport') as HTMLElement;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.equal(32);

    viewport.style.flex = 'none';
    viewport.style.width = '100px';
    viewport.style.height = '100px';
    await waitUntil(() => viewer.gridSize < 32);
    viewport.style.width = '400px';
    viewport.style.height = '240px';
    await waitUntil(() => viewer.gridSize === 32);

    const fit = plugin.shadowRoot!.querySelector('.zoom-fit') as HTMLElement;
    fit.click();
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.equal(52);
    viewport.style.height = '300px';
    await waitUntil(() => viewer.gridSize === 67);

    plugin.doc = documentWithSize(100, 100);
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.be.lessThan(32);
    plugin.doc = documentWithSize(4, 4);
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.equal(32);

    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: '+', bubbles: true }));
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.equal(40);

    viewport.dispatchEvent(new KeyboardEvent('keydown', { key: '0', bubbles: true }));
    await plugin.updateComplete;
    await viewer.updateComplete;
    expect(viewer.gridSize).to.equal(67);
  });

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
    const list = mainList(plugin);
    await waitForRows(list, 2);
    const searchField = plugin.shadowRoot!.querySelector('main oscd-outlined-search-field') as OscdOutlinedSearchField;
    await search(searchField, 'XSWI');
    await waitForRows(list, 1);
    await search(searchField, '');
    await waitForRows(list, 2);    const viewer = plugin.shadowRoot!.querySelector('sld-substation-viewer') as SldSubstationViewer;
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
    await waitForRows(list, 1);
    expect(slotText(rowsOf(list)[0], 'headline')).to.equal('XCBR1');
    expect(viewer.disabled).to.equal(true);
    rowsOf(list)[0].click();
    await plugin.updateComplete;
    const picker = pickerList(plugin);
    await waitForRows(picker, 2);
    expect(rowsOf(picker).map(row => slotText(row, 'headline'))).to.deep.equal(['None', 'XCBR1']);
    expect(rowsOf(picker)[1].querySelector('[slot="supporting-text"] > div')!.textContent).to.equal('IED2 LD');
    const save = plugin.shadowRoot!.querySelector('.save') as HTMLElement & { disabled: boolean };
    expect(save.disabled).to.equal(true);
    let detail: EditDetailV2 | undefined;
    plugin.addEventListener('oscd-edit-v2', (event) => {
      detail = (event as CustomEvent<EditDetailV2>).detail;
    });
    rowsOf(picker)[1].click();
    await settle(plugin, picker);
    expect(detail).to.equal(undefined);
    expect(save.disabled).to.equal(false);
    save.click();
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
    const list = mainList(plugin);
    await waitForRows(list, 1);
    rowsOf(list)[0].click();
    await plugin.updateComplete;
    expect(plugin.shadowRoot!.querySelector('oscd-dialog')?.textContent)
      .to.include('No matching logical nodes found');
  });

  it('shows binding status per row and blocks a selection that would duplicate a sibling', async () => {
    const doc = new DOMParser().parseFromString(
      `<SCL>
        <Substation name="S"><Function name="F">
          <LNode iedName="Absent" ldInst="LD" lnClass="XCBR" lnInst="1"/>
          <LNode iedName="IED1" ldInst="LD" lnClass="XCBR" lnInst="2" lnType="Spec"/>
          <LNode iedName="None" ldInst="LD" lnClass="XCBR" lnInst="3" lnType="Spec"/>
          <LNode iedName="IED1" ldInst="LD" lnClass="XCBR" lnInst="3"/>
        </Function></Substation>
        <IED name="IED1"><AccessPoint name="AP"><Server><LDevice inst="LD">
          <LN lnClass="XCBR" inst="2" lnType="Actual"/>
          <LN lnClass="XCBR" inst="3" lnType="Actual"/>
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
    const list = mainList(plugin);
    await waitForRows(list, 4);
    expect(startIcons(list)).to.deep.equal(['warning', 'warning', 'link_off', 'warning']);
    const supporting = (index: number) => slotText(rowsOf(list)[index], 'supporting-text');
    expect(supporting(0)).to.include('not found in the document');
    expect(supporting(1)).to.include('differs from the specified type: OpCnt');
    expect(supporting(3)).to.include('type definition is missing');

    rowsOf(list)[3].click();
    await plugin.updateComplete;
    const picker = pickerList(plugin);
    await waitForRows(picker, 3);
    const save = plugin.shadowRoot!.querySelector('.save') as HTMLElement & { disabled: boolean };
    expect(startIcons(picker)).to.deep.equal([
      'radio_button_unchecked',
      'radio_button_checked',
      'radio_button_unchecked',
    ]);
    // Candidates without a known problem come before those that conflict.
    expect(rowsOf(picker)[2].querySelector('[slot="end"]')!.textContent).to.equal('warning');
    expect(slotText(rowsOf(picker)[2], 'supporting-text')).to.include('same binding');

    rowsOf(picker)[0].click();
    await settle(plugin, picker);
    expect(plugin.shadowRoot!.querySelector('.conflict')?.textContent).to.include('cannot be set to None');
    expect(save.disabled).to.equal(true);
    let edits = 0;
    plugin.addEventListener('oscd-edit-v2', () => {
      edits += 1;
    });
    save.click();
    expect(edits).to.equal(0);

    rowsOf(picker)[1].click();
    await settle(plugin, picker);
    expect(plugin.shadowRoot!.querySelector('.conflict') === null).to.equal(true);
  });
});
