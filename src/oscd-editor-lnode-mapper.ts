import { css, html, LitElement, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { newEditEventV2 } from '@openscd/oscd-api/utils.js';
import { identity } from '@openscd/scl-lib';
import { SldSubstationViewer } from '@omicronenergy/oscd-editor-sld/sld-substation-viewer.js';
import { attributes } from '@omicronenergy/oscd-editor-sld/foundations.js';
import { OscdActionList } from '@omicronenergy/oscd-ui/action-list/OscdActionList.js';
import { OscdOutlinedButton } from '@omicronenergy/oscd-ui/button/OscdOutlinedButton.js';
import { OscdDialog } from '@omicronenergy/oscd-ui/dialog/OscdDialog.js';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdIconButton } from '@omicronenergy/oscd-ui/iconbutton/OscdIconButton.js';
import { OscdTree } from '@omicronenergy/oscd-ui/tree/OscdTree.js';

import { compareLNodeType } from './foundation/diffing.js';
import { hasLegacySldLayout } from './foundation/legacy-sld.js';
import {
  anyLnPath,
  anyLnTitle,
  linkEdit,
  linkedLogicalNode,
  logicalNodeIndex,
  lNodePath,
  lNodeTitle,
  matchingLogicalNodes,
} from './foundation/lnode-mapping.js';

import type { ActionItem } from '@omicronenergy/oscd-ui/action-list/OscdActionList.js';
import type { TreeRenderContext } from '@omicronenergy/oscd-ui/tree/OscdTree.js';

type TypeComparison = ReturnType<typeof compareLNodeType>;
type LinkDetails = {
  title: string;
  message: string;
  comparison?: TypeComparison;
};

const minGridSize = 4;
const maxGridSize = 128;
const zoomFactor = 1.25;
const fitMargin = 16;
const panThreshold = 4;

export default class OscdEditorLnodeMapper extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-action-list': OscdActionList,
    'oscd-dialog': OscdDialog,
    'oscd-icon': OscdIcon,
    'oscd-icon-button': OscdIconButton,
    'oscd-outlined-button': OscdOutlinedButton,
    'oscd-tree': OscdTree,
    'sld-substation-viewer': SldSubstationViewer,
  };

  @property({ attribute: false })
  doc?: XMLDocument;

  @property()
  docName?: string;

  @property({ type: Number })
  docVersion = 0;

  @property()
  locale?: string;

  @state()
  private parent?: Element;

  @state()
  private lNodeForLink?: Element;

  @state()
  private linkDetails?: LinkDetails;

  @state()
  private error = '';

  @state()
  private legacyLayout = false;

  @state()
  private gridSize = 32;

  @state()
  private items: ActionItem[] = [];

  @state()
  private selectable: string[] = [];

  @query('.viewport')
  private viewport?: HTMLElement;

  private fitted = false;

  private fitPending = false;

  private observed?: HTMLElement;

  private fittedSubstation?: Element;

  private resizeFrame?: number;

  private resizeObserver = new ResizeObserver(() => {
    if ((this.fitted || this.fitPending) && this.resizeFrame === undefined) {
      this.resizeFrame = requestAnimationFrame(() => {
        this.resizeFrame = undefined;
        if (this.fitted || this.fitPending) {
          this.zoomToFit();
        }
      });
    }
  });

  private pan?: {
    pointer: number;
    x: number;
    y: number;
    left: number;
    top: number;
    moved: boolean;
  };

  disconnectedCallback(): void {
    this.resizeObserver.disconnect();
    if (this.resizeFrame !== undefined) {
      cancelAnimationFrame(this.resizeFrame);
      this.resizeFrame = undefined;
    }
    this.observed = undefined;
    super.disconnectedCallback();
  }

  protected willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('doc') || changed.has('docVersion')) {
      this.linkDetails = undefined;
      this.legacyLayout = this.doc ? hasLegacySldLayout(this.doc) : false;
      const substation = this.doc?.querySelector(':root > Substation');
      this.selectable = Array.from(
        substation?.querySelectorAll('VoltageLevel, Bay, ConductingEquipment, PowerTransformer') ?? [],
      ).map(element => identity(element)).filter((id): id is string => typeof id === 'string');
    }
    if (changed.has('doc')) {
      this.parent = undefined;
      this.lNodeForLink = undefined;
      this.error = '';
    } else if (changed.has('docVersion') && this.doc) {
      if (this.parent && !this.doc.contains(this.parent)) {
        this.parent = undefined;
      }
      if (this.lNodeForLink && !this.doc.contains(this.lNodeForLink)) {
        this.lNodeForLink = undefined;
      }
    }
    if (changed.has('doc') || changed.has('docVersion') || changed.has('parent')) {
      this.items = this.lNodeItems();
    }
  }

  protected updated(changed: Map<PropertyKey, unknown>): void {
    const substation = this.doc?.querySelector(':root > Substation') ?? undefined;
    const viewport = this.viewport;
    if (this.observed !== viewport) {
      this.resizeObserver.disconnect();
      this.observed = viewport;
      if (viewport) {
        this.resizeObserver.observe(viewport);
      }
    }
    if (substation !== this.fittedSubstation || (!viewport && this.fittedSubstation)) {
      this.fittedSubstation = viewport ? substation : undefined;
      this.fitted = false;
      if (viewport && substation) {
        this.fitPending = true;
        this.zoomToFit();
      }
    }
    if (changed.has('legacyLayout') && !this.legacyLayout && viewport && substation) {
      this.fitPending = true;
      this.zoomToFit();
    }
  }

  private handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const unit = [1, 16, 400][event.deltaMode] ?? 1;
    const delta = Math.max(-200, Math.min(200, event.deltaY * unit));
    if (delta !== 0) {
      void this.zoomAt(Math.exp(-delta * 0.002), event.clientX, event.clientY);
    }
  }

  private handlePointerDown(event: PointerEvent): void {
    if ((event.button !== 0 && event.button !== 1) || !this.viewport) {
      return;
    }
    if (event.button === 1) {
      event.preventDefault();
    }
    this.pan = {
      pointer: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: this.viewport.scrollLeft,
      top: this.viewport.scrollTop,
      moved: false,
    };
  }

  private handlePointerMove(event: PointerEvent): void {
    const { pan, viewport } = this;
    if (!pan || !viewport || event.pointerId !== pan.pointer) {
      return;
    }
    const dx = event.clientX - pan.x;
    const dy = event.clientY - pan.y;
    if (!pan.moved && Math.hypot(dx, dy) < panThreshold) {
      return;
    }
    if (!pan.moved) {
      pan.moved = true;
      this.fitted = false;
      this.fitPending = false;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('panning');
    }
    viewport.scrollLeft = pan.left - dx;
    viewport.scrollTop = pan.top - dy;
  }

  private handlePointerUp(event: PointerEvent): void {
    const { pan, viewport } = this;
    if (!pan || event.pointerId !== pan.pointer) {
      return;
    }
    this.pan = undefined;
    viewport?.classList.remove('panning');
    if (pan.moved) {
      const swallow = (click: Event) => {
        click.stopPropagation();
        click.preventDefault();
      };
      window.addEventListener('click', swallow, { capture: true, once: true });
      setTimeout(() => window.removeEventListener('click', swallow, true), 0);
    }
  }

  private handleViewportKey(event: KeyboardEvent): void {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      void this.zoomAt(zoomFactor);
    } else if (event.key === '-') {
      event.preventDefault();
      void this.zoomAt(1 / zoomFactor);
    } else if (event.key === '0') {
      event.preventDefault();
      this.zoomToFit();
    }
  }

  private handleSelectEquipment(event: CustomEvent<{ element: Element }>): void {
    this.parent = event.detail.element;
  }

  private handleLinkDialogClosed(): void {
    this.lNodeForLink = undefined;
  }

  private handleLinkDetailsClosed(): void {
    this.linkDetails = undefined;
  }

  private handleLink(anyLn: Element): void {
    if (!this.lNodeForLink) {
      return;
    }
    try {
      this.dispatchEvent(newEditEventV2(linkEdit(this.lNodeForLink, anyLn)));
      this.lNodeForLink = undefined;
      this.error = '';
    } catch (error) {
      this.error = error instanceof Error ? error.message : String(error);
    }
  }

  private async zoomAt(factor: number, clientX?: number, clientY?: number): Promise<void> {
    const viewport = this.viewport;
    const canvas = viewport?.querySelector('.canvas');
    const next = Math.min(maxGridSize, Math.max(minGridSize, Math.round(this.gridSize * factor * 10) / 10));
    if (!viewport || !canvas || this.legacyLayout || next === this.gridSize) {
      return;
    }
    this.fitted = false;
    this.fitPending = false;
    const bounds = viewport.getBoundingClientRect();
    const x = clientX ?? bounds.left + bounds.width / 2;
    const y = clientY ?? bounds.top + bounds.height / 2;
    const before = canvas.getBoundingClientRect();
    const scale = next / this.gridSize;
    this.gridSize = next;
    await this.updateComplete;
    const after = canvas.getBoundingClientRect();
    viewport.scrollLeft += after.left + (x - before.left) * scale - x;
    viewport.scrollTop += after.top + (y - before.top) * scale - y;
  }

  private zoomToFit(): void {
    const substation = this.doc?.querySelector(':root > Substation');
    const viewport = this.viewport;
    if (!substation || !viewport || this.legacyLayout) {
      return;
    }
    const [width, height] = attributes(substation).dim;
    const fit = Math.min(
      (viewport.clientWidth - 2 * fitMargin) / Math.max(1, width),
      (viewport.clientHeight - 2 * fitMargin) / Math.max(1, height),
    );
    if (!Number.isFinite(fit) || fit <= 0) {
      return;
    }
    this.gridSize = Math.min(maxGridSize, Math.max(minGridSize, Math.floor(fit * 10) / 10));
    viewport.scrollTo(0, 0);
    this.fitted = true;
    this.fitPending = false;
  }

  private lNodeItems(): ActionItem[] {
    const root = this.parent ?? this.doc;
    const selector = this.parent
      ? ':scope > Function LNode, :scope > LNode, :scope > EqFunction LNode, :scope > SubEquipment LNode'
      : ':root > Substation LNode';
    const nodes = Array.from(root?.querySelectorAll(selector) ?? []);
    const index = this.doc ? logicalNodeIndex(this.doc) : new Map<string, Element>();
    const types = new Map(
      Array.from(this.doc?.querySelectorAll(':root > DataTypeTemplates > LNodeType') ?? [])
        .map(type => [type.getAttribute('id'), type]),
    );
    const item = (lNode: Element): ActionItem => {
      const linked = lNode.getAttribute('iedName') !== 'None';
      const instance = linkedLogicalNode(lNode, index);
      const specifiedType = types.get(lNode.getAttribute('lnType'));
      const instanceType = instance ? types.get(instance.getAttribute('lnType')) : undefined;
      const comparison = specifiedType && instanceType
        ? compareLNodeType(specifiedType, instanceType)
        : undefined;
      const detailsLabel = instance
        ? msg('View type comparison')
        : msg('Inspect unresolved reference');
      return {
        headline: lNodeTitle(lNode),
        supportingText: instance
          ? `${lNodePath(lNode)} -> ${anyLnPath(instance)}`
          : lNodePath(lNode),
        startingIcon: linked ? 'link' : 'link_off',
        actions: linked
          ? [{
            icon: comparison?.different === false ? 'check' : 'warning',
            label: detailsLabel,
            callback: () => {
              const message = !instance
                ? msg('The referenced logical node was not found in the document.')
                : !comparison
                  ? msg('The type comparison is unavailable because one or both LNode type definitions are missing.')
                  : comparison.different
                    ? msg('The referenced type differs from the specified type.')
                    : msg('No differences found in the specified type.');
              this.linkDetails = { title: lNodeTitle(lNode), message, comparison };
            },
          }]
          : [{
            icon: 'link',
            label: msg('Link logical node'),
            callback: () => {
              this.lNodeForLink = lNode;
            },
          }],
      };
    };
    return [
      ...nodes.filter(node => node.getAttribute('iedName') === 'None').map(item),
      ...nodes.filter(node => node.getAttribute('iedName') !== 'None').map(item),
    ];
  }

  private renderLinkDialog() {
    const items: ActionItem[] = this.doc && this.lNodeForLink
      ? matchingLogicalNodes(this.doc, this.lNodeForLink).map(ln => ({
        headline: anyLnTitle(ln),
        supportingText: anyLnPath(ln),
        primaryAction: () => this.handleLink(ln),
      }))
      : [];
    return html`
      <oscd-dialog
        .open=${this.lNodeForLink !== undefined}
        @closed=${this.handleLinkDialogClosed}
      >
        <div slot="headline">${this.lNodeForLink ? lNodeTitle(this.lNodeForLink) : ''}</div>
        <div slot="content">
          ${this.lNodeForLink ? lNodePath(this.lNodeForLink) : ''}
          ${items.length > 0
            ? html`<oscd-action-list
                .filterable=${true}
                .searchhelper=${msg('Filter logical node instances')}
                .items=${items}
              ></oscd-action-list>`
            : html`<p>${msg('No matching logical nodes found in the IEDs in this document.')}</p>`}
        </div>
      </oscd-dialog>
    `;
  }

  private renderLinkDetailsDialog() {
    const details = this.linkDetails;
    return html`
      <oscd-dialog
        class="link-details"
        .open=${details !== undefined}
        @closed=${this.handleLinkDetailsClosed}
      >
        <div slot="headline">${details?.title}</div>
        <div slot="content">
          <p>${details?.message}</p>
          ${details?.comparison?.dos.length
            ? html`<oscd-tree
                .data=${details.comparison.dos}
                .renderItem=${({ node, active }: TreeRenderContext<TypeComparison['dos'][number]>) => html`
                  <oscd-tree-item ?active=${active}>
                    <span slot="headline">${node.name}</span>
                    <span slot="supporting-text">${node.diffType === 'missing'
                      ? msg('Missing from referenced type')
                      : node.different ? msg('Different') : msg('Matches')}</span>
                  </oscd-tree-item>
                `}
              ></oscd-tree>`
            : nothing}
        </div>
        <div slot="actions">
          <oscd-outlined-button @click=${this.handleLinkDetailsClosed}>
            ${msg('Close')}
          </oscd-outlined-button>
        </div>
      </oscd-dialog>
    `;
  }

  private renderDiagram(substation: Element) {
    if (this.legacyLayout) {
      return html`<p role="status">${msg(
        'This diagram uses an old SLD layout. Convert it in the Single Line Diagram editor, then return here.',
      )}</p>`;
    }
    const selected = this.parent ? identity(this.parent) : undefined;
    const highlight = typeof selected === 'string'
      ? [{ id: selected, style: { fill: '#268bd2', fillOpacity: 0.1 } }]
      : [];
    return html`
      <sld-substation-viewer
        .doc=${this.doc}
        .substation=${substation}
        .docVersion=${this.docVersion}
        .gridSize=${this.gridSize}
        .showLabels=${true}
        .disabled=${true}
        .selectable=${this.selectable}
        .highlight=${highlight}
        @oscd-sld-selected=${this.handleSelectEquipment}
      ></sld-substation-viewer>
    `;
  }

  render() {
    if (!this.doc) {
      return html`<p>${msg('No document loaded')}</p>`;
    }
    const substation = this.doc.querySelector(':root > Substation');
    return html`
      ${this.error ? html`<p role="alert">${this.error}</p>` : nothing}
      ${substation
        ? html`<main>
            <section class="diagram">
              <nav aria-label=${msg('Diagram zoom')}>
                <oscd-icon-button class="zoom-out" aria-label=${msg('Zoom out')} title=${msg('Zoom out')} ?disabled=${this.legacyLayout} @click=${() => this.zoomAt(1 / zoomFactor)}>
                  <oscd-icon>zoom_out</oscd-icon>
                </oscd-icon-button>
                <oscd-icon-button class="zoom-in" aria-label=${msg('Zoom in')} title=${msg('Zoom in')} ?disabled=${this.legacyLayout} @click=${() => this.zoomAt(zoomFactor)}>
                  <oscd-icon>zoom_in</oscd-icon>
                </oscd-icon-button>
                <oscd-icon-button class="zoom-fit" aria-label=${msg('Fit diagram')} title=${msg('Fit diagram')} ?disabled=${this.legacyLayout} @click=${this.zoomToFit}>
                  <oscd-icon>fit_screen</oscd-icon>
                </oscd-icon-button>
              </nav>
              <div
                class="viewport"
                tabindex="0"
                role="region"
                aria-label=${msg('Diagram: drag to pan; wheel, + or - to zoom; 0 to fit')}
                @wheel=${this.handleWheel}
                @pointerdown=${this.handlePointerDown}
                @pointermove=${this.handlePointerMove}
                @pointerup=${this.handlePointerUp}
                @pointercancel=${this.handlePointerUp}
                @keydown=${this.handleViewportKey}
              >
                <div class="canvas">${this.renderDiagram(substation)}</div>
              </div>
            </section>
            <oscd-action-list
              .filterable=${true}
              .searchhelper=${msg('Filter LNodes')}
              .items=${this.items}
            ></oscd-action-list>
          </main>`
        : html`<section class="empty-state" aria-labelledby="empty-state-title">
            <h2 id="empty-state-title">${msg('No Substation detected')}</h2>
            <p>${msg('Add a Substation to view and map its LNodes.')}</p>
          </section>`}
      ${this.renderLinkDialog()}
      ${this.renderLinkDetailsDialog()}
    `;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }
    main {
      display: flex;
      height: 100%;
      min-height: 0;
    }
    .empty-state {
      margin: 2rem auto;
      max-width: 40rem;
      padding: 1rem;
    }
    .diagram,
    main > oscd-action-list {
      flex: 1;
      min-width: 0;
    }
    .diagram {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .viewport {
      flex: 1;
      min-height: 0;
      overflow: auto;
      cursor: grab;
      user-select: none;
      touch-action: none;
      scrollbar-width: none;
    }
    .viewport::-webkit-scrollbar {
      display: none;
    }
    .viewport.panning {
      cursor: grabbing;
    }
    .canvas {
      width: max-content;
    }
    main > oscd-action-list {
      overflow: auto;
    }
    [role='alert'] {
      color: var(--md-sys-color-error, #b3261e);
    }
  `;
}
