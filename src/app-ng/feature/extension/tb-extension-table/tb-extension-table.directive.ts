import { Component, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import extensionTableTemplate from '../../../../app/extension/extension-table.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function ExtensionTableController(this: any, $scope?: any, $filter?: any, $document?: any, $translate?: any, $timeout?: any, $mdDialog?: any, types?: any, attributeService?: any, telemetryWebsocketService?: any, importExport?: any) {

    let vm: any = this;

    vm.extensions = [];
    vm.allExtensions = [];
    vm.selectedExtensions = [];
    vm.extensionsCount = 0;

    vm.query = {
        order: 'id',
        limit: 5,
        page: 1,
        search: null
    };

    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.onReorder = onReorder;
    vm.onPaginate = onPaginate;
    vm.addExtension = addExtension;
    vm.editExtension = editExtension;
    vm.deleteExtension = deleteExtension;
    vm.deleteExtensions = deleteExtensions;
    vm.reloadExtensions = reloadExtensions;
    vm.updateExtensions = updateExtensions;

    $scope.$watch("vm.entityId", function(newVal?: any) {
        if (newVal) {
            if ($scope.subscriber) {
                telemetryWebsocketService.unsubscribe($scope.subscriber);
                $scope.subscriber = null;
            }

            vm.subscribed = false;
            vm.syncLastTime = $translate.instant('extension.sync.not-available');

            subscribeForClientAttributes();

            reloadExtensions();
        }
    });

    $scope.$on('$destroy', function() {
        if ($scope.subscriber) {
            telemetryWebsocketService.unsubscribe($scope.subscriber);
            $scope.subscriber = null;
        }
    });

    $scope.$watch("vm.query.search", function(newVal?: any, prevVal?: any) {
        if (!angular.equals(newVal, prevVal) && vm.query.search != null) {
            updateExtensions();
        }
    });

    $scope.$watch('vm.selectedExtensions.length', function (newLength?: any) {
        var selectionMode: any = newLength ? true : false;
        if (vm.ctx) {
            if (selectionMode) {
                vm.ctx.hideTitlePanel = true;
                $scope.$emit("selectedExtensions", true);
            } else if (vm.query.search == null) {
                vm.ctx.hideTitlePanel = false;
                $scope.$emit("selectedExtensions", false);
            }
        }
    });

    $scope.$on("showSearch", function($event?: any, source?: any) {
        if(source.entityId == vm.entityId) {
            enterFilterMode();
            $scope.$emit("filterMode", true);
        }
    });
    $scope.$on("refreshExtensions", function($event?: any, source?: any) {
        if(source.entityId == vm.entityId) {
            reloadExtensions();
        }
    });
    $scope.$on("addExtension", function($event?: any, source?: any) {
        if(source.entityId == vm.entityId) {
            addExtension();
        }
    });
    $scope.$on("exportExtensions", function($event?: any, source?: any) {
        if(source.entityId == vm.entityId) {
            vm.exportExtensions(source.entityName);
        }
    });
    $scope.$on("importExtensions", function($event?: any, source?: any) {
        if(source.entityId == vm.entityId) {
            vm.importExtensions();
        }
    });

    function enterFilterMode(event?: any) {
        let $button: any = angular.element(event.currentTarget);
        let $toolbarsContainer: any = $button.closest('.toolbarsContainer');

        vm.query.search = '';
        if(vm.inWidget) {
            vm.ctx.hideTitlePanel = true;
        }
        $timeout(()=>{
            $toolbarsContainer.find('.searchInput').focus();
        })
    }

    function exitFilterMode() {
        vm.query.search = null;
        updateExtensions();
        if(vm.inWidget) {
            vm.ctx.hideTitlePanel = false;
            $scope.$emit("filterMode", false);
        }
    }

    function onReorder() {
        updateExtensions();
    }

    function onPaginate() {
        updateExtensions();
    }

    function addExtension($event?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        openExtensionDialog($event);
    }

    function editExtension($event?: any, extension?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        openExtensionDialog($event, extension);
    }

    function openExtensionDialog($event?: any, extension?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var isAdd: any = false;
        if(!extension) {
            isAdd = true;
        }
        $mdDialog.show({
            controller: ExtensionDialogController,
            controllerAs: 'vm',
            templateUrl: extensionDialogTemplate,
            parent: angular.element($document[0].body),
            locals: {
                isAdd: isAdd,
                allExtensions: vm.allExtensions,
                entityId: vm.entityId,
                entityType: vm.entityType,
                extension: extension
            },
            bindToController: true,
            targetEvent: $event,
            fullscreen: true,
            multiple: true
        }).then(function() {
            reloadExtensions();
        }, function () {
        });
    }

    function deleteExtension($event?: any, extension?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if(extension) {
            var title: any = $translate.instant('extension.delete-extension-title', {extensionId: extension.id});
            var content: any = $translate.instant('extension.delete-extension-text');

            var confirm: any = $mdDialog.confirm()
                .targetEvent($event)
                .title(title)
                .htmlContent(content)
                .ariaLabel(title)
                .cancel($translate.instant('action.no'))
                .ok($translate.instant('action.yes'));
            $mdDialog.show(confirm).then(function() {
                var editedExtensions: any = vm.allExtensions.filter(function(ext?: any) {
                    return ext.id !== extension.id;
                });
                var editedValue: any = angular.toJson(editedExtensions);
                attributeService.saveEntityAttributes(vm.entityType, vm.entityId, types.attributesScope.shared.value, [{key:"configuration", value:editedValue}]).then(
                    function success() {
                        reloadExtensions();
                    }
                );
            });
        }
    }

    function deleteExtensions($event?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.selectedExtensions && vm.selectedExtensions.length > 0) {
            var title: any = $translate.instant('extension.delete-extensions-title', {count: vm.selectedExtensions.length}, 'messageformat');
            var content: any = $translate.instant('extension.delete-extensions-text');

            var confirm: any = $mdDialog.confirm()
                .targetEvent($event)
                .title(title)
                .htmlContent(content)
                .ariaLabel(title)
                .cancel($translate.instant('action.no'))
                .ok($translate.instant('action.yes'));
            $mdDialog.show(confirm).then(function () {
                var editedExtensions: any = angular.copy(vm.allExtensions);
                for (var i: any = 0; i < vm.selectedExtensions.length; i++) {
                    editedExtensions = editedExtensions.filter(function (ext?: any) {
                        return ext.id !== vm.selectedExtensions[i].id;
                    });
                }
                var editedValue: any = angular.toJson(editedExtensions);
                attributeService.saveEntityAttributes(vm.entityType, vm.entityId, types.attributesScope.shared.value, [{key:"configuration", value:editedValue}]).then(
                    function success() {
                        reloadExtensions();
                    }
                );
            });
        }
    }

    function reloadExtensions() {
        vm.subscribed = false;
        vm.allExtensions.length = 0;
        vm.extensions.length = 0;
        vm.extensionsPromise = attributeService.getEntityAttributesValues(vm.entityType, vm.entityId, types.attributesScope.shared.value, ["configuration"]);
        vm.extensionsPromise.then(
            function success(data?: any) {
                if (data.length) {
                    vm.allExtensions = angular.fromJson(data[0].value);
                } else {
                    vm.allExtensions = [];
                }

                vm.selectedExtensions = [];
                updateExtensions();
                vm.extensionsPromise = null;
            },
            function fail() {
                vm.extensions = [];
                vm.selectedExtensions = [];
                updateExtensions();
                vm.extensionsPromise = null;
            }
        );
    }

    function updateExtensions() {
        vm.selectedExtensions = [];
        var result: any = $filter('orderBy')(vm.allExtensions, vm.query.order);
        if (vm.query.search != null) {
            result = $filter('filter')(result, function(extension?: any) {
                if(!vm.query.search || (extension.id.indexOf(vm.query.search) != -1) || (extension.type.indexOf(vm.query.search) != -1)) {
                    return true;
                }
                return false;
            });
        }
        vm.extensionsCount = result.length;
        var startIndex: any = vm.query.limit * (vm.query.page - 1);
        vm.extensions = result.slice(startIndex, startIndex + vm.query.limit);

        vm.extensionsJSON = angular.toJson(vm.extensions);
        checkForSync();
    }

    function subscribeForClientAttributes() {
        if (!vm.subscribed) {
            if (vm.entityId && vm.entityType) {
                $scope.subscriber = {
                    subscriptionCommands: [{
                        entityType: vm.entityType,
                        entityId: vm.entityId,
                        scope: 'CLIENT_SCOPE'
                    }],
                    type: 'attribute',
                    onData: function (data?: any) {
                        if (data.data) {
                            onSubscriptionData(data.data);
                        }
                        vm.subscribed = true;
                    }
                };
                telemetryWebsocketService.subscribe($scope.subscriber);
            }
        }
    }
    function onSubscriptionData(data?: any) {

        if ($.isEmptyObject(data)) {
            vm.appliedConfiguration = undefined;
        } else {
            if (data.appliedConfiguration && data.appliedConfiguration[0] && data.appliedConfiguration[0][1]) {
                vm.appliedConfiguration = data.appliedConfiguration[0][1];
            }
        }

        updateExtensions();
        $scope.$digest();
    }


    function checkForSync() {
        if (vm.appliedConfiguration && vm.extensionsJSON && vm.appliedConfiguration === vm.extensionsJSON) {
            vm.syncStatus = $translate.instant('extension.sync.sync');
            vm.syncLastTime = formatDate();
            $scope.isSync = true;
        } else {
            vm.syncStatus = $translate.instant('extension.sync.not-sync');

            $scope.isSync = false;
        }
    }

    function formatDate(date?: any) {
        let d: any;
        if (date) {
            d = date;
        } else {
            d = new Date();
        }

        d = d.getFullYear() +'/'+ addZero(d.getMonth()+1) +'/'+ addZero(d.getDate()) + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) +':'+ addZero(d.getSeconds());
        return d;

        function addZero(num?: any) {
            if ((angular.isNumber(num) && num < 10) || (angular.isString(num) && num.length === 1)) {
                num = '0' + num;
            }
            return num;
        }
        return undefined;
    }

    vm.importExtensions = function($event?: any) {
        importExport.importExtension($event, {"entityType":vm.entityType, "entityId":vm.entityId, "successFunc":reloadExtensions});
    };
    vm.exportExtensions = function(widgetSourceEntityName?: any) {
        if(vm.inWidget) {
            importExport.exportToPc(vm.extensionsJSON,  widgetSourceEntityName + '_configuration.json');
        } else {
            importExport.exportToPc(vm.extensionsJSON,  vm.entityName + '_configuration.json');
        }
    };

    /*change function for widget implementing, like vm.exportExtensions*/
    vm.exportExtension = function($event?: any, extension?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        importExport.exportToPc(extension,  vm.entityName +'_'+ extension.id +'_configuration.json');
    };
}

/**
 * Ported from the AngularJS directive `tbExtensionTable` (module `thingsboard.extension`) in src/app/extension/index.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-extension-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-extension-table.directive.html',
})
export class TbExtensionTableDirective {
  readonly entityId = model<any>();
  readonly entityType = input<any>();
  readonly inWidget = input<any>();
  readonly ctx = model<any>();
  readonly entityName = model<any>();

  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            entityId: '=',
            entityType: '@',
            inWidget: '@?',
            ctx: '=?',
            entityName: '='
        };
  controller: any = ExtensionTableController;
  controllerAs: any;
  templateUrl: any = extensionTableTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
