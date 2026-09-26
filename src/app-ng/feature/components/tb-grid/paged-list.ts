/**
 * The paged lists of the "assign to customer" / "add to customer" dialogs: the legacy
 * `md-virtual-repeat` on-demand model ({pageSize, data, nextPageLink, hasNext, pending, …})
 * loaded page by page as a cdk-virtual-scroll-viewport scrolls.
 */
export interface PagedListState {
  pageSize: number;
  data: any[];
  nextPageLink: any;
  hasNext: boolean;
  pending: boolean;
  [key: string]: any;
}

/** Loads the next page of `list` with `fetch(nextPageLink)` (no-op while one is pending or at the end). */
export function fetchMorePage(list: PagedListState, fetch: (pageLink: any) => Promise<any>): void {
  if (!list.hasNext || list.pending) {
    return;
  }
  list.pending = true;
  fetch(list.nextPageLink).then(
    (page: any) => {
      list.data = list.data.concat(page.data);
      list.nextPageLink = page.nextPageLink;
      list.hasNext = page.hasNext;
      if (list.hasNext) {
        list.nextPageLink.limit = list.pageSize;
      }
      list.pending = false;
    },
    () => {
      list.hasNext = false;
      list.pending = false;
    },
  );
}

/** The viewport scrolled to `firstVisible`: load more when the loaded rows run out. */
export function onPagedListScrolled(list: PagedListState, firstVisible: number, fetch: (pageLink: any) => Promise<any>): void {
  if (firstVisible + list.pageSize >= list.data.length) {
    fetchMorePage(list, fetch);
  }
}

/** An empty list searching for `textSearch`, carrying over `extra` (selection fields). */
export function newPagedList(pageSize: number, textSearch: string, extra: Record<string, any>): PagedListState {
  return {
    pageSize,
    data: [],
    nextPageLink: { limit: pageSize, textSearch },
    hasNext: true,
    pending: false,
    ...extra,
  };
}
