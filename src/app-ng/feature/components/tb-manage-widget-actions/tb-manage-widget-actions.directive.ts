import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import manageWidgetActionsTemplate from '../../../../app/components/widget/action/manage-widget-actions.tpl.html?raw';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function ManageWidgetActionsController(this: any, $rootScope?: any, $scope?: any, $document?: any, $mdDialog?: any, $q?: any, $filter?: any,
                              $translate?: any, $timeout?: any, utils?: any, types?: any) {

    let vm: any = this;

    vm.allActions = [];

    vm.actions = [];
    vm.actionsCount = 0;

    vm.query = {
        order: 'actionSourceName',
        limit: 10,
        page: 1,
        search: null
    };

    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.onReorder = onReorder;
    vm.onPaginate = onPaginate;
    vm.addAction = addAction;
    vm.editAction = editAction;
    vm.deleteAction = deleteAction;

    $timeout(function(){
        $scope.manageWidgetActionsForm.querySearchInput.$pristine = false;
    });

    effect(() => {
        if (vm.widgetActions()) {
            reloadActions();
        }
    });

    effect(() => {
        const newVal = vm.query.search;
        if (!isEqual(newVal, prevSearchVal) && vm.query.search != null) {
            updateActions();
        }
        prevSearchVal = newVal;
    });

    function enterFilterMode (event?: any) {
        let $button: any = angular.element(event.currentTarget);
        let $toolbarsContainer: any = $button.closest('.toolbarsContainer');

        vm.query.search = '';

        $timeout(()=>{
            $toolbarsContainer.find('.searchInput').focus();
        })
    }

    function exitFilterMode () {
        vm.query.search = null;
        updateActions();
    }

    function onReorder () {
        updateActions();
    }

    function onPaginate () {
        updateActions();
    }

    function addAction($event?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        openWidgetActionDialog($event, null, true);
    }

    function editAction ($event?: any, action?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        openWidgetActionDialog($event, action, false);
    }

    function deleteAction($event?: any, action?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (action) {
            var title: any = $translate.instant('widget-config.delete-action-title');
            var content: any = $translate.instant('widget-config.delete-action-text', {actionName: action.name});
            var confirm: any = $mdDialog.confirm()
                .targetEvent($event)
                .title(title)
                .htmlContent(content)
                .ariaLabel(title)
                .cancel($translate.instant('action.no'))
                .ok($translate.instant('action.yes'));

            confirm._options.multiple = true;
            confirm._options.fullscreen = true;

            $mdDialog.show(confirm).then(function () {
                var index: any = getActionIndex(action.id, vm.allActions);
                if (index > -1) {
                    vm.allActions.splice(index, 1);
                }
                var targetActions: any = vm.widgetActions[action.actionSourceId];
                index = getActionIndex(action.id, targetActions);
                if (index > -1) {
                    targetActions.splice(index, 1);
                }
                $scope.manageWidgetActionsForm.$setDirty();
                updateActions();
            });
        }
    }

    function openWidgetActionDialog($event?: any, action?: any, isAdd?: any) {
        var prevActionId: any = null;
        if (!isAdd) {
            prevActionId = action.id;
        }
        var availableActionSources: any = {};
        for (var id in vm.actionSources) {
            var actionSource: any = vm.actionSources[id];
            if (actionSource.multiple) {
                availableActionSources[id] = actionSource;
            } else {
                if (!isAdd && action.actionSourceId == id) {
                    availableActionSources[id] = actionSource;
                } else {
                    var result: any = filterFilter(vm.allActions, {actionSourceId: id});
                    if (!result || !result.length) {
                        availableActionSources[id] = actionSource;
                    }
                }
            }
        }
        $mdDialog.show({
            controller: 'WidgetActionDialogController',
            controllerAs: 'vm',
            templateUrl: manageWidgetActionsTemplate,
            parent: angular.element($document[0].body),
            locals: {isAdd: isAdd, fetchDashboardStates: vm.fetchDashboardStates,
                actionSources: availableActionSources, widgetActions: vm.widgetActions,
                action: angular.copy(action)},
            multiple: true,
            fullscreen: true,
            targetEvent: $event
        }).then(function (action?: any) {
            saveAction(action, prevActionId);
            updateActions();
        });
    }

    function getActionIndex(id?: any, actions?: any) {
        var result: any = filterFilter(actions, {id: id}, true);
        if (result && result.length) {
            return actions.indexOf(result[0]);
        }
        return -1;
    }

    function saveAction(action?: any, prevActionId?: any) {
        var actionSourceName: any = vm.actionSources[action.actionSourceId].name;
        action.actionSourceName = utils.customTranslation(actionSourceName, actionSourceName);
        action.typeName = $translate.instant(types.widgetActionTypes[action.type].name);
        var actionSourceId: any = action.actionSourceId;
        var widgetAction: any = angular.copy(action);
        delete widgetAction.actionSourceId;
        delete widgetAction.actionSourceName;
        delete widgetAction.typeName;
        var targetActions: any = vm.widgetActions[actionSourceId];
        if (!targetActions) {
            targetActions = [];
            vm.widgetActions[actionSourceId] = targetActions;
        }
        if (prevActionId) {
            const indexInTarget: any = getActionIndex(prevActionId, targetActions);
            const indexInAllActions: any = getActionIndex(prevActionId, vm.allActions);
            if (indexInTarget > -1) {
                targetActions[indexInTarget] = widgetAction;
            } else if (indexInAllActions > -1) {
                const prevActionSourceId: any = vm.allActions[indexInAllActions].actionSourceId;
                const index: any = getActionIndex(prevActionId,vm.widgetActions[prevActionSourceId]);
                vm.widgetActions[prevActionSourceId].splice(index,1);
                targetActions.push(widgetAction);
            }
            if (indexInAllActions > -1) {
                vm.allActions[indexInAllActions] = action;
            }
        } else {
            vm.allActions.push(action);
            targetActions.push(widgetAction);
        }
        $scope.manageWidgetActionsForm.$setDirty();
    }

    function reloadActions() {
        vm.allActions = [];
        vm.actions = [];
        vm.actionsCount = 0;

        for (var actionSourceId in vm.widgetActions) {
            var actionSource: any = vm.actionSources[actionSourceId];
            var actionSourceActions: any = vm.widgetActions[actionSourceId];
            for (var i: any=0;i<actionSourceActions.length;i++) {
                var actionSourceAction: any = actionSourceActions[i];
                var action: any = angular.copy(actionSourceAction);
                action.actionSourceId = actionSourceId;
                action.actionSourceName = utils.customTranslation(actionSource.name, actionSource.name);
                action.typeName = $translate.instant(types.widgetActionTypes[actionSourceAction.type].name);
                vm.allActions.push(action);
            }
        }

        updateActions ();
    }

    function updateActions () {
        var result: any = $filter('orderBy')(vm.allActions, vm.query.order);
        if (vm.query.search != null) {
            result = filterFilter(result, {$: vm.query.search});
        }
        vm.actionsCount = result.length;
        var startIndex: any = vm.query.limit * (vm.query.page - 1);
        vm.actions = result.slice(startIndex, startIndex + vm.query.limit);
    }
}

/**
 * Ported from the AngularJS directive `tbManageWidgetActions` (module `thingsboard.directives.widgetActions`) in src/app/components/widget/action/manage-widget-actions.directive.js:49.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-manage-widget-actions',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './tb-manage-widget-actions.directive.html',
})
export class TbManageWidgetActionsDirective {
  readonly actionSources = model<any>();
  readonly widgetActions = model<any>();
  readonly fetchDashboardStates = output<any>();

  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place
  // TODO(port): template: 1 × ng-form left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            actionSources: '=',
            widgetActions: '=',
            fetchDashboardStates: '&',
        };
  controller: any = ManageWidgetActionsController;
  controllerAs: any;
  templateUrl: any = manageWidgetActionsTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
