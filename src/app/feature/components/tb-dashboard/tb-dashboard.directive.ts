import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnInit,
  effect,
  forwardRef,
  inject,
  model,
  output,
  untracked,
  viewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgClass, NgComponentOutlet, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { RootState } from '../../../root-state';
import { TimeService } from '../../api/services/time.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { KeyboardShortcutPipe } from '../pipes/keyboard-shortcut.pipe';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbTimewindowDirective } from '../tb-timewindow/tb-timewindow.directive';
import { TbWidgetDirective } from '../tb-widget/tb-widget.directive';
import {
  DashboardGridMetrics,
  DashboardGridOptions,
  GridRect,
  gridHeight,
  itemStyle,
  measureGrid,
  pixelsToColumns,
  pixelsToRows,
} from './tb-dashboard-grid';

/** An in-progress drag or resize of one widget in edit mode. */
interface GridGesture {
  kind: 'move' | 'resize';
  widget: any;
  startX: number;
  startY: number;
  start: GridRect;
  moved: boolean;
}

/** The payload of `prepareDashboardContextMenu` / `prepareWidgetContextMenu`: a handler sets `items` to the menu it wants. */
export interface ContextMenuRequest {
  widget?: any;
  items?: any[];
}

/** The payload of `loadWidgets`: a handler that loads asynchronously sets `promise`. */
export interface LoadWidgetsRequest {
  promise?: Promise<unknown>;
}

/** The `$mdMedia('gt-sm')` breakpoint. */
const GT_SM = '(min-width: 960px)';

/**
 * Ported from the AngularJS directive `tbDashboard` (module `thingsboard.directives.dashboard`) in src/app/components/dashboard.directive.js:36.
 * Its `DashboardController` (controllerAs `vm`) is this class. The angular-gridster grid is laid out by
 * `tb-dashboard-grid.ts`; the `$scope.$broadcast`s to the widgets go through RootState with this dashboard
 * as the last argument, so a widget can tell its own dashboard's events from another's.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-dashboard',
  standalone: true,
  imports: [
    NgClass, NgStyle, NgComponentOutlet, FormsModule, TranslatePipe, KeyboardShortcutPipe, MatTooltipModule,
    MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatButtonModule,
    forwardRef(() => TbExpandFullscreenDirective), forwardRef(() => TbTimewindowDirective),
  ],
  templateUrl: './tb-dashboard.directive.html',
})
export class TbDashboardDirective implements OnInit, AfterViewInit, AfterViewChecked {
  readonly widgets = model<any>();
  readonly widgetLayouts = model<any>();
  readonly aliasController = model<any>();
  readonly stateController = model<any>();
  readonly dashboardTimewindow = model<any>();
  readonly columns = model<any>();
  readonly margins = model<any>();
  readonly isEdit = model<any>();
  readonly autofillHeight = model<any>();
  readonly mobileAutofillHeight = model<any>();
  readonly mobileRowHeight = model<any>();
  readonly isMobile = model<any>();
  readonly isMobileDisabled = model<any>();
  readonly isEditActionEnabled = model<any>();
  readonly isExportActionEnabled = model<any>();
  readonly isRemoveActionEnabled = model<any>();
  readonly onEditWidget = output<any>();
  readonly onExportWidget = output<any>();
  readonly onRemoveWidget = output<any>();
  readonly onWidgetMouseDown = output<any>();
  readonly onWidgetClicked = output<any>();
  readonly prepareDashboardContextMenu = output<ContextMenuRequest>();
  readonly prepareWidgetContextMenu = output<ContextMenuRequest>();
  readonly loadWidgets = output<LoadWidgetsRequest>();
  readonly onInit = output<any>();
  readonly onInitFailed = output<any>();
  readonly dashboardStyle = model<any>();
  readonly dashboardClass = model<any>();
  readonly ignoreLoading = model<any>();

  protected readonly rootScope = inject(RootState);
  protected readonly timeService = inject(TimeService);
  protected readonly utils = inject(UtilsService);
  protected readonly types: any = types;
  protected readonly widgetComponent = TbWidgetDirective;
  private readonly breakpoints = inject(BreakpointObserver);
  private readonly zone = inject(NgZone);
  private readonly cdr = inject(ChangeDetectorRef);
  /** What the widget headers last rendered from the widgets' contexts (see ngAfterViewChecked). */
  private headerSignature = '';
  private readonly destroyRef = inject(DestroyRef);

  private readonly gridsterParent = viewChild<ElementRef<HTMLElement>>('gridsterParent');
  private readonly dashboardMenuTrigger = viewChild<MatMenuTrigger>('dashboardMenuTrigger');
  private readonly widgetMenuTrigger = viewChild<MatMenuTrigger>('widgetMenuTrigger');

  private highlightedMode = false;
  private highlightedWidget: any = null;
  private selectedWidget: any = null;
  private gesture: GridGesture | null = null;
  private suppressClick = false;
  private resizeObserver: ResizeObserver | null = null;
  private viewportHeightWaiters: ((height: number) => void)[] = [];
  private prevIsMobileSize: any;
  private originalDashboardTimewindow: any = null;
  private dashboardLoaded$ = false;

  gridsterOpts: DashboardGridOptions = {
    pushing: false,
    floating: false,
    swapping: false,
    maxRows: 100,
    columns: 24,
    margins: [10, 10],
    minSizeX: 1,
    minSizeY: 1,
    defaultSizeX: 8,
    defaultSizeY: 6,
    resizable: { enabled: false },
    draggable: { enabled: false },
    saveGridItemCalculatedHeightInMobile: true,
  };
  /** The measured grid (legacy `vm.gridster.curColWidth` / `curRowHeight` / `isMobile`). */
  gridMetrics: DashboardGridMetrics = { curWidth: 0, curColWidth: 0, curRowHeight: 0, isMobile: false };

  isMobileSize = false;
  dashboardLoading = true;
  isResizing = false;
  isWidgetExpanded = false;
  visibleRect: any = { top: 0, bottom: 0, left: 0, right: 0 };
  widgetIds: string[] = [];
  contextMenuItems: any[] = [];
  contextMenuEvent: any = null;
  widgetContextMenuItems: any[] = [];
  widgetContextMenuEvent: any = null;
  widgetContextMenuWidget: any = null;
  /** Where the mouse-point menu opens (legacy `tb-mousepoint-menu`), in viewport px. */
  menuPosition = { x: 0, y: 0 };

  /** The per-widget `locals` the legacy template passed to `tb-widget`, kept stable per widget. */
  private readonly widgetLocalsMap = new Map<any, any>();

  readonly dashboardTimewindowApi = {
    onResetTimewindow: () => {
      setTimeout(() => {
        if (this.originalDashboardTimewindow) {
          this.dashboardTimewindow.set(structuredClone(this.originalDashboardTimewindow));
          this.originalDashboardTimewindow = null;
        }
      }, 0);
    },
    onUpdateTimewindow: (startTimeMs?: any, endTimeMs?: any, interval?: any) => {
      if (!this.originalDashboardTimewindow) {
        this.originalDashboardTimewindow = structuredClone(this.dashboardTimewindow());
      }
      setTimeout(() => {
        this.dashboardTimewindow.set(
          this.timeService.toHistoryTimewindow(this.dashboardTimewindow(), startTimeMs, endTimeMs, interval),
        );
      }, 0);
    },
  };

  constructor() {
    const gtSm = this.breakpoints.observe(GT_SM).subscribe(() => {
      this.updateMobileOpts();
      this.sortWidgets();
    });
    this.destroyRef.onDestroy(() => gtSm.unsubscribe());

    const offPositionChanged = this.rootScope.$on('widgetPositionChanged', () => this.sortWidgets());
    this.destroyRef.onDestroy(offPositionChanged);

    effect(() => {
      const columns = this.columns() ? this.columns() : 24;
      untracked(() => {
        if (this.gridsterOpts.columns != columns) {
          this.gridsterOpts.columns = columns;
          this.updateGridMetrics();
        }
      });
    });

    effect(() => {
      this.isMobile();
      this.isMobileDisabled();
      untracked(() => {
        this.updateMobileOpts();
        this.sortWidgets();
      });
    });

    effect(() => {
      this.autofillHeight();
      this.mobileAutofillHeight();
      this.mobileRowHeight();
      untracked(() => this.updateMobileOpts());
    });

    effect(() => {
      const margins = this.margins() ? this.margins() : [10, 10];
      untracked(() => {
        if (!isEqual(this.gridsterOpts.margins, margins)) {
          this.gridsterOpts.margins = margins;
          this.updateMobileOpts();
        }
      });
    });

    effect(() => {
      const isEdit = this.isEdit();
      untracked(() => {
        this.gridsterOpts.resizable.enabled = !!isEdit;
        this.gridsterOpts.draggable.enabled = !!isEdit;
        this.rootScope.$broadcast('toggleDashboardEditMode', isEdit, this);
      });
    });

    effect(() => {
      const widgets = this.widgets();
      untracked(() => this.onWidgetsChanged(widgets));
    });

    effect(() => {
      this.widgetLayouts();
      untracked(() => {
        this.updateMobileOpts();
        this.sortWidgets();
      });
    });

    effect(() => {
      const dashboardTimewindow = this.dashboardTimewindow();
      untracked(() => {
        if (this.dashboardLoaded$) {
          this.rootScope.$broadcast('dashboardTimewindowChanged', dashboardTimewindow, this);
        }
      });
    });

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
      this.endGesture();
    });
  }

  ngOnInit(): void {
    if (this.isMobileDisabled() === undefined) {
      this.isMobileDisabled.set(false);
    }
    if (this.dashboardTimewindow() === undefined) {
      this.dashboardTimewindow.set(this.timeService.defaultTimewindow());
    }
    this.gridsterOpts.columns = this.columns() ? this.columns() : 24;
    this.gridsterOpts.margins = this.margins() ? this.margins() : [10, 10];
    this.gridsterOpts.resizable.enabled = !!this.isEdit();
    this.gridsterOpts.draggable.enabled = !!this.isEdit();
    this.updateMobileOpts();
    this.loadDashboard();
  }

  ngAfterViewInit(): void {
    const parent = this.gridsterParent()?.nativeElement;
    if (parent && typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.zone.run(() => this.onGridsterParentResize()));
      this.resizeObserver.observe(parent);
    }
  }

  /**
   * A widget's header (its actions, title template, timewindow) reads the widget context the widget
   * component creates while this view is being checked. The AngularJS digest looped until nothing
   * changed; here, when a context appeared or its actions changed since the last check, the view is
   * checked once more so the headers show them.
   */
  ngAfterViewChecked(): void {
    const signature = (this.widgets() || [])
      .map((w: any) => `${w.$ctx ? 1 : 0}:${this.widgetActions(w).length}:${this.customWidgetHeaderActions(w).length}`)
      .join('|');
    if (signature !== this.headerSignature) {
      this.headerSignature = signature;
      this.cdr.detectChanges();
    }
  }

  // ---- grid layout -------------------------------------------------------------------------

  /** Legacy `onGridsterParentResize` + angular-gridster's own resize handling. */
  private onGridsterParentResize(): void {
    const parent = this.gridsterParent()?.nativeElement;
    if (!parent) {
      return;
    }
    const height = parent.clientHeight;
    if (height) {
      const waiters = this.viewportHeightWaiters;
      this.viewportHeightWaiters = [];
      waiters.forEach((resolve) => resolve(height));
    }
    const wasMobile = this.gridMetrics.isMobile;
    this.updateGridMetrics();
    if (height && this.isAutofillHeight()) {
      this.updateMobileOpts();
    }
    if (wasMobile !== this.gridMetrics.isMobile) {
      // Legacy `gridsterMobileChanged`.
      this.detectRowSize(this.gridMetrics.isMobile).then((rowHeight) => {
        if (this.gridsterOpts.rowHeight != rowHeight) {
          this.gridsterOpts.rowHeight = rowHeight;
          this.updateGridMetrics();
        }
      });
      this.isMobileSize = this.checkIsMobileSize();
      this.notifyMobileSize();
    }
    this.isResizing = false;
  }

  private updateGridMetrics(): void {
    const parent = this.gridsterParent()?.nativeElement;
    const width = parent ? parent.clientWidth : 0;
    this.gridMetrics = measureGrid(this.gridsterOpts, width);
  }

  private updateMobileOpts(): void {
    const isMobileDisabled = this.isMobileDisabled() === true;
    let isMobile = this.isMobile() === true && !isMobileDisabled;
    const mobileBreakPoint = isMobileDisabled ? 0 : (isMobile ? 20000 : 960);

    if (!isMobile && !isMobileDisabled) {
      isMobile = !this.breakpoints.isMatched(GT_SM);
    }

    if (this.gridsterOpts.isMobile != isMobile) {
      this.gridsterOpts.isMobile = isMobile;
      this.gridsterOpts.mobileModeEnabled = isMobile;
    }
    if (this.gridsterOpts.mobileBreakPoint != mobileBreakPoint) {
      this.gridsterOpts.mobileBreakPoint = mobileBreakPoint;
    }
    this.updateGridMetrics();
    this.detectRowSize(isMobile).then((rowHeight) => {
      if (this.gridsterOpts.rowHeight != rowHeight) {
        this.gridsterOpts.rowHeight = rowHeight;
        this.updateGridMetrics();
      }
    });
    this.isMobileSize = this.checkIsMobileSize();
    this.notifyMobileSize();
  }

  /** Legacy `$watch('vm.isMobileSize')`. */
  private notifyMobileSize(): void {
    if (!isEqual(this.isMobileSize, this.prevIsMobileSize)) {
      this.rootScope.$broadcast('mobileModeChanged', this.isMobileSize, this);
    }
    this.prevIsMobileSize = this.isMobileSize;
  }

  private checkIsMobileSize(): boolean {
    const isMobileDisabled = this.isMobileDisabled() === true;
    let isMobileSize = this.isMobile() === true && !isMobileDisabled;
    if (!isMobileSize && !isMobileDisabled) {
      isMobileSize = !this.breakpoints.isMatched(GT_SM);
    }
    return isMobileSize;
  }

  /** Legacy `$watchCollection('vm.widgets')`. */
  private onWidgetsChanged(widgets: any[] | undefined): void {
    if (!widgets) {
      return;
    }
    const ids: string[] = [];
    for (const widget of widgets) {
      if (!widget.id) {
        widget.id = this.utils.guid();
      }
      ids.push(widget.id);
    }
    ids.sort((id1, id2) => id1.localeCompare(id2));
    this.sortWidgets();
    if (isEqual(ids, this.widgetIds)) {
      return;
    }
    this.widgetIds = ids;
    for (const widget of Array.from(this.widgetLocalsMap.keys())) {
      if (widgets.indexOf(widget) === -1) {
        this.widgetLocalsMap.delete(widget);
      }
    }
    setTimeout(() => {
      if (this.isAutofillHeight()) {
        this.updateMobileOpts();
      }
    });
  }

  isAutofillHeight(): boolean {
    if (this.gridsterOpts.isMobile) {
      return this.mobileAutofillHeight() !== undefined ? !!this.mobileAutofillHeight() : false;
    } else {
      return this.autofillHeight() !== undefined ? !!this.autofillHeight() : false;
    }
  }

  private detectViewportHeight(): Promise<number> {
    const height = this.gridsterParent()?.nativeElement.clientHeight;
    if (height) {
      return Promise.resolve(height);
    }
    return new Promise((resolve) => this.viewportHeightWaiters.push(resolve));
  }

  private detectRowSize(isMobile: boolean): Promise<number | string> {
    if (this.isAutofillHeight()) {
      return this.detectViewportHeight().then((viewportHeight) => {
        const widgets = this.widgets() || [];
        let totalRows = 0;
        for (const w of widgets) {
          const sizeY = this.widgetSizeY(w);
          if (isMobile) {
            totalRows += sizeY;
          } else {
            totalRows = Math.max(totalRows, this.widgetRow(w) + sizeY);
          }
        }
        const margins = this.gridsterOpts.margins;
        return (viewportHeight - margins[1] * (widgets.length + 1) + margins[0] * widgets.length) / totalRows;
      });
    } else if (isMobile) {
      return Promise.resolve(this.mobileRowHeight() !== undefined ? this.mobileRowHeight() : 70);
    } else {
      return Promise.resolve('match');
    }
  }

  private widgetOrder(widget: any): any {
    const widgetLayouts = this.widgetLayouts();
    const hasLayout = widgetLayouts && widgetLayouts[widget.id];
    if (hasLayout && widgetLayouts[widget.id].mobileOrder !== undefined
        && widgetLayouts[widget.id].mobileOrder >= 0) {
      return widgetLayouts[widget.id].mobileOrder;
    } else if (widget.config.mobileOrder !== undefined && widget.config.mobileOrder >= 0) {
      return widget.config.mobileOrder;
    } else if (hasLayout) {
      return widgetLayouts[widget.id].row;
    } else {
      return widget.row;
    }
  }

  private sortWidgets(): void {
    const widgets = this.widgets();
    if (!widgets) {
      return;
    }
    widgets.sort((widget1: any, widget2: any) => {
      let res = this.widgetOrder(widget1) - this.widgetOrder(widget2);
      if (res === 0) {
        res = this.widgetCol(widget1) - this.widgetCol(widget2);
      }
      return res;
    });
  }

  private gridRect(widget: any): GridRect {
    return {
      row: this.widgetRow(widget),
      col: this.widgetCol(widget),
      sizeX: this.widgetSizeX(widget),
      sizeY: this.widgetSizeY(widget),
    };
  }

  /** The `gridster-item` placement of one widget. */
  gridItemStyle(widget: any): Record<string, string> {
    return itemStyle(this.gridRect(widget), this.gridMetrics, this.gridsterOpts);
  }

  /** The grid container's height (desktop); a mobile grid flows. */
  gridContainerHeight(): string {
    if (this.gridMetrics.isMobile) {
      return 'auto';
    }
    const widgets = this.widgets() || [];
    return gridHeight(widgets.map((w: any) => this.gridRect(w)), this.gridMetrics, this.gridsterOpts) + 'px';
  }

  canEditLayout(): boolean {
    return !!this.gridsterOpts.draggable.enabled && !this.gridMetrics.isMobile;
  }

  // ---- loading -----------------------------------------------------------------------------

  reload(): void {
    this.loadDashboard();
  }

  private loadDashboard(): void {
    setTimeout(() => {
      const request: LoadWidgetsRequest = {};
      this.loadWidgets.emit(request);
      if (request.promise) {
        request.promise.then(() => this.dashboardLoaded(), () => this.dashboardLoaded());
      } else {
        this.dashboardLoaded();
      }
    }, 0);
  }

  private dashboardLoaded(): void {
    setTimeout(() => {
      this.dashboardLoaded$ = true;
      this.rootScope.$broadcast('dashboardTimewindowChanged', this.dashboardTimewindow(), this);
      this.adoptMaxRows();
      this.dashboardLoading = false;
      this.updateGridMetrics();
      this.onInit.emit({ dashboard: this });
    });
  }

  private adoptMaxRows(): void {
    const widgets = this.widgets();
    if (widgets) {
      let maxRows = this.gridsterOpts.maxRows;
      for (const w of widgets) {
        maxRows = Math.max(maxRows, this.widgetRow(w) + this.widgetSizeY(w));
      }
      this.gridsterOpts.maxRows = Math.max(maxRows, this.gridsterOpts.maxRows);
    }
  }

  loading(): boolean {
    return !this.ignoreLoading() && !!this.rootScope.loading;
  }

  // ---- widget events -----------------------------------------------------------------------

  onWidgetFullscreenChanged(expanded: any, widget: any): void {
    this.isWidgetExpanded = expanded;
    this.rootScope.$broadcast('onWidgetFullscreenChanged', this.isWidgetExpanded, widget, this);
  }

  widgetMouseDown($event: MouseEvent, widget: any): void {
    this.onWidgetMouseDown.emit({ event: $event, widget: widget });
    this.startGesture($event, widget, 'move');
  }

  widgetClicked($event: MouseEvent, widget: any): void {
    if (this.suppressClick) {
      this.suppressClick = false;
      return;
    }
    this.onWidgetClicked.emit({ event: $event, widget: widget });
  }

  openDashboardContextMenu($event: MouseEvent): void {
    const request: ContextMenuRequest = {};
    this.prepareDashboardContextMenu.emit(request);
    this.contextMenuItems = request.items || [];
    if (this.contextMenuItems.length > 0) {
      $event.preventDefault();
      this.contextMenuEvent = $event;
      this.openMenuAt($event, this.dashboardMenuTrigger());
    }
  }

  openWidgetContextMenu($event: MouseEvent, widget: any): void {
    const request: ContextMenuRequest = { widget: widget };
    this.prepareWidgetContextMenu.emit(request);
    this.widgetContextMenuItems = request.items || [];
    if (this.widgetContextMenuItems.length > 0) {
      $event.preventDefault();
      $event.stopPropagation();
      this.widgetContextMenuEvent = $event;
      this.widgetContextMenuWidget = widget;
      this.openMenuAt($event, this.widgetMenuTrigger());
    }
  }

  private openMenuAt($event: MouseEvent, trigger: MatMenuTrigger | undefined): void {
    this.menuPosition = { x: $event.clientX, y: $event.clientY };
    if (trigger) {
      setTimeout(() => trigger.openMenu());
    }
  }

  getEventGridPosition(event: MouseEvent): { row: number; column: number } {
    const pos = { row: 0, column: 0 };
    const parent = this.gridsterParent()?.nativeElement;
    if (!parent) {
      return pos;
    }
    const rect = parent.getBoundingClientRect();
    const x = event.clientX - rect.left + parent.scrollLeft;
    const y = event.clientY - rect.top + parent.scrollTop;
    pos.row = pixelsToRows(y, this.gridMetrics, this.gridsterOpts);
    pos.column = pixelsToColumns(x, this.gridMetrics, this.gridsterOpts);
    return pos;
  }

  editWidget($event: MouseEvent | null, widget: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.isEditActionEnabled()) {
      this.onEditWidget.emit({ event: $event, widget: widget });
    }
  }

  exportWidget($event: MouseEvent | null, widget: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.isExportActionEnabled()) {
      this.onExportWidget.emit({ event: $event, widget: widget });
    }
  }

  removeWidget($event: MouseEvent | null, widget: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.isRemoveActionEnabled()) {
      this.onRemoveWidget.emit({ event: $event, widget: widget });
    }
  }

  // ---- drag / resize (angular-gridster draggable + resizable in edit mode) ----------------

  startResize($event: MouseEvent, widget: any): void {
    $event.stopPropagation();
    this.startGesture($event, widget, 'resize');
  }

  private startGesture($event: MouseEvent, widget: any, kind: 'move' | 'resize'): void {
    if ($event.button !== 0 || !this.canEditLayout()) {
      return;
    }
    this.gesture = {
      kind,
      widget,
      startX: $event.clientX,
      startY: $event.clientY,
      start: this.gridRect(widget),
      moved: false,
    };
    document.addEventListener('mousemove', this.onGestureMove);
    document.addEventListener('mouseup', this.onGestureEnd);
  }

  private readonly onGestureMove = (event: MouseEvent): void => {
    const gesture = this.gesture;
    if (!gesture || !this.gridMetrics.curColWidth || !this.gridMetrics.curRowHeight) {
      return;
    }
    const dx = event.clientX - gesture.startX;
    const dy = event.clientY - gesture.startY;
    if (!gesture.moved && Math.abs(dx) < 3 && Math.abs(dy) < 3) {
      return;
    }
    gesture.moved = true;
    event.preventDefault();
    const dCols = Math.round(dx / this.gridMetrics.curColWidth);
    const dRows = Math.round(dy / this.gridMetrics.curRowHeight);
    const start = gesture.start;
    const widget = gesture.widget;
    this.zone.run(() => {
      if (gesture.kind === 'move') {
        const col = Math.min(Math.max(0, start.col + dCols), Math.max(0, this.gridsterOpts.columns - start.sizeX));
        const row = Math.min(Math.max(0, start.row + dRows), this.gridsterOpts.maxRows - start.sizeY);
        this.setWidgetCol(widget, col);
        this.setWidgetRow(widget, row);
      } else {
        const sizeX = Math.min(Math.max(this.gridsterOpts.minSizeX, start.sizeX + dCols), this.gridsterOpts.columns - start.col);
        let sizeY = Math.max(widget.minSizeY || this.gridsterOpts.minSizeY, start.sizeY + dRows);
        if (widget.maxSizeY) {
          sizeY = Math.min(widget.maxSizeY, sizeY);
        }
        this.setWidgetSizeX(widget, sizeX);
        this.setWidgetSizeY(widget, sizeY);
      }
    });
  };

  private readonly onGestureEnd = (): void => {
    const gesture = this.gesture;
    this.endGesture();
    if (gesture?.moved) {
      this.suppressClick = true;
      setTimeout(() => (this.suppressClick = false));
      this.zone.run(() => {
        this.adoptMaxRows();
        this.sortWidgets();
        this.rootScope.$emit('widgetPositionChanged', gesture.widget);
      });
    }
  };

  private endGesture(): void {
    this.gesture = null;
    document.removeEventListener('mousemove', this.onGestureMove);
    document.removeEventListener('mouseup', this.onGestureEnd);
  }

  // ---- highlight / select ------------------------------------------------------------------

  highlightWidget(widget: any, delay?: number): void {
    if (!this.highlightedMode || this.highlightedWidget != widget) {
      this.highlightedMode = true;
      this.highlightedWidget = widget;
      this.scrollToWidget(widget, delay);
    }
  }

  selectWidget(widget: any, delay?: number): void {
    if (this.selectedWidget != widget) {
      this.selectedWidget = widget;
      this.scrollToWidget(widget, delay);
    }
  }

  private scrollToWidget(widget: any, delay?: number): void {
    const parent = this.gridsterParent()?.nativeElement;
    const widgets = this.widgets() || [];
    if (!parent) {
      return;
    }
    const item = parent.querySelectorAll<HTMLElement>('.gridster-item')[widgets.indexOf(widget)];
    if (item) {
      const height = item.offsetHeight;
      const rectHeight = parent.clientHeight;
      const offset = (rectHeight - height) / 2;
      let scrollTop = item.offsetTop;
      if (offset > 0) {
        scrollTop -= offset;
      }
      parent.scrollTo({ top: scrollTop, behavior: delay ? 'smooth' : 'auto' });
    }
  }

  getSelectedWidget(): any {
    return this.selectedWidget;
  }

  resetHighlight(): void {
    this.highlightedMode = false;
    this.highlightedWidget = null;
    this.selectedWidget = null;
  }

  isHighlighted(widget: any): boolean {
    return (this.highlightedMode && this.highlightedWidget === widget) || (this.selectedWidget === widget);
  }

  isNotHighlighted(widget: any): boolean {
    return this.highlightedMode && this.highlightedWidget != widget;
  }

  // ---- widget layout accessors (legacy `vm.widgetLayoutInfo`) -----------------------------

  widgetSizeX(widget: any): any {
    const widgetLayouts = this.widgetLayouts();
    if (widgetLayouts && widgetLayouts[widget.id]) {
      return widgetLayouts[widget.id].sizeX;
    }
    return widget.sizeX;
  }

  setWidgetSizeX(widget: any, sizeX: any): void {
    if (!this.gridsterOpts.isMobile) {
      const widgetLayouts = this.widgetLayouts();
      if (widgetLayouts && widgetLayouts[widget.id]) {
        widgetLayouts[widget.id].sizeX = sizeX;
      } else {
        widget.sizeX = sizeX;
      }
    }
  }

  widgetSizeY(widget: any): any {
    const widgetLayouts = this.widgetLayouts();
    if (this.gridsterOpts.isMobile && !this.mobileAutofillHeight()) {
      let mobileHeight: any;
      if (widgetLayouts && widgetLayouts[widget.id]) {
        mobileHeight = widgetLayouts[widget.id].mobileHeight;
      }
      if (!mobileHeight && widget.config.mobileHeight) {
        mobileHeight = widget.config.mobileHeight;
      }
      if (mobileHeight) {
        return mobileHeight;
      }
      return widget.sizeY * 24 / this.gridsterOpts.columns;
    }
    if (widgetLayouts && widgetLayouts[widget.id]) {
      return widgetLayouts[widget.id].sizeY;
    }
    return widget.sizeY;
  }

  setWidgetSizeY(widget: any, sizeY: any): void {
    if (!this.gridsterOpts.isMobile && !this.autofillHeight()) {
      const widgetLayouts = this.widgetLayouts();
      if (widgetLayouts && widgetLayouts[widget.id]) {
        widgetLayouts[widget.id].sizeY = sizeY;
      } else {
        widget.sizeY = sizeY;
      }
    }
  }

  widgetRow(widget: any): any {
    const widgetLayouts = this.widgetLayouts();
    if (widgetLayouts && widgetLayouts[widget.id]) {
      return widgetLayouts[widget.id].row;
    }
    return widget.row;
  }

  setWidgetRow(widget: any, row: any): void {
    if (!this.gridsterOpts.isMobile) {
      const widgetLayouts = this.widgetLayouts();
      if (widgetLayouts && widgetLayouts[widget.id]) {
        widgetLayouts[widget.id].row = row;
      } else {
        widget.row = row;
      }
    }
  }

  widgetCol(widget: any): any {
    const widgetLayouts = this.widgetLayouts();
    if (widgetLayouts && widgetLayouts[widget.id]) {
      return widgetLayouts[widget.id].col;
    }
    return widget.col;
  }

  setWidgetCol(widget: any, col: any): void {
    if (!this.gridsterOpts.isMobile) {
      const widgetLayouts = this.widgetLayouts();
      if (widgetLayouts && widgetLayouts[widget.id]) {
        widgetLayouts[widget.id].col = col;
      } else {
        widget.col = col;
      }
    }
  }

  // ---- widget chrome -----------------------------------------------------------------------

  /** The `locals` object the legacy template built for `tb-widget`; one per widget so the widget keeps its identity. */
  widgetLocals(widget: any): any {
    let locals = this.widgetLocalsMap.get(widget);
    if (!locals) {
      locals = { widget: widget, dashboard: this, dashboardTimewindowApi: this.dashboardTimewindowApi };
      this.widgetLocalsMap.set(widget, locals);
    }
    locals.visibleRect = this.visibleRect;
    locals.aliasController = this.aliasController();
    locals.stateController = this.stateController();
    locals.isEdit = this.isEdit();
    locals.isMobile = this.isMobileSize;
    locals.dashboardTimewindow = this.dashboardTimewindow();
    return locals;
  }

  widgetStyle(widget: any): any {
    const style: any = {
      cursor: 'pointer',
      color: this.widgetColor(widget),
      backgroundColor: this.widgetBackgroundColor(widget),
      padding: this.widgetPadding(widget),
      margin: this.widgetMargin(widget),
    };
    if (widget.config.widgetStyle !== undefined) {
      Object.assign(style, widget.config.widgetStyle);
    }
    return style;
  }

  private widgetColor(widget: any): any {
    return widget.config.color ? widget.config.color : 'rgba(0, 0, 0, 0.87)';
  }

  private widgetBackgroundColor(widget: any): any {
    return widget.config.backgroundColor ? widget.config.backgroundColor : '#fff';
  }

  private widgetPadding(widget: any): any {
    return widget.config.padding ? widget.config.padding : '8px';
  }

  private widgetMargin(widget: any): any {
    return widget.config.margin ? widget.config.margin : '0px';
  }

  showWidgetTitle(widget: any): any {
    return widget.config.showTitle !== undefined ? widget.config.showTitle : true;
  }

  showWidgetTitleIcon(widget: any): any {
    return widget.config.showTitleIcon !== undefined ? widget.config.showTitleIcon : false;
  }

  hasWidgetTitleTemplate(widget: any): boolean {
    const ctx = this.widgetContext(widget);
    return !!(ctx && ctx.widgetTitleTemplate);
  }

  widgetTitleTemplate(widget: any): string {
    const ctx = this.widgetContext(widget);
    return ctx && ctx.widgetTitleTemplate ? ctx.widgetTitleTemplate : '';
  }

  showWidgetTitlePanel(widget: any): any {
    const ctx = this.widgetContext(widget);
    if (ctx && ctx.hideTitlePanel) {
      return false;
    }
    return this.hasWidgetTitleTemplate(widget) || this.showWidgetTitle(widget) || this.hasTimewindow(widget);
  }

  showWidgetActions(widget: any): boolean {
    const ctx = this.widgetContext(widget);
    return !(ctx && ctx.hideTitlePanel);
  }

  widgetTitleStyle(widget: any): any {
    return widget.config.titleStyle !== undefined ? widget.config.titleStyle : {};
  }

  widgetTitle(widget: any): any {
    const ctx = this.widgetContext(widget);
    if (ctx && ctx.widgetTitle && ctx.widgetTitle.length) {
      return ctx.widgetTitle;
    }
    return widget.config.title;
  }

  widgetTitleIcon(widget: any): any {
    return widget.config.titleIcon !== undefined ? widget.config.titleIcon : '';
  }

  widgetTitleIconStyle(widget: any): any {
    const style: any = {};
    if (widget.config.iconColor !== undefined) {
      style.color = widget.config.iconColor;
    }
    if (widget.config.iconSize !== undefined) {
      style.fontSize = widget.config.iconSize;
    }
    return style;
  }

  widgetTitleTooltip(widget: any): any {
    const ctx = this.widgetContext(widget);
    if (ctx && ctx.widgetTitleTooltip && ctx.widgetTitleTooltip.length) {
      return ctx.widgetTitleTooltip;
    }
    return widget.config.titleTooltip;
  }

  customWidgetHeaderActions(widget: any): any[] {
    const ctx = this.widgetContext(widget);
    return ctx && ctx.customHeaderActions && ctx.customHeaderActions.length ? ctx.customHeaderActions : [];
  }

  widgetActions(widget: any): any[] {
    const ctx = this.widgetContext(widget);
    return ctx && ctx.widgetActions && ctx.widgetActions.length ? ctx.widgetActions : [];
  }

  private widgetContext(widget: any): any {
    return widget.$ctx ? widget.$ctx() : undefined;
  }

  dropWidgetShadow(widget: any): any {
    return widget.config.dropShadow !== undefined ? widget.config.dropShadow : true;
  }

  enableWidgetFullscreen(widget: any): any {
    return widget.config.enableFullscreen !== undefined ? widget.config.enableFullscreen : true;
  }

  hasTimewindow(widget: any): any {
    if (widget.type === types.widgetType.timeseries.value || widget.type === types.widgetType.alarm.value) {
      return widget.config.useDashboardTimewindow !== undefined ?
        (!widget.config.useDashboardTimewindow &&
          (widget.config.displayTimewindow === undefined || widget.config.displayTimewindow)) : false;
    }
    return false;
  }

  hasAggregation(widget: any): boolean {
    return widget.type === types.widgetType.timeseries.value;
  }
}
