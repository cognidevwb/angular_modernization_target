/**
 * The layout arithmetic angular-gridster did for the legacy `tbDashboard`
 * (`gridster="vm.gridsterOpts"` / `gridster-item="vm.widgetItemMap"`), with the
 * same options the dashboard set: outer margins on, no pushing / floating /
 * swapping, `rowHeight` either a number or `'match'` (a row as tall as a column
 * is wide), mobile mode stacking the items full width in their sorted order.
 */

/** The options object the legacy dashboard kept as `vm.gridsterOpts`. */
export interface DashboardGridOptions {
  pushing: boolean;
  floating: boolean;
  swapping: boolean;
  maxRows: number;
  columns: number;
  /** `[vertical, horizontal]` margins in px. */
  margins: number[];
  minSizeX: number;
  minSizeY: number;
  defaultSizeX: number;
  defaultSizeY: number;
  resizable: { enabled: boolean };
  draggable: { enabled: boolean };
  saveGridItemCalculatedHeightInMobile: boolean;
  isMobile?: boolean;
  mobileModeEnabled?: boolean;
  mobileBreakPoint?: number;
  rowHeight?: number | string;
}

/** The measured grid: what angular-gridster exposed as `gridster.curColWidth` / `curRowHeight`. */
export interface DashboardGridMetrics {
  curWidth: number;
  curColWidth: number;
  curRowHeight: number;
  isMobile: boolean;
}

/** One item's place in grid units. */
export interface GridRect {
  row: number;
  col: number;
  sizeX: number;
  sizeY: number;
}

/** angular-gridster's `resolveOptions` + `updateHeight` column/row sizing for a container `curWidth` px wide. */
export function measureGrid(opts: DashboardGridOptions, curWidth: number): DashboardGridMetrics {
  const margins = opts.margins;
  const columns = opts.columns > 0 ? opts.columns : 1;
  const curColWidth = Math.max(0, (curWidth - margins[1]) / columns);
  let curRowHeight: number;
  const rowHeight = opts.rowHeight;
  if (typeof rowHeight === 'number') {
    curRowHeight = rowHeight;
  } else if (typeof rowHeight === 'string' && rowHeight.indexOf('*') !== -1) {
    curRowHeight = Math.round(curColWidth * Number(rowHeight.replace('*', '').replace(' ', '')));
  } else if (typeof rowHeight === 'string' && rowHeight.indexOf('/') !== -1) {
    curRowHeight = Math.round(curColWidth / Number(rowHeight.replace('/', '').replace(' ', '')));
  } else {
    curRowHeight = Math.round(curColWidth);
  }
  const isMobile = !!opts.mobileModeEnabled && curWidth <= (opts.mobileBreakPoint ?? 0);
  return { curWidth, curColWidth, curRowHeight, isMobile };
}

/** The item's inline style: absolute placement on a desktop grid, a stacked block on mobile. */
export function itemStyle(
  rect: GridRect,
  metrics: DashboardGridMetrics,
  opts: DashboardGridOptions,
): Record<string, string> {
  const margins = opts.margins;
  const height = rect.sizeY * metrics.curRowHeight - margins[0];
  if (metrics.isMobile) {
    return {
      position: 'relative',
      marginLeft: margins[1] + 'px',
      marginRight: margins[1] + 'px',
      marginTop: margins[0] + 'px',
      marginBottom: margins[0] + 'px',
      height: opts.saveGridItemCalculatedHeightInMobile ? height + 'px' : '',
    };
  }
  return {
    position: 'absolute',
    margin: '0',
    top: rect.row * metrics.curRowHeight + margins[0] + 'px',
    left: rect.col * metrics.curColWidth + margins[1] + 'px',
    width: rect.sizeX * metrics.curColWidth - margins[1] + 'px',
    height: height + 'px',
  };
}

/** The grid container's height: the lowest item's bottom edge plus the outer margin. */
export function gridHeight(rects: GridRect[], metrics: DashboardGridMetrics, opts: DashboardGridOptions): number {
  let rows = 0;
  for (const rect of rects) {
    rows = Math.max(rows, rect.row + rect.sizeY);
  }
  return rows * metrics.curRowHeight + opts.margins[0];
}

/** angular-gridster's `pixelsToRows` (rounded, clamped to `[0, maxRows]`). */
export function pixelsToRows(pixels: number, metrics: DashboardGridMetrics, opts: DashboardGridOptions): number {
  if (!metrics.curRowHeight) {
    return 0;
  }
  return Math.min(opts.maxRows, Math.max(0, Math.round(pixels / metrics.curRowHeight)));
}

/** angular-gridster's `pixelsToColumns` (rounded, clamped to `[0, columns]`). */
export function pixelsToColumns(pixels: number, metrics: DashboardGridMetrics, opts: DashboardGridOptions): number {
  if (!metrics.curColWidth) {
    return 0;
  }
  return Math.min(opts.columns, Math.max(0, Math.round(pixels / metrics.curColWidth)));
}
