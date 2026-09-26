import { Component, forwardRef, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TbExtensionTableDirective } from '../../extension/tb-extension-table/tb-extension-table.directive';
import extensionsTableWidgetTemplate from '../../../../app/widget/lib/extensions-table-widget.tpl.html';
import { MatTabsModule } from '@angular/material/tabs';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function ExtensionsTableWidgetController(this: any, $scope?: any, $translate?: any, utils?: any) {
    var vm: any = this;

    vm.datasources = null;
    vm.tabsHidden = false;

    $scope.$watch('vm.ctx', function() {
        if (vm.ctx && vm.ctx.defaultSubscription) {
            vm.settings = vm.ctx.settings;
            vm.subscription = vm.ctx.defaultSubscription;
            vm.datasources = vm.subscription.datasources;
            initializeConfig();
            updateDatasources();
        }
    });

    function initializeConfig() {

        if (vm.settings.extensionsTitle && vm.settings.extensionsTitle.length) {
            vm.extensionsTitle = utils.customTranslation(vm.settings.extensionsTitle, vm.settings.extensionsTitle);
        } else {
            vm.extensionsTitle = $translate.instant('extension.extensions');
        }
        vm.ctx.widgetTitle = vm.extensionsTitle;

        vm.ctx.widgetActions = [vm.importExtensionsAction, vm.exportExtensionsAction, vm.addAction, vm.searchAction, vm.refreshAction];
    }

    function updateDatasources() {

        var datasource: any = vm.datasources[0];
        vm.selectedSource = vm.datasources[0];
        vm.ctx.widgetTitle = utils.createLabelFromDatasource(datasource, vm.extensionsTitle);
    }

    vm.changeSelectedSource = function(source?: any) {
        vm.selectedSource = source;
    };

    vm.searchAction = {
        name: "action.search",
        show: true,
        onAction: function() {
            $scope.$broadcast("showSearch", vm.selectedSource);
        },
        icon: "search"
    };

    vm.refreshAction = {
        name: "action.refresh",
        show: true,
        onAction: function() {
            $scope.$broadcast("refreshExtensions", vm.selectedSource);
        },
        icon: "refresh"
    };

    vm.addAction = {
        name: "action.add",
        show: true,
        onAction: function() {
            $scope.$broadcast("addExtension", vm.selectedSource);
        },
        icon: "add"
    };

    vm.exportExtensionsAction = {
        name: "extension.export-extensions-configuration",
        show: true,
        onAction: function() {
            $scope.$broadcast("exportExtensions", vm.selectedSource);
        },
        icon: "file_download"
    };

    vm.importExtensionsAction = {
        name: "extension.import-extensions-configuration",
        show: true,
        onAction: function() {
            $scope.$broadcast("importExtensions", vm.selectedSource);
        },
        icon: "file_upload"
    };

    $scope.$on("filterMode", function($event?: any, mode?: any) {
        vm.tabsHidden = mode;
    });

    $scope.$on("selectedExtensions", function($event?: any, mode?: any) {
        vm.tabsHidden = mode;
    });
}

/**
 * Ported from the AngularJS directive `tbExtensionsTableWidget` (module `thingsboard.widgets.extensionsTableWidget`) in src/app/widget/lib/extensions-table-widget.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-extensions-table-widget',
  standalone: true,
  imports: [MatTabsModule, CommonModule, forwardRef(() => TbExtensionTableDirective)],
  templateUrl: './tb-extensions-table-widget.directive.html',
})
export class TbExtensionsTableWidgetDirective {
  readonly ctx = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            ctx: '='
        };
  controller: any = ExtensionsTableWidgetController;
  controllerAs: any;
  templateUrl: any = extensionsTableWidgetTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
