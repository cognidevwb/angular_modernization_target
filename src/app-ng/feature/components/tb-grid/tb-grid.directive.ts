import { Component, forwardRef, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TbScopeElementDirective } from '../tb-scope-element/tb-scope-element.directive';
import { TbGridCardContentDirective } from '../tb-grid-card-content/tb-grid-card-content.directive';
import { TbDetailsSidenavDirective } from '../tb-details-sidenav/tb-details-sidenav.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { RangePipe } from '../pipes/range.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function GridController(this: any, $scope?: any, $state?: any, $mdDialog?: any, $document?: any, $q?: any, $mdUtil?: any, $timeout?: any, $translate?: any, $mdMedia?: any, $templateCache?: any, $window?: any, userService?: any) {

    var vm: any = this;

    var columns: any = 1;
    if ($mdMedia('md')) {
        columns = 2;
    } else if ($mdMedia('lg')) {
        columns = 3;
    } else if ($mdMedia('gt-lg')) {
        columns = 4;
    }

    var pageSize: any = 10 * columns;

    vm.columns = columns;

    vm.addItem = addItem;
    vm.deleteItem = deleteItem;
    vm.deleteItems = deleteItems;
    vm.hasData = hasData;
    vm.isCurrentItem = isCurrentItem;
    vm.moveToTop = moveToTop;
    vm.noData = noData;
    vm.onCloseDetails = onCloseDetails;
    vm.onToggleDetailsEditMode = onToggleDetailsEditMode;
    vm.openItem = openItem;
    vm.operatingItem = operatingItem;
    vm.refreshList = refreshList;
    vm.saveItem = saveItem;
    vm.toggleItemSelection = toggleItemSelection;
    vm.triggerResize = triggerResize;
    vm.isTenantAdmin = isTenantAdmin;

    $scope.$watch(function () {
        return $mdMedia('xs') || $mdMedia('sm');
    }, function (sm?: any) {
        if (sm) {
            columnsUpdated(1);
        }
    });
    $scope.$watch(function () {
        return $mdMedia('md');
    }, function (md?: any) {
        if (md) {
            columnsUpdated(2);
        }
    });
    $scope.$watch(function () {
        return $mdMedia('lg');
    }, function (lg?: any) {
        if (lg) {
            columnsUpdated(3);
        }
    });
    $scope.$watch(function () {
        return $mdMedia('gt-lg');
    }, function (gtLg?: any) {
        if (gtLg) {
            columnsUpdated(4);
        }
    });

    initGridConfiguration();

    vm.itemRows = {
        getItemAtIndex: function (index?: any) {
            if (index >= vm.items.rowData.length) {
                vm.itemRows.fetchMoreItems_(index);
                return null;
            }
            return vm.items.rowData[index];
        },

        getLength: function () {
            if (vm.items.hasNext && !vm.items.pending) {
                return vm.items.rowData.length + pageSize;
            } else {
                return vm.items.rowData.length;
            }
            return undefined;
        },

        fetchMoreItems_: function () {
            if (vm.items.hasNext && !vm.items.pending) {
                var promise: any = vm.fetchItemsFunc(vm.items.nextPageLink, $scope.searchConfig.searchEntitySubtype);
                if (promise) {
                    vm.items.pending = true;
                    promise.then(
                        function success(items?: any) {
                            if (vm.items.reloadPending) {
                                vm.items.pending = false;
                                reload();
                            } else {
                                vm.items.data = vm.items.data.concat(items.data);
                                var startIndex: any = vm.items.data.length - items.data.length;
                                var endIndex: any = vm.items.data.length;
                                for (var i: any = startIndex; i < endIndex; i++) {
                                    var item: any = vm.items.data[i];
                                    item.index = i;
                                    var row: any = Math.floor(i / vm.columns);
                                    var itemRow: any = vm.items.rowData[row];
                                    if (!itemRow) {
                                        itemRow = [];
                                        vm.items.rowData.push(itemRow);
                                    }
                                    itemRow.push(item);
                                }
                                vm.items.nextPageLink = items.nextPageLink;
                                vm.items.hasNext = items.hasNext;
                                if (vm.items.hasNext) {
                                    vm.items.nextPageLink.limit = pageSize;
                                }
                                vm.items.pending = false;
                                if (vm.items.loadCallback) {
                                    vm.items.loadCallback();
                                    vm.items.loadCallback = null;
                                }
                            }
                        },
                        function fail() {
                            vm.items.hasNext = false;
                            vm.items.pending = false;
                        });
                } else {
                    vm.items.hasNext = false;
                }
            }
        }
    };

    function columnsUpdated(newColumns?: any) {
        if (vm.columns !== newColumns) {
            var newTopIndex: any = Math.ceil(vm.columns * vm.topIndex / newColumns);
            pageSize = 10 * newColumns;
            vm.items.rowData = [];
            if (vm.items.nextPageLink) {
                vm.items.nextPageLink.limit = pageSize;
            }

            for (var i: any = 0; i < vm.items.data.length; i++) {
                var item: any = vm.items.data[i];
                var row: any = Math.floor(i / newColumns);
                var itemRow: any = vm.items.rowData[row];
                if (!itemRow) {
                    itemRow = [];
                    vm.items.rowData.push(itemRow);
                }
                itemRow.push(item);
            }

            vm.columns = newColumns;
            vm.topIndex = newTopIndex;
            vm.itemRows.getItemAtIndex(newTopIndex+pageSize);
            $timeout(function() {
                moveToIndex(newTopIndex);
            }, 500);
        }
    }

    function initGridConfiguration() {
        vm.gridConfiguration = vm.gridConfiguration || function () {
                return {};
            };

        vm.config = vm.gridConfiguration();

        vm.itemHeight = vm.config.itemHeight || 199;

        vm.refreshParamsFunc = vm.config.refreshParamsFunc || function () {
                return {"topIndex": vm.topIndex};
            };

        vm.deleteItemTitleFunc = vm.config.deleteItemTitleFunc || function () {
                return $translate.instant('grid.delete-item-title');
            };

        vm.deleteItemContentFunc = vm.config.deleteItemContentFunc || function () {
                return $translate.instant('grid.delete-item-text');
            };

        vm.deleteItemsTitleFunc = vm.config.deleteItemsTitleFunc || function () {
                return $translate.instant('grid.delete-items-title', {count: vm.items.selectedCount}, 'messageformat');
            };

        vm.deleteItemsActionTitleFunc = vm.config.deleteItemsActionTitleFunc || function (selectedCount?: any) {
                return $translate.instant('grid.delete-items-action-title', {count: selectedCount}, 'messageformat');
            };

        vm.deleteItemsContentFunc = vm.config.deleteItemsContentFunc || function () {
                return $translate.instant('grid.delete-items-text');
            };

        vm.fetchItemsFunc = vm.config.fetchItemsFunc || function () {
                return $q.when([]);
            };

        vm.loadItemDetailsFunc = vm.config.loadItemDetailsFunc || function (item?: any) {
                return $q.when(item);
            };

        vm.saveItemFunc = vm.config.saveItemFunc || function (item?: any) {
                return $q.when(item);
            };

        vm.deleteItemFunc = vm.config.deleteItemFunc || function () {
                return $q.when();
            };

        vm.clickItemFunc = vm.config.clickItemFunc || function ($event?: any, item?: any) {
                vm.openItem($event, item);
            };

        vm.itemCardTemplate = '<span></span>';
        if (vm.config.itemCardTemplate) {
            vm.itemCardTemplate = vm.config.itemCardTemplate;
        } else if (vm.config.itemCardTemplateUrl) {
            vm.itemCardTemplate = $templateCache.get(vm.config.itemCardTemplateUrl);
        }
        if (vm.config.itemCardController) {
            vm.itemCardController =  vm.config.itemCardController;
        } else {
            vm.itemCardController = 'ItemCardController';
        }
        if (vm.config.addItemController) {
            vm.addItemController =  vm.config.addItemController;
        } else {
            vm.addItemController = 'AddItemController';
        }

        vm.parentCtl = vm.config.parentCtl || vm;

        vm.getItemTitleFunc = vm.config.getItemTitleFunc || function () {
                return '';
            };

        vm.actionsList = vm.config.actionsList || [];

        for (var i: any = 0; i < vm.actionsList.length; i++) {
            var action: any = vm.actionsList[i];
            action.isEnabled = action.isEnabled || function() {
                    return true;
                };
        }

        vm.groupActionsList = vm.config.groupActionsList || [
                {
                    onAction: function ($event?: any) {
                        deleteItems($event);
                    },
                    name: function() { return $translate.instant('action.delete') },
                    details: vm.deleteItemsActionTitleFunc,
                    icon: "delete"
                }
            ];

        vm.addItemText = vm.config.addItemText || function () {
                return $translate.instant('grid.add-item-text');
            };

        vm.addItemAction = vm.config.addItemAction || {
                onAction: function ($event?: any) {
                    addItem($event);
                },
                name: function() { return $translate.instant('action.add') },
                details: function() { return vm.addItemText() },
                icon: "add"
            };

        vm.addItemActionsOpen = false;

        vm.addItemActions = vm.config.addItemActions || [];

        vm.onGridInited = vm.config.onGridInited || function () {
            };

        vm.addItemTemplateUrl = vm.config.addItemTemplateUrl;

        vm.noItemsText = vm.config.noItemsText || function () {
                return $translate.instant('grid.no-items-text');
            };

        vm.itemDetailsText = vm.config.itemDetailsText || function () {
                return $translate.instant('grid.item-details');
            };

        vm.isDetailsReadOnly = vm.config.isDetailsReadOnly || function () {
                return false;
            };

        vm.isSelectionEnabled = vm.config.isSelectionEnabled || function () {
                return true;
            };

        vm.topIndex = vm.config.topIndex || 0;

        vm.items = vm.config.items || {
                data: [],
                rowData: [],
                nextPageLink: {
                    limit: vm.topIndex + pageSize,
                    textSearch: $scope.searchConfig.searchText
                },
                selections: {},
                selectedCount: 0,
                hasNext: true,
                pending: false
            };

        vm.detailsConfig = {
            isDetailsOpen: false,
            isDetailsEditMode: false,
            currentItem: null,
            editingItem: null
        };
    }

    $scope.$on('searchTextUpdated', function () {
        reload();
    });

    $scope.$on('searchEntitySubtypeUpdated', function () {
        reload();
    });

    vm.onGridInited(vm);

    vm.itemRows.getItemAtIndex(pageSize);

    function reload() {
        if (vm.items && vm.items.pending) {
            vm.items.reloadPending = true;
        } else {
            vm.items.data.length = 0;
            vm.items.rowData.length = 0;
            vm.items.nextPageLink = {
                limit: pageSize,
                textSearch: $scope.searchConfig.searchText
            };
            vm.items.selections = {};
            vm.items.selectedCount = 0;
            vm.items.hasNext = true;
            vm.items.pending = false;
            vm.detailsConfig.isDetailsOpen = false;
            vm.items.reloadPending = false;
            vm.itemRows.getItemAtIndex(pageSize);
        }
    }

    function refreshList() {
        let preservedTopIndex: any = vm.topIndex;
        vm.items.data.length = 0;
        vm.items.rowData.length = 0;
        vm.items.nextPageLink = {
            limit: preservedTopIndex + pageSize,
            textSearch: $scope.searchConfig.searchText
        };
        vm.items.selections = {};
        vm.items.selectedCount = 0;
        vm.items.hasNext = true;
        vm.items.pending = false;
        vm.detailsConfig.isDetailsOpen = false;
        vm.items.reloadPending = false;
        vm.items.loadCallback = () => {
            $mdUtil.nextTick(() => {
                moveToIndex(preservedTopIndex);
            });
        };
        vm.itemRows.getItemAtIndex(preservedTopIndex+pageSize);
    }

    function addItem($event?: any) {
        $mdDialog.show({
            controller: vm.addItemController,
            controllerAs: 'vm',
            templateUrl: vm.addItemTemplateUrl,
            parent: (window as any).angular.element($document[0].body),
            locals: {saveItemFunction: vm.saveItemFunc},
            fullscreen: true,
            targetEvent: $event
        }).then(function () {
            refreshList();
        }, function () {
        });
    }

    function openItem($event?: any, item?: any) {
        $event.stopPropagation();
        if (vm.detailsConfig.currentItem != null && vm.detailsConfig.currentItem.id.id === item.id.id) {
            if (vm.detailsConfig.isDetailsOpen) {
                vm.detailsConfig.isDetailsOpen = false;
                return;
            }
        }
        vm.loadItemDetailsFunc(item).then(function success(detailsItem?: any) {
            detailsItem.index = item.index;
            vm.detailsConfig.currentItem = detailsItem;
            vm.detailsConfig.isDetailsEditMode = false;
            vm.detailsConfig.isDetailsOpen = true;
        });
    }

    function isCurrentItem(item?: any) {
        if (item != null && vm.detailsConfig.currentItem != null &&
            vm.detailsConfig.currentItem.id.id === item.id.id) {
            return vm.detailsConfig.isDetailsOpen;
        } else {
            return false;
        }
        return undefined;
    }

    function onToggleDetailsEditMode(theForm?: any) {
        if (!vm.detailsConfig.isDetailsEditMode) {
            theForm.$setPristine();
        }
    }

    function onCloseDetails() {
        vm.detailsConfig.currentItem = null;
    }

    function operatingItem() {
        if (!vm.detailsConfig.isDetailsEditMode) {
            if (vm.detailsConfig.editingItem) {
                vm.detailsConfig.editingItem = null;
            }
            return vm.detailsConfig.currentItem;
        } else {
            if (!vm.detailsConfig.editingItem) {
                vm.detailsConfig.editingItem = (window as any).angular.copy(vm.detailsConfig.currentItem);
            }
            return vm.detailsConfig.editingItem;
        }
        return undefined;
    }

    function saveItem(theForm?: any) {
        vm.saveItemFunc(vm.detailsConfig.editingItem).then(function success(item?: any) {
            theForm.$setPristine();
            vm.detailsConfig.isDetailsEditMode = false;
            var index: any = vm.detailsConfig.currentItem.index;
            item.index = index;
            vm.detailsConfig.currentItem = item;
            vm.items.data[index] = item;
            var row: any = Math.floor(index / vm.columns);
            var itemRow: any = vm.items.rowData[row];
            var column: any = index % vm.columns;
            itemRow[column] = item;
        });
    }

    function deleteItem($event?: any, item?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var confirm: any = $mdDialog.confirm()
            .targetEvent($event)
            .title(vm.deleteItemTitleFunc(item))
            .htmlContent(vm.deleteItemContentFunc(item))
            .ariaLabel($translate.instant('grid.delete-item'))
            .cancel($translate.instant('action.no'))
            .ok($translate.instant('action.yes'));
        $mdDialog.show(confirm).then(function () {
                vm.deleteItemFunc(item.id.id).then(function success() {
                    refreshList();
                });
            },
            function () {
            });

    }

    function deleteItems($event?: any) {
        var confirm: any = $mdDialog.confirm()
            .targetEvent($event)
            .title(vm.deleteItemsTitleFunc(vm.items.selectedCount))
            .htmlContent(vm.deleteItemsContentFunc())
            .ariaLabel($translate.instant('grid.delete-items'))
            .cancel($translate.instant('action.no'))
            .ok($translate.instant('action.yes'));
        $mdDialog.show(confirm).then(function () {
                var tasks: any = [];
                for (var id in vm.items.selections) {
                    tasks.push(vm.deleteItemFunc(id));
                }
                $q.all(tasks).then(function () {
                    refreshList();
                });
            },
            function () {
            });
    }


    function toggleItemSelection($event?: any, item?: any) {
        $event.stopPropagation();
        var selected: any = (window as any).angular.isDefined(item.selected) && item.selected;
        item.selected = !selected;
        if (item.selected) {
            vm.items.selections[item.id.id] = true;
            vm.items.selectedCount++;
        } else {
            delete vm.items.selections[item.id.id];
            vm.items.selectedCount--;
        }
    }

    function triggerResize() {
        var w: any = (window as any).angular.element($window);
        w.triggerHandler('resize');
    }

    function isTenantAdmin() {
        return userService.getAuthority() == 'TENANT_ADMIN';
    }

    function moveToTop() {
        moveToIndex(0, true);
    }

    function moveToIndex(index?: any, animate?: any) {
        var repeatContainer: any = $scope.repeatContainer[0];
        var scrollElement: any = repeatContainer.children[0];
        var startY: any = scrollElement.scrollTop;
        var stopY: any = index * vm.itemHeight;
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
            $timeout(function (topY?: any) {
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

    function noData() {
        return vm.items.data.length == 0 && !vm.items.hasNext;
    }

    function hasData() {
        return vm.items.data.length > 0;
    }

}

function AddItemController(this: any, $scope?: any, $mdDialog?: any, saveItemFunction?: any, helpLinks?: any) {

    var vm: any = this;

    vm.helpLinks = helpLinks;
    vm.item = {};

    vm.add = add;
    vm.cancel = cancel;

    function cancel() {
        $mdDialog.cancel();
    }

    function add() {
        saveItemFunction(vm.item).then(function success(item?: any) {
            vm.item = item;
            $scope.theForm.$setPristine();
            $mdDialog.hide();
        });
    }
}

function ItemCardController(this: any) {

    var vm: any = this; //eslint-disable-line

}

/**
 * Ported from the AngularJS directive `tbGrid` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
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

  // TODO(port): elements not resolved to a component: md-virtual-repeat-container, details-buttons, md-fab-speed-dial, md-fab-trigger, md-fab-actions
  // TODO(port): template: 1 × md-fab-actions left in place
  // TODO(port): template: 1 × md-fab-speed-dial left in place
  // TODO(port): template: 1 × md-fab-trigger left in place
  // TODO(port): template: 1 × md-virtual-repeat-container left in place
  // TODO(port): template: 1 × ng-transclude left in place

  restrict: any = "E";
  transclude: any = {
            detailsButtons: '?detailsButtons'
        };
  bindToController: any = {
            gridConfiguration: '&?'
        };
  controller: any = GridController;
  controllerAs: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
