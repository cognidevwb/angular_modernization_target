import { Component, Type, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { goState } from '../../../state-paths';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbWidgetsBundleDirective } from '../tb-widgets-bundle/tb-widgets-bundle.directive';
import { WidgetsBundleCardComponent } from './widgets-bundle-card.component';
import { AddWidgetsBundleDialogComponent } from './add-widgets-bundle-dialog.component';

/**
 * Ported from the AngularJS controller `WidgetsBundleController` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 */
@Component({
  selector: 'widgets-bundle',
  standalone: true,
  imports: [TbGridDirective, TbWidgetsBundleDirective],
  templateUrl: './widgets-bundle.component.html',
})
export class WidgetsBundleComponent {
  protected readonly widgetService = inject(WidgetService);
  protected readonly userService = inject(UserService);
  protected readonly importExport = inject(ImportExportService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;

  readonly widgetsBundleCard: Type<unknown> = WidgetsBundleCardComponent;
  readonly addWidgetsBundleDialog: Type<unknown> = AddWidgetsBundleDialogComponent;

  protected widgetsBundleActionsList: any;
  protected widgetsBundleAddItemActionsList: any;
  types: any;
  widgetsBundleGridConfig: GridConfig;
  grid!: TbGridDirective;

  constructor() {
    this.widgetsBundleActionsList = [
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.exportWidgetsBundle($event, item);
            },
            name: (...rest: any[]) => { this.translate.instant('action.export') },
            details: (...rest: any[]) => { return this.translate.instant('widgets-bundle.export') },
            icon: "file_download"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.openItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('widgets-bundle.details') },
            details: (...rest: any[]) => { return this.translate.instant('widgets-bundle.widgets-bundle-details') },
            icon: "edit"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.deleteItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.delete') },
            details: (...rest: any[]) => { return this.translate.instant('widgets-bundle.delete') },
            icon: "delete",
            isEnabled: this.isWidgetsBundleEditable
        }
   ];
    this.widgetsBundleAddItemActionsList = [
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.grid.addItem($event);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.create') },
            details: (...rest: any[]) => { return this.translate.instant('widgets-bundle.create-new-widgets-bundle') },
            icon: "insert_drive_file"
        },
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.importExport.importWidgetsBundle($event).then(
                    () => {
                        this.grid.refreshList();
                    }
                );
            },
            name: (...rest: any[]) => { return this.translate.instant('action.import') },
            details: (...rest: any[]) => { return this.translate.instant('widgets-bundle.import') },
            icon: "file_upload"
        }
    ];
    this.types = this.typesRef;
    this.widgetsBundleGridConfig = {

        refreshParamsFunc: null,

        deleteItemTitleFunc: this.deleteWidgetsBundleTitle,
        deleteItemContentFunc: this.deleteWidgetsBundleText,
        deleteItemsTitleFunc: this.deleteWidgetsBundlesTitle,
        deleteItemsActionTitleFunc: this.deleteWidgetsBundlesActionTitle,
        deleteItemsContentFunc: this.deleteWidgetsBundlesText,

        fetchItemsFunc: this.fetchWidgetsBundles,
        saveItemFunc: this.saveWidgetsBundle,
        clickItemFunc: this.openWidgetsBundle,
        deleteItemFunc: this.deleteWidgetsBundle,

        getItemTitleFunc: this.getWidgetsBundleTitle,
        parentCtl: this,

        actionsList: this.widgetsBundleActionsList,
        addItemActions: this.widgetsBundleAddItemActionsList,

        onGridInited: this.gridInited,

        addItemText: (...rest: any[]) => { return this.translate.instant('widgets-bundle.add-widgets-bundle-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('widgets-bundle.no-widgets-bundles-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('widgets-bundle.widgets-bundle-details') },
        isSelectionEnabled: this.isWidgetsBundleEditable,
        isDetailsReadOnly: (widgetsBundle?: any, ...rest: any[]) => {
             return !this.isWidgetsBundleEditable(widgetsBundle);
        }

    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
        this.widgetsBundleGridConfig.items = items;
    }
    const topIndex = Number(this.route.snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
        this.widgetsBundleGridConfig.topIndex = topIndex;
    }
  }

  deleteWidgetsBundleTitle = (widgetsBundle?: any, ...rest: any[]): any => {
    return this.translate.instant('widgets-bundle.delete-widgets-bundle-title', {widgetsBundleTitle: widgetsBundle.title});
  };

  deleteWidgetsBundleText = (...rest: any[]): any => {
    return this.translate.instant('widgets-bundle.delete-widgets-bundle-text');
  };

  deleteWidgetsBundlesTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('widgets-bundle.delete-widgets-bundles-title', {count: selectedCount});
  };

  deleteWidgetsBundlesActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('widgets-bundle.delete-widgets-bundles-action-title', {count: selectedCount});
  };

  deleteWidgetsBundlesText = (...rest: any[]): any => {
    return this.translate.instant('widgets-bundle.delete-widgets-bundles-text');
  };

  gridInited = (grid: TbGridDirective): void => {
    this.grid = grid;
  };

  fetchWidgetsBundles = (pageLink?: any, ...rest: any[]): any => {
    return this.widgetService.getAllWidgetsBundlesByPageLink(pageLink);
  };

  saveWidgetsBundle = (widgetsBundle?: any, ...rest: any[]): any => {
    return this.widgetService.saveWidgetsBundle(widgetsBundle);
  };

  deleteWidgetsBundle = (widgetsBundleId?: any, ...rest: any[]): any => {
    return this.widgetService.deleteWidgetsBundle(widgetsBundleId);
  };

  getWidgetsBundleTitle = (widgetsBundle?: any, ...rest: any[]): any => {
    return widgetsBundle ? widgetsBundle.title : '';
  };

  isWidgetsBundleEditable = (widgetsBundle?: any, ...rest: any[]): any => {
    if (this.userService.getAuthority() === 'TENANT_ADMIN') {
        return widgetsBundle && widgetsBundle.tenantId.id != this.typesRef.id.nullUid;
    } else {
        return this.userService.getAuthority() === 'SYS_ADMIN';
    }
    return undefined;
  };

  exportWidgetsBundle = ($event?: any, widgetsBundle?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    this.importExport.exportWidgetsBundle(widgetsBundle.id.id);
  };

  openWidgetsBundle = ($event?: any, widgetsBundle?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    goState(this.router, 'home.widgets-bundles.widget-types', {widgetsBundleId: widgetsBundle.id.id});
  };
}
