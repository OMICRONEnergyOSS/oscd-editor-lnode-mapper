import { css, html, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { ScopedElementsMixin } from '@open-wc/scoped-elements/lit-element.js';
import { virtualize, virtualizerRef } from '@lit-labs/virtualizer/virtualize.js';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdList } from '@omicronenergy/oscd-ui/list/OscdList.js';
import { OscdListItem } from '@omicronenergy/oscd-ui/list/OscdListItem.js';

import { searchTermMatcher } from './search-term-matcher.js';

import type { VirtualizerHostElement } from '@lit-labs/virtualizer/virtualize.js';
import type { PropertyValues, TemplateResult } from 'lit';

export interface OscdVirtualizedListFilteredDetail {
  /** Items remaining after filtering. */
  count: number;
  /** Items supplied before filtering. */
  total: number;
}

/**
 * @tag oscd-virtualized-list
 * @summary A scrolling `oscd-list` that renders only the rows in view and
 * filters its items by a search term.
 *
 * The list does not draw a search field. Bind one next to it, so it can be
 * placed and styled freely and stay visible while the list scrolls:
 *
 * ```html
 * <oscd-outlined-search-field
 *   @input=${(e: Event) => { this.term = (e.target as HTMLInputElement).value; }}
 * ></oscd-outlined-search-field>
 * <oscd-virtualized-list
 *   .items=${rows}
 *   .searchTerm=${this.term}
 *   .itemSearchText=${(row: Row) => row.path}
 *   .renderItem=${(row: Row) => html`<oscd-list-item>…</oscd-list-item>`}
 * ></oscd-virtualized-list>
 * ```
 *
 * Filtering uses `itemSearchText` and the matching rules of
 * `searchTermMatcher`. Supply `filter` instead to decide for yourself whether
 * an item matches; it is called only for a non-blank search term.
 *
 * The list is its own scroll container, so the host must give it a bounded
 * height (for example as a flex child with `min-height: 0`).
 *
 * Rows are rendered inside this element's scoped registry and shadow root.
 * Only `oscd-list-item`, `oscd-icon` and `oscd-list` resolve in `renderItem`
 * templates, so extend `scopedElements` for anything else, and style rows
 * inline, since the host's CSS cannot reach them. Rows are refreshed whenever
 * this element updates, so pass `renderItem` as an inline arrow if its output
 * depends on state outside the item (such as the selected row).
 *
 * @fires filtered - after the filtered item count changes. `detail` is an
 * {@link OscdVirtualizedListFilteredDetail}.
 *
 * @slot empty - shown instead of the list while no item matches.
 */
export class OscdVirtualizedList<T = unknown> extends ScopedElementsMixin(LitElement) {
  static scopedElements = {
    'oscd-icon': OscdIcon,
    'oscd-list': OscdList,
    'oscd-list-item': OscdListItem,
  };

  @property({ attribute: false })
  items: T[] = [];

  @property({ attribute: false })
  renderItem: (item: T, index: number) => TemplateResult = () => html``;

  /** Stable identity per item, so rows are reused rather than rebuilt. */
  @property({ attribute: false })
  keyFunction?: (item: T) => unknown;

  @property({ attribute: false })
  searchTerm = '';

  /** The text of an item that `searchTerm` is matched against. */
  @property({ attribute: false })
  itemSearchText?: (item: T) => string;

  /** Overrides `itemSearchText` matching; called for a non-blank term only. */
  @property({ attribute: false })
  filter?: (item: T, searchTerm: string) => boolean;

  /** Accessible name of the list. */
  @property()
  label?: string;

  private filteredItems: T[] = [];

  private reported?: OscdVirtualizedListFilteredDetail;

  protected willUpdate(changed: PropertyValues<this>): void {
    if (
      changed.has('items')
      || changed.has('searchTerm')
      || changed.has('itemSearchText')
      || changed.has('filter')
    ) {
      this.filteredItems = this.filterItems();
    }
  }

  protected updated(): void {
    const detail = { count: this.filteredItems.length, total: this.items.length };
    if (this.reported?.count !== detail.count || this.reported?.total !== detail.total) {
      this.reported = detail;
      this.dispatchEvent(
        new CustomEvent<OscdVirtualizedListFilteredDetail>('filtered', {
          detail,
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /** Scrolls an item into view; does nothing if the filter hides it. */
  async scrollToItem(item: T, block: ScrollLogicalPosition = 'nearest'): Promise<void> {
    const index = this.filteredItems.indexOf(item);
    // The virtualizer attaches itself to its host element under a symbol key.
    const host = this.renderRoot.querySelector('oscd-list') as VirtualizerHostElement | null;
    const virtualizer = host?.[virtualizerRef];
    if (index >= 0 && this.isConnected && virtualizer) {
      try {
        await virtualizer.layoutComplete;
        virtualizer.element(index)?.scrollIntoView({ block });
      } catch {
        // The virtualizer throws if its layout was torn down in the meantime.
      }
    }
  }

  private filterItems(): T[] {
    if (this.searchTerm.trim() === '') {
      return this.items;
    }
    const { filter, itemSearchText, searchTerm } = this;
    if (filter !== undefined) {
      return this.items.filter(item => filter(item, searchTerm));
    }
    const matches = searchTermMatcher(searchTerm);
    if (matches === undefined || itemSearchText === undefined) {
      return this.items;
    }
    return this.items.filter(item => matches(itemSearchText(item)));
  }

  render() {
    if (this.filteredItems.length === 0) {
      return html`<slot name="empty"></slot>`;
    }
    return html`
      <oscd-list aria-label=${ifDefined(this.label)}>
        ${virtualize({
          items: this.filteredItems,
          keyFunction: this.keyFunction,
          renderItem: this.renderItem,
          scroller: true,
        })}
      </oscd-list>
    `;
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    oscd-list {
      flex: 1 1 auto;
      min-height: 0;
    }
    oscd-list-item {
      /* Virtualized rows are absolutely positioned and would shrink-wrap. */
      box-sizing: border-box;
      width: 100%;
    }
  `;
}

export default OscdVirtualizedList;
