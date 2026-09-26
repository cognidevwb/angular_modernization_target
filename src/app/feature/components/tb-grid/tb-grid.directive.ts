import { AfterViewInit, Component, DestroyRef, OnInit, Type, forwardRef, inject, input, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { NgClass } from '@angular/common';
import { ControlContainer, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../api/services/user.service';
import { RootState } from '../../../root-state';
import { TbGridCardContentDirective } from '../tb-grid-card-content/tb-grid-card-content.directive';
import { TbDetailsSidenavDirective } from '../tb-details-sidenav/tb-details-sidenav.directive';
import { ItemCardComponent } from '../item-card/item-card.component';
import { AddItemDialogData } from '../add-item/add-item.component';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { legacyForm, LegacyForm } from './legacy-form';

/** A card or footer action (`actionsList`, `groupActionsList`, `addItemAction(s)`). */
export interface GridAction {
  onAction: ($event: any, item?: any) => void;
  name: () => any;
  details: (arg?: any) => any;
  icon: string;
  isEnabled?: (item?: any) => any;
}

/**
 * The grid configuration a page passes as `[config]` — the legacy `gridConfiguration` object,
 * with the same field names. Every field is optional; the grid supplies the legacy defaults.
 */
export interface GridConfig {
  fetchItemsFunc?: (pageLink: any, entitySubtype?: any) => Promise<any> | null;
  loadItemDetailsFunc?: (item: any) => Promise<any>;
  saveItemFunc?: (item: any) => Promise<any>;
  deleteItemFunc?: (id: any) => Promise<any>;
  clickItemFunc?: ($event: any, item: any) => void;
  getItemTitleFunc?: (item: any) => any;
  refreshParamsFunc?: (() => any) | null;
  deleteItemTitleFunc?: (item?: any) => any;
  deleteItemContentFunc?: (item?: any) => any;
  deleteItemsTitleFunc?: (selectedCount?: any) => any;
  deleteItemsActionTitleFunc?: (selectedCount?: any) => any;
  deleteItemsContentFunc?: () => any;
  addItemText?: () => any;
  noItemsText?: () => any;
  itemDetailsText?: (item?: any) => any;
  isDetailsReadOnly?: (item?: any) => any;
  isSelectionEnabled?: (item?: any) => any;
  actionsList?: GridAction[];
  groupActionsList?: GridAction[];
  addItemAction?: Partial<GridAction>;
  addItemActions?: GridAction[];
  onGridInited?: (grid: TbGridDirective) => void;
  parentCtl?: any;
  itemHeight?: number;
  topIndex?: number;
  items?: any;
}

/** $mdMedia's breakpoints: xs+sm, md, lg, gt-lg. */
const MEDIA = {
  sm: '(max-width: 959.98px)',
  md: '(min-width: 960px) and (max-width: 1279.98px)',
  lg: '(min-width: 1280px) and (max-width: 1919.98px)',
  gtLg: '(min-width: 1920px)',
};

/**
 * Ported from the AngularJS directive `tbGrid` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * An entity card grid: pages of `fetchItemsFunc(pageLink)` loaded as the list scrolls, cards in
 * 1–4 columns by breakpoint, selection with bulk actions, and a details sidenav holding the page's
 * projected content (`<div details-buttons>` for the header buttons, the rest for the details).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-grid',
  standalone: true,
  imports: [TranslatePipe, NgClass, ScrollingModule, MatTooltipModule, MatIconModule, MatCheckboxModule, MatCardModule, MatButtonModule, TbGridCardContentDirective, forwardRef(() => TbDetailsSidenavDirective)],
  providers: [{ provide: ControlContainer, useFactory: () => inject(TbGridDirective).detailsNgForm }],
  templateUrl: './tb-grid.directive.html',
})
export class TbGridDirective implements OnInit, AfterViewInit {
  /** The page's grid configuration (the legacy `grid-configuration`). */
  readonly config = input<GridConfig>({});
  /** The card body, rendered per item with the inputs `item` and `parentCtl`. */
  readonly itemCardComponent = input<Type<unknown> | null | undefined>(ItemCardComponent);
  /** The add dialog, opened with `{ saveItemFunction, parentCtl }`; it closes with the saved item. */
  readonly addItemComponent = input<Type<unknown> | null | undefined>();

  protected readonly rootScope = inject(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly userService = inject(UserService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly viewport = viewChild(CdkVirtualScrollViewport);

  /** The details form the projected entity details join (the legacy grid's `detailsForm`). */
  readonly detailsNgForm = new NgForm([], []);
  readonly detailsForm: LegacyForm = legacyForm(this.detailsNgForm);

  columns = 1;
  columnIndexes: number[] = [0];
  pageSize = 10;
  /** Rows of `columns` items, as the virtual scroll renders them. */
  rows: any[][] = [];
  topIndex = 0;
  itemHeight = 199;

  items: any;
  detailsConfig: any = { isDetailsOpen: false, isDetailsEditMode: false, currentItem: null, editingItem: null };
  parentCtl: any;
  actionsList: GridAction[] = [];
  groupActionsList: GridAction[] = [];
  addItemAction: any;
  addItemActions: GridAction[] = [];
  addItemActionsOpen = false;

  fetchItemsFunc!: (pageLink: any, entitySubtype?: any) => Promise<any> | null;
  loadItemDetailsFunc!: (item: any) => Promise<any>;
  saveItemFunc!: (item: any) => Promise<any>;
  deleteItemFunc!: (id: any) => Promise<any>;
  clickItemFunc!: ($event: any, item: any) => void;
  getItemTitleFunc!: (item: any) => any;
  refreshParamsFunc!: () => any;
  deleteItemTitleFunc!: (item?: any) => any;
  deleteItemContentFunc!: (item?: any) => any;
  deleteItemsTitleFunc!: (selectedCount?: any) => any;
  deleteItemsActionTitleFunc!: (selectedCount?: any) => any;
  deleteItemsContentFunc!: () => any;
  addItemText!: () => any;
  noItemsText!: () => any;
  itemDetailsText!: (item?: any) => any;
  isDetailsReadOnly!: (item?: any) => any;
  isSelectionEnabled!: (item?: any) => any;
  onGridInited!: (grid: TbGridDirective) => void;

  constructor() {
    if (this.breakpoints.isMatched(MEDIA.md)) {
      this.columns = 2;
    } else if (this.breakpoints.isMatched(MEDIA.lg)) {
      this.columns = 3;
    } else if (this.breakpoints.isMatched(MEDIA.gtLg)) {
      this.columns = 4;
    }
    this.columnIndexes = this.range(this.columns);
    this.pageSize = 10 * this.columns;
    const offSearch = this.rootScope.$on('searchTextUpdated', () => this.reload());
    const offSubtype = this.rootScope.$on('searchEntitySubtypeUpdated', () => this.reload());
    this.destroyRef.onDestroy(() => {
      offSearch();
      offSubtype();
    });
  }

  ngOnInit(): void {
    this.initGridConfiguration();
    this.onGridInited(this);
    this.breakpoints
      .observe(Object.values(MEDIA))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        if (state.breakpoints[MEDIA.sm]) {
          this.columnsUpdated(1);
        } else if (state.breakpoints[MEDIA.md]) {
          this.columnsUpdated(2);
        } else if (state.breakpoints[MEDIA.lg]) {
          this.columnsUpdated(3);
        } else if (state.breakpoints[MEDIA.gtLg]) {
          this.columnsUpdated(4);
        }
      });
    if (this.items.data.length) {
      this.rebuildRows();
    }
    this.fetchMoreItems();
  }

  ngAfterViewInit(): void {
    this.viewport()
      ?.renderedRangeStream.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.fetchIfNeeded());
    if (this.topIndex > 0) {
      setTimeout(() => this.moveToIndex(this.topIndex));
    }
  }

  get searchConfig(): any {
    return this.rootScope.searchConfig ?? {};
  }

  private initGridConfiguration(): void {
    const config = this.config() ?? {};
    const t = (key: string, params?: any) => this.translate.instant(key, params);

    this.itemHeight = config.itemHeight || 199;
    this.refreshParamsFunc = config.refreshParamsFunc || (() => ({ topIndex: this.topIndex }));
    this.deleteItemTitleFunc = config.deleteItemTitleFunc || (() => t('grid.delete-item-title'));
    this.deleteItemContentFunc = config.deleteItemContentFunc || (() => t('grid.delete-item-text'));
    this.deleteItemsTitleFunc = config.deleteItemsTitleFunc || (() => t('grid.delete-items-title', { count: this.items.selectedCount }));
    this.deleteItemsActionTitleFunc = config.deleteItemsActionTitleFunc || ((selectedCount?: any) => t('grid.delete-items-action-title', { count: selectedCount }));
    this.deleteItemsContentFunc = config.deleteItemsContentFunc || (() => t('grid.delete-items-text'));
    this.fetchItemsFunc = config.fetchItemsFunc || (() => Promise.resolve([]));
    this.loadItemDetailsFunc = config.loadItemDetailsFunc || ((item: any) => Promise.resolve(item));
    this.saveItemFunc = config.saveItemFunc || ((item: any) => Promise.resolve(item));
    this.deleteItemFunc = config.deleteItemFunc || (() => Promise.resolve());
    this.clickItemFunc = config.clickItemFunc || (($event: any, item: any) => this.openItem($event, item));
    this.parentCtl = config.parentCtl || this;
    this.getItemTitleFunc = config.getItemTitleFunc || (() => '');

    this.actionsList = config.actionsList || [];
    for (const action of this.actionsList) {
      action.isEnabled = action.isEnabled || (() => true);
    }
    this.groupActionsList = config.groupActionsList || [
      {
        onAction: ($event: any) => this.deleteItems($event),
        name: () => t('action.delete'),
        details: this.deleteItemsActionTitleFunc,
        icon: 'delete',
      },
    ];

    this.addItemText = config.addItemText || (() => t('grid.add-item-text'));
    this.addItemAction = config.addItemAction || {
      onAction: ($event: any) => this.addItem($event),
      name: () => t('action.add'),
      details: () => this.addItemText(),
      icon: 'add',
    };
    this.addItemActionsOpen = false;
    this.addItemActions = config.addItemActions || [];
    this.onGridInited = config.onGridInited || (() => undefined);
    this.noItemsText = config.noItemsText || (() => t('grid.no-items-text'));
    this.itemDetailsText = config.itemDetailsText || (() => t('grid.item-details'));
    this.isDetailsReadOnly = config.isDetailsReadOnly || (() => false);
    this.isSelectionEnabled = config.isSelectionEnabled || (() => true);
    this.topIndex = Number(config.topIndex) || 0;

    this.items = config.items || {
      data: [],
      rowData: [],
      nextPageLink: {
        limit: this.topIndex + this.pageSize,
        textSearch: this.searchConfig.searchText,
      },
      selections: {},
      selectedCount: 0,
      hasNext: true,
      pending: false,
    };
    this.detailsConfig = { isDetailsOpen: false, isDetailsEditMode: false, currentItem: null, editingItem: null };
  }

  private range(count: number): number[] {
    return Array.from({ length: count }, (_v, i) => i);
  }

  /** Lays `items.data` out in rows of `columns` (a new array, so the virtual scroll sees it). */
  private rebuildRows(): void {
    const rows: any[][] = [];
    this.items.data.forEach((item: any, i: number) => {
      item.index = i;
      const row = Math.floor(i / this.columns);
      (rows[row] ??= []).push(item);
    });
    this.items.rowData = rows;
    this.rows = rows;
    setTimeout(() => {
      this.viewport()?.checkViewportSize();
      this.fetchIfNeeded();
    });
  }

  /** Loads the next page when the rendered rows reach the end of what is loaded. */
  private fetchIfNeeded(): void {
    const viewport = this.viewport();
    if (!viewport || !this.items) {
      return;
    }
    const range = viewport.getRenderedRange();
    if (range.end >= this.rows.length - 1) {
      this.fetchMoreItems();
    }
  }

  fetchMoreItems(): void {
    if (!this.items.hasNext || this.items.pending) {
      return;
    }
    const promise = this.fetchItemsFunc(this.items.nextPageLink, this.searchConfig.searchEntitySubtype);
    if (!promise) {
      this.items.hasNext = false;
      return;
    }
    this.items.pending = true;
    promise.then(
      (items: any) => {
        if (this.items.reloadPending) {
          this.items.pending = false;
          this.reload();
          return;
        }
        this.items.data = this.items.data.concat(items.data);
        this.items.nextPageLink = items.nextPageLink;
        this.items.hasNext = items.hasNext;
        if (this.items.hasNext) {
          this.items.nextPageLink.limit = this.pageSize;
        }
        this.items.pending = false;
        this.rebuildRows();
        if (this.items.loadCallback) {
          this.items.loadCallback();
          this.items.loadCallback = null;
        }
      },
      () => {
        this.items.hasNext = false;
        this.items.pending = false;
      },
    );
  }

  onScrolledIndexChange(index: number): void {
    this.topIndex = index;
    this.fetchIfNeeded();
  }

  columnsUpdated(newColumns: number): void {
    if (this.columns === newColumns) {
      return;
    }
    const newTopIndex = Math.ceil((this.columns * this.topIndex) / newColumns);
    this.pageSize = 10 * newColumns;
    if (this.items.nextPageLink) {
      this.items.nextPageLink.limit = this.pageSize;
    }
    this.columns = newColumns;
    this.columnIndexes = this.range(newColumns);
    this.topIndex = newTopIndex;
    this.rebuildRows();
    setTimeout(() => this.moveToIndex(newTopIndex), 500);
  }

  private resetItems(limit: number): void {
    this.items.data.length = 0;
    this.items.rowData.length = 0;
    this.rows = [];
    this.items.nextPageLink = { limit, textSearch: this.searchConfig.searchText };
    this.items.selections = {};
    this.items.selectedCount = 0;
    this.items.hasNext = true;
    this.items.pending = false;
    this.detailsConfig.isDetailsOpen = false;
    this.items.reloadPending = false;
  }

  reload(): void {
    if (this.items && this.items.pending) {
      this.items.reloadPending = true;
    } else {
      this.resetItems(this.pageSize);
      this.fetchMoreItems();
    }
  }

  refreshList = (): void => {
    const preservedTopIndex = this.topIndex;
    this.resetItems(preservedTopIndex + this.pageSize);
    this.items.loadCallback = () => {
      setTimeout(() => this.moveToIndex(preservedTopIndex));
    };
    this.fetchMoreItems();
  };

  addItem = ($event?: any): void => {
    const component = this.addItemComponent();
    if (!component) {
      return;
    }
    const data: AddItemDialogData = { saveItemFunction: this.saveItemFunc, parentCtl: this.parentCtl };
    firstValueFrom(this.dialog.open(component, { data, autoFocus: false, restoreFocus: !!$event }).afterClosed()).then((saved) => {
      if (saved !== undefined) {
        this.refreshList();
      }
    });
  };

  openItem = ($event: any, item: any): void => {
    $event?.stopPropagation();
    if (this.detailsConfig.currentItem != null && this.detailsConfig.currentItem.id.id === item.id.id) {
      if (this.detailsConfig.isDetailsOpen) {
        this.detailsConfig.isDetailsOpen = false;
        return;
      }
    }
    this.loadItemDetailsFunc(item).then((detailsItem: any) => {
      detailsItem.index = item.index;
      this.detailsConfig.currentItem = detailsItem;
      this.detailsConfig.isDetailsEditMode = false;
      this.detailsConfig.isDetailsOpen = true;
    });
  };

  isCurrentItem = (item: any): boolean => {
    if (item != null && this.detailsConfig.currentItem != null && this.detailsConfig.currentItem.id.id === item.id.id) {
      return this.detailsConfig.isDetailsOpen;
    }
    return false;
  };

  onToggleDetailsEditMode = (theForm: LegacyForm): void => {
    if (!this.detailsConfig.isDetailsEditMode) {
      theForm.$setPristine();
    }
  };

  onCloseDetails = (): void => {
    this.detailsConfig.currentItem = null;
  };

  /** The item the details show: the current one, or its editable copy in edit mode. */
  operatingItem = (): any => {
    if (!this.detailsConfig.isDetailsEditMode) {
      if (this.detailsConfig.editingItem) {
        this.detailsConfig.editingItem = null;
      }
      return this.detailsConfig.currentItem;
    }
    if (!this.detailsConfig.editingItem) {
      this.detailsConfig.editingItem = structuredClone(this.detailsConfig.currentItem);
    }
    return this.detailsConfig.editingItem;
  };

  saveItem = (theForm: LegacyForm): void => {
    this.saveItemFunc(this.detailsConfig.editingItem).then(
      (item: any) => {
        theForm.$setPristine();
        this.detailsConfig.isDetailsEditMode = false;
        const index = this.detailsConfig.currentItem.index;
        item.index = index;
        this.detailsConfig.currentItem = item;
        this.items.data[index] = item;
        this.rebuildRows();
      },
      () => undefined,
    );
  };

  deleteItem = ($event: any, item: any): void => {
    $event?.stopPropagation?.();
    showConfirm(this.dialog, {
      title: this.deleteItemTitleFunc(item),
      htmlContent: this.deleteItemContentFunc(item),
      cancel: this.translate.instant('action.no'),
      ok: this.translate.instant('action.yes'),
    }).then(
      () => {
        this.deleteItemFunc(item.id.id).then(() => this.refreshList());
      },
      () => undefined,
    );
  };

  deleteItems = (_$event?: any): void => {
    showConfirm(this.dialog, {
      title: this.deleteItemsTitleFunc(this.items.selectedCount),
      htmlContent: this.deleteItemsContentFunc(),
      cancel: this.translate.instant('action.no'),
      ok: this.translate.instant('action.yes'),
    }).then(
      () => {
        const tasks = Object.keys(this.items.selections).map((id) => this.deleteItemFunc(id));
        Promise.all(tasks).then(() => this.refreshList());
      },
      () => undefined,
    );
  };

  toggleItemSelection = ($event: any, item: any): void => {
    $event?.stopPropagation?.();
    const selected = item.selected !== undefined && item.selected;
    item.selected = !selected;
    if (item.selected) {
      this.items.selections[item.id.id] = true;
      this.items.selectedCount++;
    } else {
      delete this.items.selections[item.id.id];
      this.items.selectedCount--;
    }
  };

  triggerResize = (): void => {
    window.dispatchEvent(new Event('resize'));
  };

  isTenantAdmin = (): boolean => {
    return this.userService.getAuthority() == 'TENANT_ADMIN';
  };

  moveToTop = (): void => {
    this.moveToIndex(0, true);
  };

  moveToIndex(index: number, animate?: boolean): void {
    const viewport = this.viewport();
    if (!viewport) {
      return;
    }
    let stopY = index * this.itemHeight;
    if (stopY > 0) {
      stopY += 16;
    }
    viewport.scrollToOffset(stopY, animate ? 'smooth' : 'auto');
  }

  noData = (): boolean => {
    return this.items.data.length == 0 && !this.items.hasNext;
  };

  hasData = (): boolean => {
    return this.items.data.length > 0;
  };

  trackRow = (index: number): number => index;
}
