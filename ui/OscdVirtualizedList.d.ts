import { LitElement } from 'lit';
import { OscdIcon } from '@omicronenergy/oscd-ui/icon/OscdIcon.js';
import { OscdList } from '@omicronenergy/oscd-ui/list/OscdList.js';
import { OscdListItem } from '@omicronenergy/oscd-ui/list/OscdListItem.js';
import type { PropertyValues, TemplateResult } from 'lit';
export interface OscdVirtualizedListFilteredDetail {
    /** Items remaining after filtering. */
    count: number;
    /** Items supplied before filtering. */
    total: number;
}
declare const OscdVirtualizedList_base: typeof LitElement & import("@open-wc/dedupe-mixin").Constructor<import("@open-wc/scoped-elements/types.js").ScopedElementsHost> & import("@open-wc/scoped-elements/types.js").ScopedElementsHostConstructor;
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
export declare class OscdVirtualizedList<T = unknown> extends OscdVirtualizedList_base {
    static scopedElements: {
        'oscd-icon': typeof OscdIcon;
        'oscd-list': typeof OscdList;
        'oscd-list-item': typeof OscdListItem;
    };
    items: T[];
    renderItem: (item: T, index: number) => TemplateResult;
    /** Stable identity per item, so rows are reused rather than rebuilt. */
    keyFunction?: (item: T) => unknown;
    searchTerm: string;
    /** The text of an item that `searchTerm` is matched against. */
    itemSearchText?: (item: T) => string;
    /** Overrides `itemSearchText` matching; called for a non-blank term only. */
    filter?: (item: T, searchTerm: string) => boolean;
    /** Accessible name of the list. */
    label?: string;
    private filteredItems;
    private reported?;
    protected willUpdate(changed: PropertyValues<this>): void;
    protected updated(): void;
    /** Scrolls an item into view; does nothing if the filter hides it. */
    scrollToItem(item: T, block?: ScrollLogicalPosition): Promise<void>;
    private filterItems;
    render(): TemplateResult<1>;
    static styles: import("lit").CSSResult;
}
export default OscdVirtualizedList;
