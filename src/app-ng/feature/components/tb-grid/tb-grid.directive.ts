import { Component, forwardRef, inject, output } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { CommonModule } from '@angular/common';
import { TbScopeElementDirective } from '../tb-scope-element/tb-scope-element.directive';
import { TbGridCardContentDirective } from '../tb-grid-card-content/tb-grid-card-content.directive';
import { TbDetailsSidenavDirective } from '../tb-details-sidenav/tb-details-sidenav.directive';

import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { RangePipe } from '../pipes/range.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { $q, $timeout } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $mdUtil: any;
declare let $scope: any;
declare let $templateCache: any;
declare let $window: any;
declare let userService: any;

/**
 * Ported from the AngularJS directive `tbGrid` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 5 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-grid',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatIconModule, MatCheckboxModule, MatCardModule, MatButtonModule, RangePipe, CommonModule, forwardRef(() => TbScopeElementDirective), forwardRef(() => TbGridCardContentDirective), forwardRef(() => TbDetailsSidenavDirective)],
  templateUrl: './tb-grid.directive.html',
})
export class TbGridDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly gridConfiguration = output<any>();

  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly router = inject(Router);
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  // TODO(port): '$timeout' — use setTimeout, or an rxjs timer
  protected readonly translate = inject(TranslateService);
  protected readonly breakpoints = inject(BreakpointObserver);
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly userService = inject(UserService);
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container, details-buttons, md-fab-speed-dial, md-fab-trigger, md-fab-actions
  // TODO(port): template: 1 × md-fab-actions left in place
  // TODO(port): template: 1 × md-fab-speed-dial left in place
  // TODO(port): template: 1 × md-fab-trigger left in place
  // TODO(port): template: 1 × md-virtual-repeat-container left in place
  // TODO(port): template: 1 × ng-transclude left in place

  protected columns_local: any = 1;
  protected pageSize: any;
  columns: any;
  itemRows: any;
  actionsList: any;
  addItemAction: any;
  addItemActions: any;
  addItemActionsOpen: any;
  addItemController: any;
  addItemTemplateUrl: any;
  addItemText: any;
  clickItemFunc: any;
  config: any;
  deleteItemContentFunc: any;
  deleteItemFunc: any;
  deleteItemTitleFunc: any;
  deleteItemsActionTitleFunc: any;
  deleteItemsContentFunc: any;
  deleteItemsTitleFunc: any;
  detailsConfig: any;
  fetchItemsFunc: any;
  getItemTitleFunc: any;
  groupActionsList: any;
  isDetailsReadOnly: any;
  isSelectionEnabled: any;
  itemCardController: any;
  itemCardTemplate: any;
  itemDetailsText: any;
  itemHeight: any;
  items: any;
  loadItemDetailsFunc: any;
  noItemsText: any;
  onGridInited: any;
  parentCtl: any;
  refreshParamsFunc: any;
  repeatContainer: any;
  saveItemFunc: any;
  searchConfig: any;
  topIndex: any;

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): `vm.gridConfiguration(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): `vm.gridConfiguration` was an optional callback; an output is always there, so its check reads `true`
  // TODO(port): `columns` was both a local and a member the class exposes; the local is `columns_local`, the member stays `columns`

  constructor() {
    if (this.breakpoints('md')) {
        this.columns_local = 2;
    } else if (this.breakpoints('lg')) {
        this.columns_local = 3;
    } else if (this.breakpoints('gt-lg')) {
        this.columns_local = 4;
    }
    this.pageSize = 10 * this.columns_local;
    this.columns = this.columns_local;
    this.addItem = this.addItem;
    this.deleteItem = this.deleteItem;
    this.deleteItems = this.deleteItems;
    this.hasData = this.hasData;
    this.isCurrentItem = this.isCurrentItem;
    this.moveToTop = this.moveToTop;
    this.noData = this.noData;
    this.onCloseDetails = this.onCloseDetails;
    this.onToggleDetailsEditMode = this.onToggleDetailsEditMode;
    this.openItem = this.openItem;
    this.operatingItem = this.operatingItem;
    this.refreshList = this.refreshList;
    this.saveItem = this.saveItem;
    this.toggleItemSelection = this.toggleItemSelection;
    this.triggerResize = this.triggerResize;
    this.isTenantAdmin = this.isTenantAdmin;
    $scope.$watch(() => {
        return this.breakpoints('xs') || this.breakpoints('sm');
    }, (sm?: any) => {
        if (sm) {
            this.columnsUpdated(1);
        }
    });
    $scope.$watch(() => {
        return this.breakpoints('md');
    }, (md?: any) => {
        if (md) {
            this.columnsUpdated(2);
        }
    });
    $scope.$watch(() => {
        return this.breakpoints('lg');
    }, (lg?: any) => {
        if (lg) {
            this.columnsUpdated(3);
        }
    });
    $scope.$watch(() => {
        return this.breakpoints('gt-lg');
    }, (gtLg?: any) => {
        if (gtLg) {
            this.columnsUpdated(4);
        }
    });
    this.initGridConfiguration();
    this.itemRows = {
        getItemAtIndex: (index?: any, ...rest: any[]) => {
            if (index >= this.items.rowData.length) {
                this.itemRows.fetchMoreItems_(index);
                return null;
            }
            return this.items.rowData[index];
        },

        getLength: (...rest: any[]) => {
            if (this.items.hasNext && !this.items.pending) {
                return this.items.rowData.length + this.pageSize;
            } else {
                return this.items.rowData.length;
            }
            return undefined;
        },

        fetchMoreItems_: (...rest: any[]) => {
            if (this.items.hasNext && !this.items.pending) {
                var promise: any = this.fetchItemsFunc(this.items.nextPageLink, this.searchConfig.searchEntitySubtype);
                if (promise) {
                    this.items.pending = true;
                    promise.then(
                        (items?: any) => {
                            if (this.items.reloadPending) {
                                this.items.pending = false;
                                this.reload();
                            } else {
                                this.items.data = this.items.data.concat(items.data);
                                var startIndex: any = this.items.data.length - items.data.length;
                                var endIndex: any = this.items.data.length;
                                for (var i: any = startIndex; i < endIndex; i++) {
                                    var item: any = this.items.data[i];
                                    item.index = i;
                                    var row: any = Math.floor(i / this.columns);
                                    var itemRow: any = this.items.rowData[row];
                                    if (!itemRow) {
                                        itemRow = [];
                                        this.items.rowData.push(itemRow);
                                    }
                                    itemRow.push(item);
                                }
                                this.items.nextPageLink = items.nextPageLink;
                                this.items.hasNext = items.hasNext;
                                if (this.items.hasNext) {
                                    this.items.nextPageLink.limit = this.pageSize;
                                }
                                this.items.pending = false;
                                if (this.items.loadCallback) {
                                    this.items.loadCallback();
                                    this.items.loadCallback = null;
                                }
                            }
                        },
                        () => {
                            this.items.hasNext = false;
                            this.items.pending = false;
                        });
                } else {
                    this.items.hasNext = false;
                }
            }
        }
    };
    $scope.$on('searchTextUpdated', () => {
        this.reload();
    });
    $scope.$on('searchEntitySubtypeUpdated', () => {
        this.reload();
    });
    this.onGridInited(this);
    this.itemRows.getItemAtIndex(this.pageSize);
  }

  columnsUpdated(newColumns?: any, ...rest: any[]): any {
    if (this.columns !== newColumns) {
        var newTopIndex: any = Math.ceil(this.columns * this.topIndex / newColumns);
        this.pageSize = 10 * newColumns;
        this.items.rowData = [];
        if (this.items.nextPageLink) {
            this.items.nextPageLink.limit = this.pageSize;
        }

        for (var i: any = 0; i < this.items.data.length; i++) {
            var item: any = this.items.data[i];
            var row: any = Math.floor(i / newColumns);
            var itemRow: any = this.items.rowData[row];
            if (!itemRow) {
                itemRow = [];
                this.items.rowData.push(itemRow);
            }
            itemRow.push(item);
        }

        this.columns = newColumns;
        this.topIndex = newTopIndex;
        this.itemRows.getItemAtIndex(newTopIndex+this.pageSize);
        setTimeout(() => {
            this.moveToIndex(newTopIndex);
        }, 500);
    }
  }

  initGridConfiguration(...rest: any[]): any {
    this.gridConfiguration = true || function () {
            return {};
        };

    this.config = this.gridConfiguration.emit(undefined);

    this.itemHeight = this.config.itemHeight || 199;

    this.refreshParamsFunc = this.config.refreshParamsFunc || (() => {
            return {"topIndex": this.topIndex};
        });

    this.deleteItemTitleFunc = this.config.deleteItemTitleFunc || (() => {
            return this.translate.instant('grid.delete-item-title');
        });

    this.deleteItemContentFunc = this.config.deleteItemContentFunc || (() => {
            return this.translate.instant('grid.delete-item-text');
        });

    this.deleteItemsTitleFunc = this.config.deleteItemsTitleFunc || (() => {
            return this.translate.instant('grid.delete-items-title', {count: this.items.selectedCount}, 'messageformat');
        });

    this.deleteItemsActionTitleFunc = this.config.deleteItemsActionTitleFunc || ((selectedCount?: any) => {
            return this.translate.instant('grid.delete-items-action-title', {count: selectedCount}, 'messageformat');
        });

    this.deleteItemsContentFunc = this.config.deleteItemsContentFunc || (() => {
            return this.translate.instant('grid.delete-items-text');
        });

    this.fetchItemsFunc = this.config.fetchItemsFunc || function () {
            return Promise.resolve([]);
        };

    this.loadItemDetailsFunc = this.config.loadItemDetailsFunc || function (item?: any) {
            return Promise.resolve(item);
        };

    this.saveItemFunc = this.config.saveItemFunc || function (item?: any) {
            return Promise.resolve(item);
        };

    this.deleteItemFunc = this.config.deleteItemFunc || function () {
            return Promise.resolve();
        };

    this.clickItemFunc = this.config.clickItemFunc || (($event?: any, item?: any) => {
            this.openItem($event, item);
        });

    this.itemCardTemplate = '<span></span>';
    if (this.config.itemCardTemplate) {
        this.itemCardTemplate = this.config.itemCardTemplate;
    } else if (this.config.itemCardTemplateUrl) {
        this.itemCardTemplate = $templateCache.get(this.config.itemCardTemplateUrl);
    }
    if (this.config.itemCardController) {
        this.itemCardController =  this.config.itemCardController;
    } else {
        this.itemCardController = 'ItemCardController';
    }
    if (this.config.addItemController) {
        this.addItemController =  this.config.addItemController;
    } else {
        this.addItemController = 'AddItemController';
    }

    this.parentCtl = this.config.parentCtl || this;

    this.getItemTitleFunc = this.config.getItemTitleFunc || function () {
            return '';
        };

    this.actionsList = this.config.actionsList || [];

    for (var i: any = 0; i < this.actionsList.length; i++) {
        var action: any = this.actionsList[i];
        action.isEnabled = action.isEnabled || function() {
                return true;
            };
    }

    this.groupActionsList = this.config.groupActionsList || [
            {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.deleteItems($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.delete') },
                details: this.deleteItemsActionTitleFunc,
                icon: "delete"
            }
        ];

    this.addItemText = this.config.addItemText || (() => {
            return this.translate.instant('grid.add-item-text');
        });

    this.addItemAction = this.config.addItemAction || {
            onAction: ($event?: any, ...rest: any[]) => {
                this.addItem($event);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.add') },
            details: (...rest: any[]) => { return this.addItemText() },
            icon: "add"
        };

    this.addItemActionsOpen = false;

    this.addItemActions = this.config.addItemActions || [];

    this.onGridInited = this.config.onGridInited || function () {
        };

    this.addItemTemplateUrl = this.config.addItemTemplateUrl;

    this.noItemsText = this.config.noItemsText || (() => {
            return this.translate.instant('grid.no-items-text');
        });

    this.itemDetailsText = this.config.itemDetailsText || (() => {
            return this.translate.instant('grid.item-details');
        });

    this.isDetailsReadOnly = this.config.isDetailsReadOnly || function () {
            return false;
        };

    this.isSelectionEnabled = this.config.isSelectionEnabled || function () {
            return true;
        };

    this.topIndex = this.config.topIndex || 0;

    this.items = this.config.items || {
            data: [],
            rowData: [],
            nextPageLink: {
                limit: this.topIndex + this.pageSize,
                textSearch: this.searchConfig.searchText
            },
            selections: {},
            selectedCount: 0,
            hasNext: true,
            pending: false
        };

    this.detailsConfig = {
        isDetailsOpen: false,
        isDetailsEditMode: false,
        currentItem: null,
        editingItem: null
    };
  }

  reload(...rest: any[]): any {
    if (this.items && this.items.pending) {
        this.items.reloadPending = true;
    } else {
        this.items.data.length = 0;
        this.items.rowData.length = 0;
        this.items.nextPageLink = {
            limit: this.pageSize,
            textSearch: this.searchConfig.searchText
        };
        this.items.selections = {};
        this.items.selectedCount = 0;
        this.items.hasNext = true;
        this.items.pending = false;
        this.detailsConfig.isDetailsOpen = false;
        this.items.reloadPending = false;
        this.itemRows.getItemAtIndex(this.pageSize);
    }
  }

  refreshList = (...rest: any[]): any => {
    let preservedTopIndex: any = this.topIndex;
    this.items.data.length = 0;
    this.items.rowData.length = 0;
    this.items.nextPageLink = {
        limit: preservedTopIndex + this.pageSize,
        textSearch: this.searchConfig.searchText
    };
    this.items.selections = {};
    this.items.selectedCount = 0;
    this.items.hasNext = true;
    this.items.pending = false;
    this.detailsConfig.isDetailsOpen = false;
    this.items.reloadPending = false;
    this.items.loadCallback = () => {
        $mdUtil.nextTick(() => {
            this.moveToIndex(preservedTopIndex);
        });
    };
    this.itemRows.getItemAtIndex(preservedTopIndex+this.pageSize);
  };

  addItem = ($event?: any, ...rest: any[]): any => {
    let vm = this;
    this.dialog.show({
        controller: this.addItemController,
        controllerAs: 'vm',
        templateUrl: this.addItemTemplateUrl,
        parent: $(this.document.body),
        locals: {saveItemFunction: this.saveItemFunc},
        fullscreen: true,
        targetEvent: $event
    }).then(() => {
        this.refreshList();
    }, function () {
    });
  };

  openItem = ($event?: any, item?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    if (this.detailsConfig.currentItem != null && this.detailsConfig.currentItem.id.id === item.id.id) {
        if (this.detailsConfig.isDetailsOpen) {
            this.detailsConfig.isDetailsOpen = false;
            return;
        }
    }
    this.loadItemDetailsFunc(item).then((detailsItem?: any) => {
        detailsItem.index = item.index;
        this.detailsConfig.currentItem = detailsItem;
        this.detailsConfig.isDetailsEditMode = false;
        this.detailsConfig.isDetailsOpen = true;
    });
  };

  isCurrentItem = (item?: any, ...rest: any[]): any => {
    if (item != null && this.detailsConfig.currentItem != null &&
        this.detailsConfig.currentItem.id.id === item.id.id) {
        return this.detailsConfig.isDetailsOpen;
    } else {
        return false;
    }
    return undefined;
  };

  onToggleDetailsEditMode = (theForm?: any, ...rest: any[]): any => {
    if (!this.detailsConfig.isDetailsEditMode) {
        theForm.$setPristine();
    }
  };

  onCloseDetails = (...rest: any[]): any => {
    this.detailsConfig.currentItem = null;
  };

  operatingItem = (...rest: any[]): any => {
    if (!this.detailsConfig.isDetailsEditMode) {
        if (this.detailsConfig.editingItem) {
            this.detailsConfig.editingItem = null;
        }
        return this.detailsConfig.currentItem;
    } else {
        if (!this.detailsConfig.editingItem) {
            this.detailsConfig.editingItem = structuredClone(this.detailsConfig.currentItem);
        }
        return this.detailsConfig.editingItem;
    }
    return undefined;
  };

  saveItem = (theForm?: any, ...rest: any[]): any => {
    this.saveItemFunc(this.detailsConfig.editingItem).then((item?: any) => {
        theForm.$setPristine();
        this.detailsConfig.isDetailsEditMode = false;
        var index: any = this.detailsConfig.currentItem.index;
        item.index = index;
        this.detailsConfig.currentItem = item;
        this.items.data[index] = item;
        var row: any = Math.floor(index / this.columns);
        var itemRow: any = this.items.rowData[row];
        var column: any = index % this.columns;
        itemRow[column] = item;
    });
  };

  deleteItem = ($event?: any, item?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(this.deleteItemTitleFunc(item))
        .htmlContent(this.deleteItemContentFunc(item))
        .ariaLabel(this.translate.instant('grid.delete-item'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
            this.deleteItemFunc(item.id.id).then(() => {
                this.refreshList();
            });
        },
        function () {
        });

  };

  deleteItems = ($event?: any, ...rest: any[]): any => {
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(this.deleteItemsTitleFunc(this.items.selectedCount))
        .htmlContent(this.deleteItemsContentFunc())
        .ariaLabel(this.translate.instant('grid.delete-items'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
            var tasks: any = [];
            for (var id in this.items.selections) {
                tasks.push(this.deleteItemFunc(id));
            }
            Promise.all(tasks).then(() => {
                this.refreshList();
            });
        },
        function () {
        });
  };

  toggleItemSelection = ($event?: any, item?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    var selected: any = (item.selected !== undefined) && item.selected;
    item.selected = !selected;
    if (item.selected) {
        this.items.selections[item.id.id] = true;
        this.items.selectedCount++;
    } else {
        delete this.items.selections[item.id.id];
        this.items.selectedCount--;
    }
  };

  triggerResize = (...rest: any[]): any => {
    var w: any = $($window);
    w.triggerHandler('resize');
  };

  isTenantAdmin = (...rest: any[]): any => {
    return this.userService.getAuthority() == 'TENANT_ADMIN';
  };

  moveToTop = (...rest: any[]): any => {
    this.moveToIndex(0, true);
  };

  moveToIndex(index?: any, animate?: any, ...rest: any[]): any {
    var repeatContainer: any = this.repeatContainer[0];
    var scrollElement: any = repeatContainer.children[0];
    var startY: any = scrollElement.scrollTop;
    var stopY: any = index * this.itemHeight;
    if (stopY > 0) {
        stopY+= 16;
    }
    var distance: any = Math.abs(startY - stopY);
    if (distance < 100 || !animate) {
        scrollElement.scrollTop = stopY;
        return;
    }
    var upElseDown: any = stopY < startY;
    var speed: any = Math.round(distance / 100);
    if (speed >= 20) speed = 20;
    var step: any = Math.round(distance / 25);

    var leapY: any = upElseDown ? startY - step : startY + step;
    var timer: any = 0;
    for (var i: any = startY; upElseDown ? (i > stopY) : (i < stopY); upElseDown ? (i -= step) : (i += step)) {
        setTimeout(function (topY?: any) {
            scrollElement.scrollTop = topY;
        }, timer * speed, true, leapY);
        if (upElseDown) {
            leapY -= step;
            if (leapY < stopY) {
                leapY = stopY;
            }
        } else {
            leapY += step;
            if (leapY > stopY) {
                leapY = stopY;
            }
        }
        timer++;
    }

  }

  noData = (...rest: any[]): any => {
    return this.items.data.length == 0 && !this.items.hasNext;
  };

  hasData = (...rest: any[]): any => {
    return this.items.data.length > 0;
  };
}
