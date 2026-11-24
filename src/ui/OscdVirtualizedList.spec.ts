import { expect, fixture, html, waitUntil } from '@open-wc/testing';

import { OscdVirtualizedList } from './OscdVirtualizedList.js';

import type { OscdVirtualizedListFilteredDetail } from './OscdVirtualizedList.js';

customElements.define('test-virtualized-list', class extends OscdVirtualizedList<string> {});

type TestList = OscdVirtualizedList<string>;

const renderRow = (item: string) => html`
  <oscd-list-item><div slot="headline">${item}</div></oscd-list-item>
`;

const renderedRows = (list: TestList) => Array.from(list.shadowRoot!.querySelectorAll('oscd-list-item'));

const headlines = (list: TestList) => renderedRows(list).map(row => row.textContent!.trim());

async function createList(items: string[], properties: Partial<TestList> = {}) {
  const list = await fixture<TestList>(html`
    <test-virtualized-list
      style="display: flex; height: 240px"
      .items=${items}
      .renderItem=${renderRow}
      .itemSearchText=${(item: string) => item}
      .keyFunction=${(item: string) => item}
    >
      <p slot="empty">Nothing found</p>
    </test-virtualized-list>
  `);
  Object.assign(list, properties);
  await list.updateComplete;
  return list;
}

describe('OscdVirtualizedList', () => {
  // The virtualizer resizes rows from inside a ResizeObserver callback, which
  // browsers report as a benign window error that would fail the test run.
  let originalOnError: OnErrorEventHandler;

  before(() => {
    originalOnError = window.onerror;
    window.onerror = (message, ...rest) => {
      if (typeof message === 'string' && message.includes('ResizeObserver loop')) {
        return true;
      }
      return originalOnError?.call(window, message, ...rest);
    };
  });

  after(() => {
    window.onerror = originalOnError;
  });

  it('renders only the rows near the viewport of a large list', async () => {
    const items = Array.from({ length: 10000 }, (_, index) => `Item ${index}`);
    const list = await createList(items);
    await waitUntil(() => renderedRows(list).length > 0);
    expect(renderedRows(list).length).to.be.lessThan(100);
    expect(headlines(list)[0]).to.equal('Item 0');
  });

  it('filters by search term using the item search text and reports the counts', async () => {
    const list = await createList(['Alpha', 'Beta', 'Gamma']);
    const details: OscdVirtualizedListFilteredDetail[] = [];
    list.addEventListener('filtered', event => details.push(
      (event as CustomEvent<OscdVirtualizedListFilteredDetail>).detail,
    ));

    list.searchTerm = 'et';
    await list.updateComplete;
    await waitUntil(() => headlines(list).length === 1);
    expect(headlines(list)).to.deep.equal(['Beta']);
    expect(details).to.deep.equal([{ count: 1, total: 3 }]);

    list.searchTerm = '';
    await list.updateComplete;
    await waitUntil(() => headlines(list).length === 3);
    expect(details[details.length - 1]).to.deep.equal({ count: 3, total: 3 });
  });

  it('lets a custom filter decide instead of the item search text', async () => {
    const list = await createList(['Alpha', 'Beta', 'Gamma']);
    list.filter = (item, term) => item.length === Number(term);
    list.searchTerm = '4';
    await list.updateComplete;
    await waitUntil(() => headlines(list).length === 1);
    expect(headlines(list)).to.deep.equal(['Beta']);
  });

  it('shows the empty slot instead of the list when nothing matches', async () => {
    const list = await createList(['Alpha']);
    list.searchTerm = 'zzz';
    await list.updateComplete;
    expect(list.shadowRoot!.querySelector('oscd-list')).to.equal(null);
    const slot = list.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="empty"]')!;
    expect(slot.assignedElements()[0].textContent).to.equal('Nothing found');
  });
});
