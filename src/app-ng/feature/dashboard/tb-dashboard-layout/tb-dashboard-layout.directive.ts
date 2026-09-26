import { Component, forwardRef, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TbDashboardDirective } from '../../components/tb-dashboard/tb-dashboard.directive';
import dashboardLayoutTemplate from '../../../../app/dashboard/layouts/dashboard-layout.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function DashboardLayoutController(this: any, $scope?: any, $rootScope?: any, $translate?: any, $window?: any, hotkeys?: any, itembuffer?: any) {

    var vm: any = this;

    vm.noData = noData;
    vm.addWidget = addWidget;
    vm.editWidget = editWidget;
    vm.exportWidget = exportWidget;
    vm.widgetMouseDown = widgetMouseDown;
    vm.widgetClicked = widgetClicked;
    vm.prepareDashboardContextMenu = prepareDashboardContextMenu;
    vm.prepareWidgetContextMenu = prepareWidgetContextMenu;
    vm.removeWidget = removeWidget;
    vm.pasteWidget = pasteWidget;
    vm.pasteWidgetReference = pasteWidgetReference;
    vm.dashboardInited = dashboardInited;
    vm.dashboardInitFailed = dashboardInitFailed;

    vm.reload = function() {
        if (vm.dashboardContainer) {
            vm.dashboardContainer.reload();
        }
    };

    vm.setResizing = function(resizing?: any) {
        if (vm.dashboardContainer) {
            vm.dashboardContainer.isResizing = resizing;
        }
    }

    vm.resetHighlight = function() {
        if (vm.dashboardContainer) {
            vm.dashboardContainer.resetHighlight();
        }
    };

    vm.highlightWidget = function(widget?: any, delay?: any) {
        if (vm.dashboardContainer) {
            vm.dashboardContainer.highlightWidget(widget, delay);
        }
    };

    vm.selectWidget = function(widget?: any, delay?: any) {
        if (vm.dashboardContainer) {
            vm.dashboardContainer.selectWidget(widget, delay);
        }
    };

    vm.dashboardInitComplete = false;

    initHotKeys();

    $scope.$on('$destroy', function() {
        vm.dashboardContainer = null;
    });

    $scope.$watch('vm.layoutCtx', function () {
        if (vm.layoutCtx) {
            vm.layoutCtx.ctrl = vm;
        }
    });

    function noData() {
        return vm.dashboardInitComplete && vm.layoutCtx &&
            vm.layoutCtx.widgets && vm.layoutCtx.widgets.length == 0;
    }

    function addWidget($event?: any) {
        if (vm.dashboardCtx.onAddWidget) {
            vm.dashboardCtx.onAddWidget($event, vm.layoutCtx);
        }
    }

    function editWidget($event?: any, widget?: any) {
        if (vm.dashboardCtx.onEditWidget) {
            vm.dashboardCtx.onEditWidget($event, vm.layoutCtx, widget);
        }
    }

    function exportWidget($event?: any, widget?: any) {
        if (vm.dashboardCtx.onExportWidget) {
            vm.dashboardCtx.onExportWidget($event, vm.layoutCtx, widget);
        }
    }

    function widgetMouseDown($event?: any, widget?: any) {
        if (vm.dashboardCtx.onWidgetMouseDown) {
            vm.dashboardCtx.onWidgetMouseDown($event, vm.layoutCtx, widget);
        }
    }

    function widgetClicked($event?: any, widget?: any) {
        if (vm.dashboardCtx.onWidgetClicked) {
            vm.dashboardCtx.onWidgetClicked($event, vm.layoutCtx, widget);
        }
    }

    function prepareDashboardContextMenu() {
        if (vm.dashboardCtx.prepareDashboardContextMenu) {
            return vm.dashboardCtx.prepareDashboardContextMenu(vm.layoutCtx);
        }
        return undefined;
    }

    function prepareWidgetContextMenu(widget?: any) {
        if (vm.dashboardCtx.prepareWidgetContextMenu) {
            return vm.dashboardCtx.prepareWidgetContextMenu(vm.layoutCtx, widget);
        }
        return undefined;
    }

    function removeWidget($event?: any, widget?: any) {
        if (vm.dashboardCtx.onRemoveWidget) {
            vm.dashboardCtx.onRemoveWidget($event, vm.layoutCtx, widget);
        }
    }

    function dashboardInitFailed() {
        var parentScope: any = $window.parent.angular.element($window.frameElement).scope();
        parentScope.$emit('widgetEditModeInited');
        parentScope.$apply();
        vm.dashboardInitComplete = true;
    }

    function dashboardInited(dashboardContainer?: any) {
        vm.dashboardContainer = dashboardContainer;
        vm.dashboardInitComplete = true;
    }

    function isHotKeyAllowed(event?: any) {
        var target: any = event.target || event.srcElement;
        var scope: any = angular.element(target).scope();
        return scope && scope.$parent !== $rootScope;
    }

    function initHotKeys() {
        $translate(['action.copy', 'action.paste', 'action.delete']).then(function (translations?: any) {
            hotkeys.bindTo($scope)
                .add({
                    combo: 'ctrl+c',
                    description: translations['action.copy'],
                    callback: function (event?: any) {
                        if (isHotKeyAllowed(event) &&
                            vm.isEdit && !vm.isEditingWidget && !vm.widgetEditMode) {
                            var widget: any = vm.dashboardContainer.getSelectedWidget();
                            if (widget) {
                                event.preventDefault();
                                copyWidget(event, widget);
                            }
                        }
                    }
                })
                .add({
                    combo: 'ctrl+r',
                    description: translations['action.copy-reference'],
                    callback: function (event?: any) {
                        if (isHotKeyAllowed(event) &&
                            vm.isEdit && !vm.isEditingWidget && !vm.widgetEditMode) {
                            var widget: any = vm.dashboardContainer.getSelectedWidget();
                            if (widget) {
                                event.preventDefault();
                                copyWidgetReference(event, widget);
                            }
                        }
                    }
                })
                .add({
                    combo: 'ctrl+v',
                    description: translations['action.paste'],
                    callback: function (event?: any) {
                        if (isHotKeyAllowed(event) &&
                            vm.isEdit && !vm.isEditingWidget && !vm.widgetEditMode) {
                            if (itembuffer.hasWidget()) {
                                event.preventDefault();
                                pasteWidget(event);
                            }
                        }
                    }
                })
                .add({
                    combo: 'ctrl+i',
                    description: translations['action.paste-reference'],
                    callback: function (event?: any) {
                        if (isHotKeyAllowed(event) &&
                            vm.isEdit && !vm.isEditingWidget && !vm.widgetEditMode) {
                            if (itembuffer.canPasteWidgetReference(vm.dashboardCtx.dashboard,
                                    vm.dashboardCtx.state, vm.layoutCtx.id)) {
                                event.preventDefault();
                                pasteWidgetReference(event);
                            }
                        }
                    }
                })

                .add({
                    combo: 'ctrl+x',
                    description: translations['action.delete'],
                    callback: function (event?: any) {
                        if (isHotKeyAllowed(event) &&
                            vm.isEdit && !vm.isEditingWidget && !vm.widgetEditMode) {
                            var widget: any = vm.dashboardContainer.getSelectedWidget();
                            if (widget) {
                                event.preventDefault();
                                vm.dashboardCtx.onRemoveWidget(event, vm.layoutCtx, widget);
                            }
                        }
                    }
                });
        });
    }

    function copyWidget($event?: any, widget?: any) {
        if (vm.dashboardCtx.copyWidget) {
            vm.dashboardCtx.copyWidget($event, vm.layoutCtx, widget);
        }
    }

    function copyWidgetReference($event?: any, widget?: any) {
        if (vm.dashboardCtx.copyWidgetReference) {
            vm.dashboardCtx.copyWidgetReference($event, vm.layoutCtx, widget);
        }
    }

    function pasteWidget($event?: any) {
        var pos: any = vm.dashboardContainer.getEventGridPosition($event);
        if (vm.dashboardCtx.pasteWidget) {
            vm.dashboardCtx.pasteWidget($event, vm.layoutCtx, pos);
        }
    }

    function pasteWidgetReference($event?: any) {
        var pos: any = vm.dashboardContainer.getEventGridPosition($event);
        if (vm.dashboardCtx.pasteWidgetReference) {
            vm.dashboardCtx.pasteWidgetReference($event, vm.layoutCtx, pos);
        }
    }

}

/**
 * Ported from the AngularJS directive `tbDashboardLayout` (module `thingsboard.dashboard.layouts`) in src/app/dashboard/layouts/index.js:20.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-dashboard-layout',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatButtonModule, CommonModule, forwardRef(() => TbDashboardDirective)],
  templateUrl: './tb-dashboard-layout.directive.html',
})
export class TbDashboardLayoutDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly layoutCtx = model<any>();
  readonly dashboardCtx = model<any>();
  readonly isEdit = model<any>();
  readonly isMobile = model<any>();
  readonly widgetEditMode = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            layoutCtx: '=',
            dashboardCtx: '=',
            isEdit: '=',
            isMobile: '=',
            widgetEditMode: '='
        };
  controller: any = DashboardLayoutController;
  controllerAs: any;
  templateUrl: any = dashboardLayoutTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
