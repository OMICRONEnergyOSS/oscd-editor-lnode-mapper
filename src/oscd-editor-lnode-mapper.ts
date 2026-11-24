import { css, html, LitElement, nothing } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { msg } from '@lit/localize';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { newEditEventV2 } from '@openscd/oscd-api/utils.js';
import { identity } from '@openscd/scl-lib';
import { SldSubstationViewer } from '@omicronenergy/oscd-editor-sld/sld-substation-viewer.js';
import { attributes } from '@omicronenergy/oscd-editor-sld/foundations.js';
import { OscdFilledButton } from '@omicronenergy/oscd-ui/button/OscdFilledButton.js';
import { OscdOutlinedButton } from '@omicronenergy/oscd-ui/button/OscdOutlinedButton.js';
import { OscdDialog } from '@omicronenergy/oscd-ui/dialog/OscdDialog.js';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdIconButton } from '@omicronenergy/oscd-ui/iconbutton/OscdIconButton.js';
import { OscdOutlinedSearchField } from '@omicronenergy/oscd-ui/search-field/OscdOutlinedSearchField.js';

import {
  assessCandidates,
  bindingContext,
  bindingStatus,
  conflictingSibling,
  noneEdit,
} from './foundation/binding.js';
import { hasLegacySldLayout } from './foundation/legacy-sld.js';
import {
  anyLnPath,
  anyLnTitle,
  linkedLogicalNode,
  lNodePath,
  lNodeTitle,
} from './foundation/lnode-mapping.js';
import { OscdVirtualizedList } from './ui/OscdVirtualizedList.js';

import type { SetAttributes } from '@openscd/oscd-api';
import type {
  BindingContext,
  BindingIssue,
  BindingStatus,
  CandidateAssessment,
  TypeComparison,
} from './foundation/binding.js';

const noneChoice = 'none';
const currentChoice = 'current';

type Choice = Element | typeof noneChoice | typeof currentChoice;

type LNodeRow = {
  lNode: Element;
  headline: string;
  path: string;
  reasons: string[];
  state: BindingStatus['state'];
};

type ChoiceRow = {
  value: Choice;
  headline: string;
  path: string;
  issues: BindingIssue[];
  comparison?: TypeComparison;
};

const statusIcons = { unbound: 'link_off', bound: 'link', warning: 'warning' };

const statusColors = {
  unbound: 'inherit',
  bound: 'var(--md-sys-color-primary, #6750a4)',
  warning: 'var(--md-sys-color-error, #b3261e)',
};

const warningColor = statusColors.warning;

const searchText = (row: { headline: string; path: string }, notes: string[]) => [
  row.headline,
  row.path,
  ...notes,
].join(' ');

function differences(comparison?: TypeComparison): string {
  const names = comparison?.dos.filter(data => data.different).map(data => data.name) ?? [];
  return names.length > 0 ? `: ${names.join(', ')}` : '';
}

const minGridSize = 4;
const maxGridSize = 128;
const defaultGridSize = 32;
const zoomFactor = 1.25;
const fitMargin = 16;
const panThreshold = 4;

export default class OscdEditorLnodeMapper extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-dialog': OscdDialog,
    'oscd-filled-button': OscdFilledButton,
    'oscd-icon': OscdIcon,
    'oscd-icon-button': OscdIconButton,
    'oscd-outlined-button': OscdOutlinedButton,
    'oscd-outlined-search-field': OscdOutlinedSearchField,
    'oscd-virtualized-list': OscdVirtualizedList,
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
  private choice?: Choice;

  @state()
  private legacyLayout = false;

  @state()
  private gridSize = defaultGridSize;

  @state()
  private items: LNodeRow[] = [];

  @state()
  private searchTerm = '';

  @state()
  private choiceSearchTerm = '';

  @state()
  private selectable: string[] = [];

  @query('.viewport')
  private viewport?: HTMLElement;

  @query('.choices')
  private choicesList?: OscdVirtualizedList<ChoiceRow>;

  private context?: BindingContext;

  private assessments: CandidateAssessment[] = [];

  private choiceRows: ChoiceRow[] = [];

  private fitted = false;

  private fitPending = false;

  private fitMaximum = defaultGridSize;

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

  private selectionHandled = false;

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
      this.context = this.doc ? bindingContext(this.doc) : undefined;
      this.legacyLayout = this.doc ? hasLegacySldLayout(this.doc) : false;
      const substation = this.doc?.querySelector(':root > Substation');
      this.selectable = Array.from(
        substation?.querySelectorAll('VoltageLevel, Bay, ConductingEquipment, PowerTransformer') ?? [],
      ).map(element => identity(element)).filter((id): id is string => typeof id === 'string');
    }
    if (changed.has('doc')) {
      this.parent = undefined;
      this.lNodeForLink = undefined;
      this.choice = undefined;
    } else if (changed.has('docVersion') && this.doc) {
      if (this.parent && !this.doc.contains(this.parent)) {
        this.parent = undefined;
      }
      if (this.lNodeForLink && !this.doc.contains(this.lNodeForLink)) {
        this.lNodeForLink = undefined;
      }
    }
    if (changed.has('doc') || changed.has('docVersion') || changed.has('lNodeForLink')) {
      this.assessments = this.lNodeForLink && this.context
        ? assessCandidates(this.lNodeForLink, this.context)
        : [];
      this.choiceRows = this.lNodeForLink ? this.buildChoiceRows() : [];
      if (changed.has('docVersion') && !this.choiceRows.some(row => row.value === this.choice)) {
        this.choice = undefined;
      }
    }
    if (changed.has('doc') || changed.has('docVersion') || changed.has('parent')) {
      this.items = this.lNodeRows();
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
      this.fitMaximum = defaultGridSize;
      if (viewport && substation) {
        this.fitPending = true;
        this.zoomToFit();
      }
    }
    if (changed.has('legacyLayout') && !this.legacyLayout && viewport && substation) {
      this.fitMaximum = defaultGridSize;
      this.fitPending = true;
      this.zoomToFit();
    }
    if (changed.has('lNodeForLink') && this.lNodeForLink) {
      void this.revealSelectedChoice();
    }
  }

  private async revealSelectedChoice(): Promise<void> {
    const list = this.choicesList;
    await list?.updateComplete;
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => resolve());
    });
    const row = this.choiceRows.find(({ value }) => value === this.choice);
    if (row) {
      await list?.scrollToItem(row, 'center');
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
      this.handleFit();
    }
  }

  private handleFit(): void {
    this.fitMaximum = maxGridSize;
    this.zoomToFit();
  }

  private handleSelectEquipment(event: CustomEvent<{ element: Element }>): void {
    const { element } = event.detail;
    this.parent = this.parent === element ? undefined : element;
    this.selectionHandled = true;
  }

  // The viewer's selection event fires before the click bubbles up here, so a
  // click that selected nothing is a click on the background.
  private handleDiagramClick(): void {
    if (!this.selectionHandled) {
      this.parent = undefined;
    }
    this.selectionHandled = false;
  }

  private handleLinkDialogClosed(): void {
    this.lNodeForLink = undefined;
    this.choice = undefined;
    this.choiceSearchTerm = '';
  }

  private handleSearch(event: Event): void {
    if (event.target instanceof OscdOutlinedSearchField) {
      this.searchTerm = event.target.value;
    }
  }

  private handleChoiceSearch(event: Event): void {
    if (event.target instanceof OscdOutlinedSearchField) {
      this.choiceSearchTerm = event.target.value;
    }
  }

  private handleChoose(value: ChoiceRow['value']): void {
    this.choice = value;
  }

  private handleOpenBinding(lNode: Element): void {
    const status = this.context ? bindingStatus(lNode, this.context) : undefined;
    if (lNode.getAttribute('iedName') === 'None') {
      this.choice = noneChoice;
    } else if (status?.instance !== undefined) {
      this.choice = status.instance;
    } else {
      this.choice = status?.issues.includes('missing-target') ? currentChoice : undefined;
    }
    this.lNodeForLink = lNode;
  }

  private handleSave(): void {
    const lNode = this.lNodeForLink;
    const edit = this.choiceEdit();
    if (lNode === undefined || edit === undefined || conflictingSibling(lNode, edit) !== undefined) {
      return;
    }
    this.dispatchEvent(newEditEventV2(edit));
    this.handleLinkDialogClosed();
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
    this.gridSize = Math.min(this.fitMaximum, Math.max(minGridSize, Math.floor(fit * 10) / 10));
    viewport.scrollTo(0, 0);
    this.fitted = true;
    this.fitPending = false;
  }

  private issueMessage(issue: BindingIssue, comparison?: TypeComparison): string {
    switch (issue) {
      case 'duplicate':
        return msg('Another LNode in this container has the same binding.');
      case 'missing-target':
        return msg('The referenced logical node was not found in the document.');
      case 'missing-types':
        return msg('Type comparison unavailable: an LNode type definition is missing.');
      default:
        return `${msg('The referenced type differs from the specified type')}${differences(comparison)}.`;
    }
  }

  private isCurrentChoice(lNode: Element): boolean {
    if (this.choice === noneChoice) {
      return lNode.getAttribute('iedName') === 'None';
    }
    if (this.choice === currentChoice) {
      return true;
    }
    return this.context !== undefined
      && this.choice !== undefined
      && linkedLogicalNode(lNode, this.context.index) === this.choice;
  }

  private choiceEdit(): SetAttributes | undefined {
    const lNode = this.lNodeForLink;
    if (lNode === undefined || this.choice === undefined) {
      return undefined;
    }
    if (this.choice === noneChoice) {
      return noneEdit(lNode);
    }
    return this.assessments.find(({ candidate }) => candidate === this.choice)?.edit;
  }

  private lNodeRows(): LNodeRow[] {
    const root = this.parent ?? this.doc;
    const selector = this.parent
      ? ':scope > Function LNode, :scope > LNode, :scope > EqFunction LNode, :scope > SubEquipment LNode'
      : ':root > Substation LNode';
    const { context } = this;
    if (context === undefined) {
      return [];
    }
    return Array.from(root?.querySelectorAll(selector) ?? []).map((lNode): LNodeRow => {
      const status = bindingStatus(lNode, context);
      return {
        lNode,
        headline: lNodeTitle(lNode),
        path: status.instance
          ? `${lNodePath(lNode)} -> ${anyLnPath(status.instance)}`
          : lNodePath(lNode),
        reasons: status.issues.map(issue => this.issueMessage(issue, status.comparison)),
        state: status.state,
      };
    });
  }

  private buildChoiceRows(): ChoiceRow[] {
    const lNode = this.lNodeForLink;
    const status = lNode && this.context ? bindingStatus(lNode, this.context) : undefined;
    const rows: ChoiceRow[] = [
      {
        value: noneChoice,
        headline: msg('None'),
        path: msg('Keep this LNode unbound'),
        issues: [],
      },
    ];
    if (lNode && status?.issues.includes('missing-target')) {
      rows.push({
        value: currentChoice,
        headline: lNodeTitle(lNode),
        path: [lNode.getAttribute('iedName'), lNode.getAttribute('ldInst')]
          .filter(part => part !== null && part !== '')
          .join(' '),
        issues: status.issues,
        comparison: status.comparison,
      });
    }
    return rows.concat(
      this.assessments.map(({ candidate, conflict, comparison }): ChoiceRow => (
        candidate === status?.instance
          ? {
            value: candidate,
            headline: anyLnTitle(candidate),
            path: anyLnPath(candidate),
            issues: status.issues,
            comparison: status.comparison,
          }
          : {
            value: candidate,
            headline: anyLnTitle(candidate),
            path: anyLnPath(candidate),
            issues: [
              ...(conflict ? ['duplicate' as const] : []),
              ...(comparison?.different ? ['mismatch' as const] : []),
            ],
            comparison,
          }
      )),
    );
  }

  private choiceNotes(row: ChoiceRow): string[] {
    return row.issues.map(issue => this.issueMessage(issue, row.comparison));
  }

  private renderRowText(row: { path: string }, notes: string[]) {
    return html`
      <div slot="supporting-text">
        <div>${row.path}</div>
        ${notes.map(note => html`<div style="color: ${warningColor}; white-space: normal">${note}</div>`)}
      </div>
    `;
  }

  private renderLNodeRow(row: LNodeRow) {
    return html`
      <oscd-list-item type="button" @click=${() => this.handleOpenBinding(row.lNode)}>
        <oscd-icon slot="start" style="color: ${statusColors[row.state]}">${statusIcons[row.state]}</oscd-icon>
        <div slot="headline">${row.headline}</div>
        ${this.renderRowText(row, row.reasons)}
      </oscd-list-item>
    `;
  }

  private renderChoiceRow(row: ChoiceRow) {
    const selected = this.choice === row.value;
    const notes = this.choiceNotes(row);
    const flagged = selected && notes.length > 0 ? `color: ${warningColor}` : '';
    return html`
      <oscd-list-item type="button" @click=${() => this.handleChoose(row.value)}>
        <oscd-icon slot="start" style=${flagged}>${selected ? 'radio_button_checked' : 'radio_button_unchecked'}</oscd-icon>
        <div slot="headline" style=${flagged}>${row.headline}</div>
        ${this.renderRowText(row, notes)}
        ${notes.length > 0
          ? html`<oscd-icon slot="end" style="color: ${warningColor}">warning</oscd-icon>`
          : nothing}
      </oscd-list-item>
    `;
  }

  private renderSelectionIssues(lNode: Element) {
    const edit = this.choiceEdit();
    const conflict = edit ? conflictingSibling(lNode, edit) : undefined;
    const row = this.choiceRows.find(({ value }) => value === this.choice);
    const warnings = (row?.issues ?? [])
      .filter(issue => !(issue === 'duplicate' && conflict))
      .map(issue => this.issueMessage(issue, row?.comparison));
    let blocking: string | undefined;
    if (conflict) {
      if (this.choice === noneChoice) {
        blocking = msg('This LNode cannot be set to None: another LNode in this container is already unbound with the same reference. To unbind it safely, remove this LNode from the function, or bind it to something else.');
      } else if (this.isCurrentChoice(lNode)) {
        blocking = this.issueMessage('duplicate');
      } else {
        blocking = msg('This logical node cannot be selected: another LNode in this container already has the same binding.');
      }
    }
    return html`
      <div class="messages">
        ${blocking === undefined ? nothing : html`<p class="conflict" role="alert">${blocking}</p>`}
        ${warnings.map(warning => html`<p class="warning" role="status">${warning}</p>`)}
      </div>
    `;
  }

  private renderChoices(lNode: Element) {
    return html`
      <oscd-outlined-search-field
        class="search"
        aria-label=${msg('Filter logical node instances')}
        .placeholder=${msg('Filter logical node instances')}
        .value=${this.choiceSearchTerm}
        @input=${this.handleChoiceSearch}
      ></oscd-outlined-search-field>
      <oscd-virtualized-list
        class="choices"
        .label=${msg('Logical node instances')}
        .items=${this.choiceRows}
        .searchTerm=${this.choiceSearchTerm}
        .keyFunction=${(row: ChoiceRow) => row.value}
        .itemSearchText=${(row: ChoiceRow) => searchText(row, this.choiceNotes(row))}
        .renderItem=${(row: ChoiceRow) => this.renderChoiceRow(row)}
      >
        <p slot="empty">${msg('No logical nodes match the filter.')}</p>
      </oscd-virtualized-list>
      ${this.assessments.length === 0
        ? html`<p>${msg('No matching logical nodes found in the IEDs in this document.')}</p>`
        : nothing}
      ${this.renderSelectionIssues(lNode)}
    `;
  }

  private renderLinkDialog() {
    const lNode = this.lNodeForLink;
    const edit = this.choiceEdit();
    const saveDisabled = lNode === undefined
      || edit === undefined
      || conflictingSibling(lNode, edit) !== undefined
      || this.isCurrentChoice(lNode);
    return html`
      <oscd-dialog
        .open=${lNode !== undefined}
        @closed=${this.handleLinkDialogClosed}
      >
        <div slot="headline">${lNode ? lNodeTitle(lNode) : ''}</div>
        <div slot="content">
          ${lNode ? lNodePath(lNode) : ''}
          ${lNode ? this.renderChoices(lNode) : nothing}
        </div>
        <div slot="actions">
          <oscd-outlined-button class="cancel" @click=${this.handleLinkDialogClosed}>
            ${msg('Cancel')}
          </oscd-outlined-button>
          <oscd-filled-button class="save" ?disabled=${saveDisabled} @click=${this.handleSave}>
            ${msg('Save')}
          </oscd-filled-button>
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
        @click=${this.handleDiagramClick}
      ></sld-substation-viewer>
    `;
  }

  render() {
    if (!this.doc) {
      return html`<p>${msg('No document loaded')}</p>`;
    }
    const substation = this.doc.querySelector(':root > Substation');
    return html`
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
                <oscd-icon-button class="zoom-fit" aria-label=${msg('Fit diagram')} title=${msg('Fit diagram')} ?disabled=${this.legacyLayout} @click=${this.handleFit}>
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
            <section class="lnodes">
              <oscd-outlined-search-field
                class="search"
                aria-label=${msg('Filter LNodes')}
                .placeholder=${msg('Filter LNodes')}
                .value=${this.searchTerm}
                @input=${this.handleSearch}
              ></oscd-outlined-search-field>
              <oscd-virtualized-list
                .label=${msg('LNodes')}
                .items=${this.items}
                .searchTerm=${this.searchTerm}
                .keyFunction=${(row: LNodeRow) => row.lNode}
                .itemSearchText=${(row: LNodeRow) => searchText(row, row.reasons)}
                .renderItem=${(row: LNodeRow) => this.renderLNodeRow(row)}
              >
                <p slot="empty">${msg('No LNodes match the filter.')}</p>
              </oscd-virtualized-list>
            </section>
          </main>`
        : html`<section class="empty-state" aria-labelledby="empty-state-title">
            <h2 id="empty-state-title">${msg('No Substation detected')}</h2>
            <p>${msg('Add a Substation to view and map its LNodes.')}</p>
          </section>`}
      ${this.renderLinkDialog()}
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
    .lnodes {
      flex: 1;
      min-width: 0;
    }
    .diagram,
    .lnodes {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .search {
      margin: 8px;
    }
    oscd-dialog .search {
      display: flex;
      margin: 8px 0;
    }
    .lnodes > oscd-virtualized-list {
      flex: 1 1 auto;
    }
    oscd-dialog {
      min-height: min(640px, 100% - 48px);
      max-height: min(760px, 100% - 48px);
    }
    .choices {
      height: min(40vh, 320px);
    }
    .messages {
      position: sticky;
      bottom: 0;
      background: var(--md-sys-color-surface-container-high, #ece6f0);
    }
    .warning {
      color: var(--md-sys-color-error, #b3261e);
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
    [role='alert'],
    .conflict {
      color: var(--md-sys-color-error, #b3261e);
    }
  `;
}
