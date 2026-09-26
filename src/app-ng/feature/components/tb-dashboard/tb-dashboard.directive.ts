import { Component, forwardRef, model, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbTimewindowDirective } from '../tb-timewindow/tb-timewindow.directive';
import { TbWidgetDirective } from '../tb-widget/tb-widget.directive';
// @ts-ignore
import dashboardTemplate from '../../../../app/components/dashboard.tpl.html';
import { KeyboardShortcutPipe } from '../pipes/keyboard-shortcut.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { isEqual } from 'lodash-es';
import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;
declare let dashboardEventService: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function DashboardController(this: any, $scope?: any, $rootScope?: any, $element?: any, $timeout?: any, $mdMedia?: any, $mdUtil?: any, $q?: any, timeService?: any, types?: any, utils?: any) {

    var highlightedMode: any = false;
    var highlightedWidget: any = null;
    var selectedWidget: any = null;

    var gridsterParent: any = $('#gridster-parent', $element);
    var gridsterElement: any = $('#gridster-child', gridsterParent);

    var vm: any = this;

    vm.gridster = null;

    vm.isMobileDisabled = vm.isMobileDisabled !== undefined ? vm.isMobileDisabled : false;

    vm.isMobileSize = false;

    if (!('dashboardTimewindow' in vm)) {
        vm.dashboardTimewindow = timeService.defaultTimewindow();
    }

    vm.dashboardLoading = true;
    vm.visibleRect = {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    };
    vm.gridsterOpts = {
        pushing: false,
        floating: false,
        swapping: false,
        maxRows: 100,
        columns: vm.columns ? vm.columns : 24,
        margins: vm.margins ? vm.margins : [10, 10],
        minSizeX: 1,
        minSizeY: 1,
        defaultSizeX: 8,
        defaultSizeY: 6,
        resizable: {
            enabled: vm.isEdit
        },
        draggable: {
            enabled: vm.isEdit
        },
        saveGridItemCalculatedHeightInMobile: true
    };

    updateMobileOpts();

    vm.widgetLayoutInfo = {
    };

    vm.widgetIds = [];

    vm.widgetItemMap = {
        sizeX: 'vm.widgetLayoutInfo[widget.id].sizeX',
        sizeY: 'vm.widgetLayoutInfo[widget.id].sizeY',
        row: 'vm.widgetLayoutInfo[widget.id].row',
        col: 'vm.widgetLayoutInfo[widget.id].col',
        minSizeY: 'widget.minSizeY',
        maxSizeY: 'widget.maxSizeY'
    };

    /*vm.widgetItemMap = {
        sizeX: 'vm.widgetSizeX(widget)',
        sizeY: 'vm.widgetSizeY(widget)',
        row: 'vm.widgetRow(widget)',
        col: 'vm.widgetCol(widget)',
        minSizeY: 'widget.minSizeY',
        maxSizeY: 'widget.maxSizeY'
    };*/

    vm.isWidgetExpanded = false;
    vm.isHighlighted = isHighlighted;
    vm.isNotHighlighted = isNotHighlighted;
    vm.selectWidget = selectWidget;
    vm.getSelectedWidget = getSelectedWidget;
    vm.highlightWidget = highlightWidget;
    vm.resetHighlight = resetHighlight;

    vm.onWidgetFullscreenChanged = onWidgetFullscreenChanged;

    vm.isAutofillHeight = autofillHeight;

    vm.widgetMouseDown = widgetMouseDown;
    vm.widgetClicked = widgetClicked;

    vm.widgetSizeX = widgetSizeX;
    vm.widgetSizeY = widgetSizeY;
    vm.widgetRow = widgetRow;
    vm.widgetCol = widgetCol;
    vm.widgetStyle = widgetStyle;
    vm.showWidgetTitle = showWidgetTitle;
    vm.showWidgetTitleIcon = showWidgetTitleIcon;
    vm.hasWidgetTitleTemplate = hasWidgetTitleTemplate;
    vm.widgetTitleTemplate = widgetTitleTemplate;
    vm.showWidgetTitlePanel = showWidgetTitlePanel;
    vm.showWidgetActions = showWidgetActions;
    vm.widgetTitleStyle = widgetTitleStyle;
    vm.widgetTitle = widgetTitle;
    vm.widgetTitleIcon = widgetTitleIcon;
    vm.widgetTitleIconStyle = widgetTitleIconStyle;
    vm.widgetTitleTooltip = widgetTitleTooltip;
    vm.customWidgetHeaderActions = customWidgetHeaderActions;
    vm.widgetActions = widgetActions;
    vm.dropWidgetShadow = dropWidgetShadow;
    vm.enableWidgetFullscreen = enableWidgetFullscreen;
    vm.hasTimewindow = hasTimewindow;
    vm.hasAggregation = hasAggregation;
    vm.editWidget = editWidget;
    vm.exportWidget = exportWidget;
    vm.removeWidget = removeWidget;
    vm.loading = loading;

    vm.openDashboardContextMenu = openDashboardContextMenu;
    vm.openWidgetContextMenu = openWidgetContextMenu;

    vm.getEventGridPosition = getEventGridPosition;
    vm.reload = reload;

    vm.contextMenuItems = [];
    vm.contextMenuEvent = null;

    vm.widgetContextMenuItems = [];
    vm.widgetContextMenuEvent = null;

    vm.dashboardTimewindowApi = {
        onResetTimewindow: function() {
            $timeout(function() {
                if (vm.originalDashboardTimewindow) {
                    vm.dashboardTimewindow = structuredClone(vm.originalDashboardTimewindow);
                    vm.originalDashboardTimewindow = null;
                }
            }, 0);
        },
        onUpdateTimewindow: function(startTimeMs?: any, endTimeMs?: any, interval?: any) {
            if (!vm.originalDashboardTimewindow) {
                vm.originalDashboardTimewindow = structuredClone(vm.dashboardTimewindow);
            }
            $timeout(function() {
                vm.dashboardTimewindow = timeService.toHistoryTimewindow(vm.dashboardTimewindow, startTimeMs, endTimeMs, interval);
            }, 0);
        },
    };

    // @ts-ignore
    addResizeListener(gridsterParent[0], onGridsterParentResize); // eslint-disable-line no-undef

    vm.ngOnDestroy = function () {
        // @ts-ignore
        removeResizeListener(gridsterParent[0], onGridsterParentResize); // eslint-disable-line no-undef
    };

    function onGridsterParentResize() {
        if (gridsterParent.height() && autofillHeight()) {
            updateMobileOpts();
        }
    }

    //TODO: widgets visibility
    /*gridsterParent.scroll(function () {
        updateVisibleRect();
    });

    gridsterParent.resize(function () {
        updateVisibleRect();
    });*/

    function updateMobileOpts() {
        var isMobileDisabled: any = vm.isMobileDisabled === true;
        var isMobile: any = vm.isMobile === true && !isMobileDisabled;
        var mobileBreakPoint: any = isMobileDisabled ? 0 : (isMobile ? 20000 : 960);

        if (!isMobile && !isMobileDisabled) {
            isMobile = !$mdMedia('gt-sm');
        }

        if (vm.gridsterOpts.isMobile != isMobile) {
            vm.gridsterOpts.isMobile = isMobile;
            vm.gridsterOpts.mobileModeEnabled = isMobile;
        }
        if (vm.gridsterOpts.mobileBreakPoint != mobileBreakPoint) {
            vm.gridsterOpts.mobileBreakPoint = mobileBreakPoint;
        }
        detectRowSize(isMobile).then(
            function(rowHeight?: any) {
                if (vm.gridsterOpts.rowHeight != rowHeight) {
                    vm.gridsterOpts.rowHeight = rowHeight;
                }
            }
        );
        vm.isMobileSize = checkIsMobileSize();
    }

    function checkIsMobileSize() {
        var isMobileDisabled: any = vm.isMobileDisabled === true;
        var isMobileSize: any = vm.isMobile === true && !isMobileDisabled;
        if (!isMobileSize && !isMobileDisabled) {
            isMobileSize = !$mdMedia('gt-sm');
        }
        return isMobileSize;
    }

    effect(() => {
        var columns: any = vm.columns ? vm.columns : 24;
        if (vm.gridsterOpts.columns != columns) {
            vm.gridsterOpts.columns = columns;
            if (vm.gridster) {
                vm.gridster.columns = vm.columns;
                updateGridsterParams();
            }
            //TODO: widgets visibility
            //updateVisibleRect();
        }
    });

    effect(() => {
        $mdMedia('gt-sm') + ',' + vm.isMobile + ',' + vm.isMobileDisabled;
        updateMobileOpts();
        sortWidgets();
    });

    effect(() => {
        vm.autofillHeight + ',' + vm.mobileAutofillHeight + ',' + vm.mobileRowHeight;
        updateMobileOpts();
    });

    effect(() => {
        var margins: any = vm.margins ? vm.margins : [10, 10];
        if (!isEqual(vm.gridsterOpts.margins, margins)) {
            vm.gridsterOpts.margins = margins;
            updateMobileOpts();
            if (vm.gridster) {
                vm.gridster.margins = vm.margins;
                updateGridsterParams();
            }
            //TODO: widgets visibility
            //updateVisibleRect();
        }
    });

    effect(() => {
        vm.gridsterOpts.resizable.enabled = vm.isEdit;
        vm.gridsterOpts.draggable.enabled = vm.isEdit;
        $scope.$broadcast('toggleDashboardEditMode', vm.isEdit);
    });

    effect(() => {
        var newVal = vm.isMobileSize;
        var prevVal = vm.prevIsMobileSize;
        if (!isEqual(newVal, prevVal)) {
            $scope.$broadcast('mobileModeChanged', vm.isMobileSize);
        }
        vm.prevIsMobileSize = newVal;
    });

    effect(() => {
        var ids: any = [];
        for (var i: any=0;i<vm.widgets.length;i++) {
            var widget: any = vm.widgets[i];
            if (!widget.id) {
                widget.id = utils.guid();
            }
            ids.push(widget.id);
        }
        ids.sort(function (id1?: any, id2?: any) {
            return id1.localeCompare(id2);
        });
        sortWidgets();
        if (isEqual(ids, vm.widgetIds)) {
            return;
        }
        vm.widgetIds = ids;
        for (i=0;i<vm.widgets.length;i++) {
            widget = vm.widgets[i];
            var layoutInfoObject: any = vm.widgetLayoutInfo[widget.id];
            if (!layoutInfoObject) {
                layoutInfoObject = {
                    widget: widget
                };
                Object.defineProperty(layoutInfoObject, 'sizeX', {
                    get: function(this: any) { return widgetSizeX(this.widget) },
                    set: function(this: any, newSizeX?: any) { setWidgetSizeX(this.widget, newSizeX)}
                });
                Object.defineProperty(layoutInfoObject, 'sizeY', {
                    get: function(this: any) { return widgetSizeY(this.widget) },
                    set: function(this: any, newSizeY?: any) { setWidgetSizeY(this.widget, newSizeY)}
                });
                Object.defineProperty(layoutInfoObject, 'row', {
                    get: function(this: any) { return widgetRow(this.widget) },
                    set: function(this: any, newRow?: any) { setWidgetRow(this.widget, newRow)}
                });
                Object.defineProperty(layoutInfoObject, 'col', {
                    get: function(this: any) { return widgetCol(this.widget) },
                    set: function(this: any, newCol?: any) { setWidgetCol(this.widget, newCol)}
                });
                vm.widgetLayoutInfo[widget.id] = layoutInfoObject;
            }
        }
        for (var widgetId in vm.widgetLayoutInfo) {
            if (ids.indexOf(widgetId) === -1) {
                delete vm.widgetLayoutInfo[widgetId];
            }
        }
        $mdUtil.nextTick(function () {
            if (autofillHeight()) {
                updateMobileOpts();
            }
        });
    });

    effect(() => {
        vm.widgetLayouts;
        updateMobileOpts();
        sortWidgets();
    });

    dashboardEventService.gridsterResized$.subscribe(function (sizes?: any, theGridster?: any) {
        if (checkIsLocalGridsterElement(theGridster)) {
            vm.gridster = theGridster;
            setupGridster(vm.gridster);
            vm.isResizing = false;
            //TODO: widgets visibility
            //updateVisibleRect(false, true);
        }
    });

    dashboardEventService.gridsterMobileChanged$.subscribe(function (theGridster?: any) {
        if (checkIsLocalGridsterElement(theGridster)) {
            vm.gridster = theGridster;
            setupGridster(vm.gridster);
            detectRowSize(vm.gridster.isMobile).then(
                function(rowHeight?: any) {
                    if (vm.gridsterOpts.rowHeight != rowHeight) {
                        vm.gridsterOpts.rowHeight = rowHeight;
                        updateGridsterParams();
                    }
                }
            );
            vm.isMobileSize = checkIsMobileSize();

            //TODO: widgets visibility
            /*$timeout(function () {
                updateVisibleRect(true);
            }, 500, false);*/
        }
    });

    function autofillHeight() {
        if (vm.gridsterOpts.isMobile) {
            return vm.mobileAutofillHeight !== undefined ? vm.mobileAutofillHeight : false;
        } else {
            return vm.autofillHeight !== undefined ? vm.autofillHeight : false;
        }
        return undefined;
    }

    function detectViewportHeight() {
        var deferred: any = $q.defer();
        var viewportHeight: any = gridsterParent.height();
        if (viewportHeight) {
            deferred.resolve(viewportHeight);
        } else {
            $scope.viewportHeightWatch = $scope.$watch(function() { return gridsterParent.height(); },
                function(viewportHeight?: any) {
                    if (viewportHeight) {
                        $scope.viewportHeightWatch();
                        deferred.resolve(viewportHeight);
                    }
                }
            );
        }
        return deferred.promise;
    }

    function detectRowSize(isMobile?: any) {
        var deferred: any = $q.defer();
        var rowHeight: any;
        if (autofillHeight()) {
            detectViewportHeight().then(
                function(viewportHeight?: any) {
                    var totalRows: any = 0;
                    for (var i: any = 0; i < vm.widgets.length; i++) {
                        var w: any = vm.widgets[i];
                        var sizeY: any = widgetSizeY(w);
                        if (isMobile) {
                            totalRows += sizeY;
                        } else {
                            var row: any = widgetRow(w);
                            var bottom: any = row + sizeY;
                            totalRows = Math.max(totalRows, bottom);
                        }
                    }
                    rowHeight = (viewportHeight - vm.gridsterOpts.margins[1]*(vm.widgets.length+1) + vm.gridsterOpts.margins[0]*vm.widgets.length) / totalRows;
                    deferred.resolve(rowHeight);
                }
            );
        } else if (isMobile) {
            rowHeight = vm.mobileRowHeight !== undefined ? vm.mobileRowHeight : 70;
            deferred.resolve(rowHeight);
        } else {
            rowHeight = 'match';
            deferred.resolve(rowHeight);
        }
        return deferred.promise;
    }

    function widgetOrder(widget?: any) {
        var order: any;
        var hasLayout: any = vm.widgetLayouts && vm.widgetLayouts[widget.id];
        if (hasLayout && vm.widgetLayouts[widget.id].mobileOrder !== undefined
                && vm.widgetLayouts[widget.id].mobileOrder >= 0) {
            order = vm.widgetLayouts[widget.id].mobileOrder;
        } else if (widget.config.mobileOrder !== undefined && widget.config.mobileOrder >= 0) {
            order = widget.config.mobileOrder;
        } else if (hasLayout) {
            order = vm.widgetLayouts[widget.id].row;
        } else {
            order = widget.row;
        }
        return order;
    }

    dashboardEventService.widgetPositionChanged$.subscribe(function () {
        sortWidgets();
    });

    loadDashboard();

    function sortWidgets() {
        vm.widgets.sort(function (widget1?: any, widget2?: any) {
            var row1: any = widgetOrder(widget1);
            var row2: any = widgetOrder(widget2);
            var res: any = row1 - row2;
            if (res === 0) {
                res = widgetCol(widget1) - widgetCol(widget2);
            }
            return res;
        });
    }

    function reload() {
        loadDashboard();
    }

    function loadDashboard() {
        $timeout(function () {
            if (vm.loadWidgets) {
                var promise: any = vm.loadWidgets();
                if (promise) {
                    promise.then(function () {
                        dashboardLoaded();
                    }, function () {
                        dashboardLoaded();
                    });
                } else {
                    dashboardLoaded();
                }
            } else {
                dashboardLoaded();
            }
        }, 0, false);
    }

    function updateGridsterParams() {
        if (vm.gridster) {
            if (vm.gridster.colWidth === 'auto') {
                vm.gridster.curColWidth = (vm.gridster.curWidth + (vm.gridster.outerMargin ? -vm.gridster.margins[1] : vm.gridster.margins[1])) / vm.gridster.columns;
            } else {
                vm.gridster.curColWidth = vm.gridster.colWidth;
            }
            vm.gridster.curRowHeight = vm.gridster.rowHeight;
            if (typeof vm.gridster.rowHeight === 'string') {
                if (vm.gridster.rowHeight === 'match') {
                    vm.gridster.curRowHeight = Math.round(vm.gridster.curColWidth);
                } else if (vm.gridster.rowHeight.indexOf('*') !== -1) {
                    vm.gridster.curRowHeight = Math.round(vm.gridster.curColWidth * vm.gridster.rowHeight.replace('*', '').replace(' ', ''));
                } else if (vm.gridster.rowHeight.indexOf('/') !== -1) {
                    vm.gridster.curRowHeight = Math.round(vm.gridster.curColWidth / vm.gridster.rowHeight.replace('/', '').replace(' ', ''));
                }
            }
        }
    }

    //TODO: widgets visibility
    /*function updateVisibleRect (force, containerResized) {
        if (vm.gridster) {
            var position = $(vm.gridster.$element).position()
            if (position) {
                var viewportWidth = gridsterParent.width();
                var viewportHeight = gridsterParent.height();
                var top = -position.top;
                var bottom = top + viewportHeight;
                var left = -position.left;
                var right = left + viewportWidth;

                var newVisibleRect = {
                    top: vm.gridster.pixelsToRows(top),
                    topPx: top,
                    bottom: vm.gridster.pixelsToRows(bottom),
                    bottomPx: bottom,
                    left: vm.gridster.pixelsToColumns(left),
                    right: vm.gridster.pixelsToColumns(right),
                    isMobile: vm.gridster.isMobile,
                    curRowHeight: vm.gridster.curRowHeight,
                    containerResized: containerResized
                };

                if (force ||
                    newVisibleRect.top != vm.visibleRect.top ||
                    newVisibleRect.topPx != vm.visibleRect.topPx ||
                    newVisibleRect.bottom != vm.visibleRect.bottom ||
                    newVisibleRect.bottomPx != vm.visibleRect.bottomPx ||
                    newVisibleRect.left != vm.visibleRect.left ||
                    newVisibleRect.right != vm.visibleRect.right ||
                    newVisibleRect.isMobile != vm.visibleRect.isMobile ||
                    newVisibleRect.curRowHeight != vm.visibleRect.curRowHeight ||
                    newVisibleRect.containerResized != vm.visibleRect.containerResized) {
                    vm.visibleRect = newVisibleRect;
                    $scope.$broadcast('visibleRectChanged', vm.visibleRect);
                }
            }
        }
    }*/

    function checkIsLocalGridsterElement (gridster?: any) {
        return gridsterElement && gridsterElement[0] === gridster.$element[0];
    }

    function onWidgetFullscreenChanged(expanded?: any, widget?: any) {
        vm.isWidgetExpanded = expanded;
        $scope.$broadcast('onWidgetFullscreenChanged', vm.isWidgetExpanded, widget);
    }

    function widgetMouseDown ($event?: any, widget?: any) {
        if (vm.onWidgetMouseDown) {
            vm.onWidgetMouseDown({event: $event, widget: widget});
        }
    }

    function widgetClicked ($event?: any, widget?: any) {
        if (vm.onWidgetClicked) {
            vm.onWidgetClicked({event: $event, widget: widget});
        }
    }

    function openDashboardContextMenu($event?: any, $mdOpenMousepointMenu?: any) {
        if (vm.prepareDashboardContextMenu) {
            vm.contextMenuItems = vm.prepareDashboardContextMenu();
            if (vm.contextMenuItems && vm.contextMenuItems.length > 0) {
                vm.contextMenuEvent = $event;
                $mdOpenMousepointMenu($event);
            }
        }
    }

    function openWidgetContextMenu($event?: any, widget?: any, $mdOpenMousepointMenu?: any) {
        if (vm.prepareWidgetContextMenu) {
            vm.widgetContextMenuItems = vm.prepareWidgetContextMenu({widget: widget});
            if (vm.widgetContextMenuItems && vm.widgetContextMenuItems.length > 0) {
                vm.widgetContextMenuEvent = $event;
                $mdOpenMousepointMenu($event);
            }
        }
    }

    function getEventGridPosition(event?: any) {
        var pos: any = {
            row: 0,
            column: 0
        }
        if (!gridsterParent) {
            return pos;
        }
        var offset: any = gridsterParent.offset();
        var x: any = event.pageX - offset.left + gridsterParent.scrollLeft();
        var y: any = event.pageY - offset.top + gridsterParent.scrollTop();
        if (vm.gridster) {
            pos.row = vm.gridster.pixelsToRows(y);
            pos.column = vm.gridster.pixelsToColumns(x);
        }
        return pos;
    }

    function editWidget ($event?: any, widget?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.isEditActionEnabled && vm.onEditWidget) {
            vm.onEditWidget({event: $event, widget: widget});
        }
    }

    function exportWidget ($event?: any, widget?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.isExportActionEnabled && vm.onExportWidget) {
            vm.onExportWidget({event: $event, widget: widget});
        }
    }

    function removeWidget($event?: any, widget?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.isRemoveActionEnabled && vm.onRemoveWidget) {
            vm.onRemoveWidget({event: $event, widget: widget});
        }
    }

    function highlightWidget(widget?: any, delay?: any) {
        if (!highlightedMode || highlightedWidget != widget) {
            highlightedMode = true;
            highlightedWidget = widget;
            scrollToWidget(widget, delay);
        }
    }

    function selectWidget(widget?: any, delay?: any) {
        if (selectedWidget != widget) {
            selectedWidget = widget;
            scrollToWidget(widget, delay);
        }
    }

    function scrollToWidget(widget?: any, delay?: any) {
        if (vm.gridster) {
            var item: any = $('.gridster-item', vm.gridster.$element)[vm.widgets.indexOf(widget)];
            if (item) {
                var height: any = $(item).outerHeight(true);
                var rectHeight: any = gridsterParent.height();
                var offset: any = (rectHeight - height) / 2;
                var scrollTop: any = item.offsetTop;
                if (offset > 0) {
                    scrollTop -= offset;
                }
                gridsterParent.animate({
                    scrollTop: scrollTop
                }, delay);
            }
        }
    }

    function getSelectedWidget() {
        return selectedWidget;
    }

    function resetHighlight() {
        highlightedMode = false;
        highlightedWidget = null;
        selectedWidget = null;
    }

    function isHighlighted(widget?: any) {
        return (highlightedMode && highlightedWidget === widget) || (selectedWidget === widget);
    }

    function isNotHighlighted(widget?: any) {
        return highlightedMode && highlightedWidget != widget;
    }

    function widgetSizeX(widget?: any) {
        if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
            return vm.widgetLayouts[widget.id].sizeX;
        } else {
            return widget.sizeX;
        }
        return undefined;
    }

    function setWidgetSizeX(widget?: any, sizeX?: any) {
        if (!vm.gridsterOpts.isMobile) {
            if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
                vm.widgetLayouts[widget.id].sizeX = sizeX;
            } else {
                widget.sizeX = sizeX;
            }
        }
    }

    function widgetSizeY(widget?: any) {
        if (vm.gridsterOpts.isMobile && !vm.mobileAutofillHeight) {
            var mobileHeight: any;
            if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
                mobileHeight = vm.widgetLayouts[widget.id].mobileHeight;
            }
            if (!mobileHeight && widget.config.mobileHeight) {
                mobileHeight = widget.config.mobileHeight;
            }
            if (mobileHeight) {
                return mobileHeight;
            } else {
                return widget.sizeY * 24 / vm.gridsterOpts.columns;
            }
        } else {
            if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
                return vm.widgetLayouts[widget.id].sizeY;
            } else {
                return widget.sizeY;
            }
        }
        return undefined;
    }

    function setWidgetSizeY(widget?: any, sizeY?: any) {
        if (!vm.gridsterOpts.isMobile && !vm.autofillHeight) {
            if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
                vm.widgetLayouts[widget.id].sizeY = sizeY;
            } else {
                widget.sizeY = sizeY;
            }
        }
    }

    function widgetRow(widget?: any) {
        if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
            return vm.widgetLayouts[widget.id].row;
        } else {
            return widget.row;
        }
        return undefined;
    }

    function setWidgetRow(widget?: any, row?: any) {
        if (!vm.gridsterOpts.isMobile) {
            if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
                vm.widgetLayouts[widget.id].row = row;
            } else {
                widget.row = row;
            }
        }
    }

    function widgetCol(widget?: any) {
        if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
            return vm.widgetLayouts[widget.id].col;
        } else {
            return widget.col;
        }
        return undefined;
    }

    function setWidgetCol(widget?: any, col?: any) {
        if (!vm.gridsterOpts.isMobile) {
            if (vm.widgetLayouts && vm.widgetLayouts[widget.id]) {
                vm.widgetLayouts[widget.id].col = col;
            } else {
                widget.col = col;
            }
        }
    }

    function widgetStyle(widget?: any) {
        var style: any = {cursor: 'pointer',
                     color: widgetColor(widget),
                     backgroundColor: widgetBackgroundColor(widget),
                     padding: widgetPadding(widget),
                     margin: widgetMargin(widget)};
        if (widget.config.widgetStyle !== undefined) {
            Object.assign(style, widget.config.widgetStyle);
        }
        return style;
    }

    function widgetColor(widget?: any) {
        if (widget.config.color) {
            return widget.config.color;
        } else {
            return 'rgba(0, 0, 0, 0.87)';
        }
        return undefined;
    }

    function widgetBackgroundColor(widget?: any) {
        if (widget.config.backgroundColor) {
            return widget.config.backgroundColor;
        } else {
            return '#fff';
        }
        return undefined;
    }

    function widgetPadding(widget?: any) {
        if (widget.config.padding) {
            return widget.config.padding;
        } else {
            return '8px';
        }
        return undefined;
    }

    function widgetMargin(widget?: any) {
        if (widget.config.margin) {
            return widget.config.margin;
        } else {
            return '0px';
        }
        return undefined;
    }

    function showWidgetTitle(widget?: any) {
        if (widget.config.showTitle !== undefined) {
            return widget.config.showTitle;
        } else {
            return true;
        }
        return undefined;
    }

    function showWidgetTitleIcon(widget?: any) {
        if (widget.config.showTitleIcon !== undefined) {
            return widget.config.showTitleIcon;
        } else {
            return false;
        }
        return undefined;
    }

    function hasWidgetTitleTemplate(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.widgetTitleTemplate) {
            return true;
        } else {
            return false;
        }
        return undefined;
    }

    function widgetTitleTemplate(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.widgetTitleTemplate) {
            return ctx.widgetTitleTemplate;
        } else {
            return '';
        }
        return undefined;
    }

    function showWidgetTitlePanel(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.hideTitlePanel) {
            return false;
        } else {
            return hasWidgetTitleTemplate(widget) || showWidgetTitle(widget) || hasTimewindow(widget);
        }
        return undefined;
    }

    function showWidgetActions(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.hideTitlePanel) {
            return false;
        } else {
            return true;
        }
        return undefined;
    }

    function widgetTitleStyle(widget?: any) {
        if (widget.config.titleStyle !== undefined) {
            return widget.config.titleStyle;
        } else {
            return {};
        }
        return undefined;
    }

    function widgetTitle(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.widgetTitle
            && ctx.widgetTitle.length) {
            return ctx.widgetTitle;
        } else {
            return widget.config.title;
        }
        return undefined;
    }

    function widgetTitleIcon(widget?: any) {
        if (widget.config.titleIcon !== undefined) {
            return widget.config.titleIcon;
        } else {
            return '';
        }
        return undefined;
    }

    function widgetTitleIconStyle(widget?: any) {
        var style: any = {};
        if (widget.config.iconColor !== undefined) {
            style.color = widget.config.iconColor;
        }
        if (widget.config.iconSize !== undefined) {
            style.fontSize = widget.config.iconSize;
        }
        return style;
    }

    function widgetTitleTooltip(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.widgetTitleTooltip
            && ctx.widgetTitleTooltip.length) {
            return ctx.widgetTitleTooltip;
        } else {
            return widget.config.titleTooltip;
        }
        return undefined;
    }

    function customWidgetHeaderActions(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.customHeaderActions && ctx.customHeaderActions.length) {
            return ctx.customHeaderActions;
        } else {
            return [];
        }
        return undefined;
    }

    function widgetActions(widget?: any) {
        var ctx: any = widgetContext(widget);
        if (ctx && ctx.widgetActions && ctx.widgetActions.length) {
            return ctx.widgetActions;
        } else {
            return [];
        }
        return undefined;
    }

    function widgetContext(widget?: any) {
        var context: any;
        if (widget.$ctx) {
            context = widget.$ctx();
        }
        return context;
    }

    function dropWidgetShadow(widget?: any) {
        if (widget.config.dropShadow !== undefined) {
            return widget.config.dropShadow;
        } else {
            return true;
        }
        return undefined;
    }

    function enableWidgetFullscreen(widget?: any) {
        if (widget.config.enableFullscreen !== undefined) {
            return widget.config.enableFullscreen;
        } else {
            return true;
        }
        return undefined;
    }

    function hasTimewindow(widget?: any) {
        if (widget.type === types.widgetType.timeseries.value || widget.type === types.widgetType.alarm.value) {
            return widget.config.useDashboardTimewindow !== undefined ?
                (!widget.config.useDashboardTimewindow && (widget.config.displayTimewindow === undefined || widget.config.displayTimewindow)) : false;
        } else {
            return false;
        }
        return undefined;
    }

    function hasAggregation(widget?: any) {
        return widget.type === types.widgetType.timeseries.value;
    }

    function adoptMaxRows() {
        if (vm.widgets) {
            var maxRows: any = vm.gridsterOpts.maxRows;
            for (var i: any = 0; i < vm.widgets.length; i++) {
                var w: any = vm.widgets[i];
                var bottom: any = widgetRow(w) + widgetSizeY(w);
                maxRows = Math.max(maxRows, bottom);
            }
            vm.gridsterOpts.maxRows = Math.max(maxRows, vm.gridsterOpts.maxRows);
        }
    }

    function dashboardLoaded() {
        $mdUtil.nextTick(function () {
            if (vm.dashboardTimewindowWatch) {
                vm.dashboardTimewindowWatch();
                vm.dashboardTimewindowWatch = null;
            }
            vm.dashboardTimewindowWatch = effect(() => {
                vm.dashboardTimewindow;
                $scope.$broadcast('dashboardTimewindowChanged', vm.dashboardTimewindow);
            });
            adoptMaxRows();
            vm.dashboardLoading = false;
            if ($scope.gridsterScopeWatcher) {
                $scope.gridsterScopeWatcher();
            }
            $scope.gridsterScopeWatcher = effect(() => {
                var hasScope: any = gridsterElement.scope() ? true : false;
                if (hasScope) {
                    $scope.gridsterScopeWatcher.destroy();
                    $scope.gridsterScopeWatcher = null;
                    var gridsterScope: any = gridsterElement.scope();
                    vm.gridster = gridsterScope.gridster;
                    setupGridster(vm.gridster);
                    if (vm.onInit) {
                        vm.onInit({dashboard: vm});
                    }
                }
            });
        });
    }

    function setupGridster(gridster?: any) {
        if (gridster) {
            if (!gridster.origMoveOverlappingItems) {
                gridster.origMoveOverlappingItems = gridster.moveOverlappingItems;
                gridster.moveOverlappingItems = () => {};
            }
        }
    }

    function loading() {
        return !vm.ignoreLoading && $rootScope.loading;
    }

}

/**
 * Ported from the AngularJS directive `tbDashboard` (module `thingsboard.directives.dashboard`) in src/app/components/dashboard.directive.js:36.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-dashboard',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatProgressSpinnerModule, MatMenuModule, MatIconModule, MatButtonModule, KeyboardShortcutPipe, CommonModule, FormsModule, forwardRef(() => TbExpandFullscreenDirective), forwardRef(() => TbTimewindowDirective), forwardRef(() => TbWidgetDirective)],
  templateUrl: './tb-dashboard.directive.html',
})
export class TbDashboardDirective {
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
  readonly prepareDashboardContextMenu = output<any>();
  readonly prepareWidgetContextMenu = output<any>();
  readonly loadWidgets = output<any>();
  readonly onInit = output<any>();
  readonly onInitFailed = output<any>();
  readonly dashboardStyle = model<any>();
  readonly dashboardClass = model<any>();
  readonly ignoreLoading = model<any>();

  // TODO(port): template: 1 × ng-include left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            widgets: '=',
            widgetLayouts: '=?',
            aliasController: '=',
            stateController: '=',
            dashboardTimewindow: '=?',
            columns: '=',
            margins: '=',
            isEdit: '=',
            autofillHeight: '=',
            mobileAutofillHeight: '=?',
            mobileRowHeight: '=?',
            isMobile: '=',
            isMobileDisabled: '=?',
            isEditActionEnabled: '=',
            isExportActionEnabled: '=',
            isRemoveActionEnabled: '=',
            onEditWidget: '&?',
            onExportWidget: '&?',
            onRemoveWidget: '&?',
            onWidgetMouseDown: '&?',
            onWidgetClicked: '&?',
            prepareDashboardContextMenu: '&?',
            prepareWidgetContextMenu: '&?',
            loadWidgets: '&?',
            onInit: '&?',
            onInitFailed: '&?',
            dashboardStyle: '=?',
            dashboardClass: '=?',
            ignoreLoading: '=?'
        };
  controller: any = DashboardController;
  controllerAs: any;
  templateUrl: any = dashboardTemplate;
  widget: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
