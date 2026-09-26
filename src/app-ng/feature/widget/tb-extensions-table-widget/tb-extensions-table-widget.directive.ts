import { Component, forwardRef, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TbExtensionTableDirective } from '../../extension/tb-extension-table/tb-extension-table.directive';
import { MatTabsModule } from '@angular/material/tabs';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

// Helpers at the legacy file's top level, beside the registration (as written).
function ExtensionsTableWidgetController(this: any, utils?: any) {
    var vm: any = this;
    const translate = inject(TranslateService);

    vm.datasources = null;
    vm.tabsHidden = false;
    vm.events$ = new Subject<{ name: string; payload?: any }>();

    var eventsSubscription = vm.events$.subscribe(function(event: any) {
        if (event.name === 'filterMode') {
            vm.tabsHidden = event.payload;
        } else if (event.name === 'selectedExtensions') {
            vm.tabsHidden = event.payload;
        }
    });

    vm.ngOnDestroy = function() {
        eventsSubscription.unsubscribe();
    };

    vm.ngOnChanges = function() {
        if (vm.ctx && vm.ctx.defaultSubscription) {
            vm.settings = vm.ctx.settings;
            vm.subscription = vm.ctx.defaultSubscription;
            vm.datasources = vm.subscription.datasources;
            initializeConfig();
            updateDatasources();
        }
    };

    function initializeConfig() {

        if (vm.settings.extensionsTitle && vm.settings.extensionsTitle.length) {
            vm.extensionsTitle = utils.customTranslation(vm.settings.extensionsTitle, vm.settings.extensionsTitle);
        } else {
            vm.extensionsTitle = translate.instant('extension.extensions');
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
            vm.events$.next({ name: "showSearch", payload: vm.selectedSource });
        },
        icon: "search"
    };

    vm.refreshAction = {
        name: "action.refresh",
        show: true,
        onAction: function() {
            vm.events$.next({ name: "refreshExtensions", payload: vm.selectedSource });
        },
        icon: "refresh"
    };

    vm.addAction = {
        name: "action.add",
        show: true,
        onAction: function() {
            vm.events$.next({ name: "addExtension", payload: vm.selectedSource });
        },
        icon: "add"
    };

    vm.exportExtensionsAction = {
        name: "extension.export-extensions-configuration",
        show: true,
        onAction: function() {
            vm.events$.next({ name: "exportExtensions", payload: vm.selectedSource });
        },
        icon: "file_download"
    };

    vm.importExtensionsAction = {
        name: "extension.import-extensions-configuration",
        show: true,
        onAction: function() {
            vm.events$.next({ name: "importExtensions", payload: vm.selectedSource });
        },
        icon: "file_upload"
    };
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

  datasources: any = null;
  tabsHidden: any = false;
}
