import { Component, effect, forwardRef, inject, model, untracked } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetService } from '../../api/services/widget.service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { TbWidgetConfigDirective } from '../../components/tb-widget-config/tb-widget-config.directive';
import { EntityAliasDialogComponent } from '../../entity/entity-alias-dialog/entity-alias-dialog.component';
import { RootState } from '../../../root-state';
import { $q } from '../../../core/q';

/**
 * Ported from the AngularJS directive `tbEditWidget` (src/app/dashboard/edit-widget.directive.js):
 * the widget details panel's editor — the widget config of the widget being edited, with the
 * key/state lookups and alias creation it needs from the dashboard.
 */
@Component({
  selector: 'tb-edit-widget',
  standalone: true,
  imports: [FormsModule, forwardRef(() => TbWidgetConfigDirective)],
  templateUrl: './tb-edit-widget.directive.html',
})
export class TbEditWidgetDirective {
  protected readonly rootScope = inject(RootState);
  readonly dashboard = model<any>();
  readonly aliasController = model<any>();
  readonly widgetEditMode = model<any>();
  readonly widget = model<any>();
  readonly widgetLayout = model<any>();
  readonly theForm = model<any>();

  protected readonly widgetService = inject(WidgetService);
  protected readonly entityService = inject(EntityService);
  protected readonly dialog = inject(MatDialog);

  widgetConfig: any;
  typeParameters: any;
  actionSources: any;
  isDataEnabled: any;
  settingsSchema: any;
  dataKeySettingsSchema: any;
  functionsOnly: any;

  /** The callbacks the widget config calls (the legacy `&` bindings), bound to this editor. */
  readonly fetchEntityKeysFn = (entityAliasId: string, query: string, type: string) => this.fetchEntityKeys(entityAliasId, query, type);
  readonly fetchDashboardStatesFn = (query: string) => this.fetchDashboardStates(query);
  readonly createEntityAliasFn = (event: Event | undefined, alias: string, allowedEntityTypes?: any) =>
    this.createEntityAlias(event, alias, allowedEntityTypes);

  constructor() {
    // `scope.$watch('widget', …)`: load the widget type's schemas for the edited widget
    effect(() => {
      const widget = this.widget();
      untracked(() => {
        if (widget) {
          this.widgetService.getWidgetInfo(widget.bundleAlias, widget.typeAlias, widget.isSystemType).then((widgetInfo?: any) => {
            queueMicrotask(() => this.applyWidgetInfo(widgetInfo));
          });
        }
      });
    });
    // `scope.$watch('widgetLayout', …)`
    effect(() => {
      const widgetLayout = this.widgetLayout();
      untracked(() => {
        if (widgetLayout && this.widgetConfig) {
          this.widgetConfig.layout = widgetLayout;
        }
      });
    });
  }

  private applyWidgetInfo(widgetInfo: any): void {
    this.widgetConfig = {
      config: this.widget().config,
      layout: this.widgetLayout(),
    };
    const settingsSchema: any = widgetInfo.typeSettingsSchema || widgetInfo.settingsSchema;
    const dataKeySettingsSchema: any = widgetInfo.typeDataKeySettingsSchema || widgetInfo.dataKeySettingsSchema;
    this.typeParameters = widgetInfo.typeParameters;
    this.actionSources = widgetInfo.actionSources;
    this.isDataEnabled = !widgetInfo.typeParameters.useCustomDatasources;
    this.settingsSchema = !settingsSchema || settingsSchema === '' ? {} : JSON.parse(settingsSchema);
    this.dataKeySettingsSchema = !dataKeySettingsSchema || dataKeySettingsSchema === '' ? {} : JSON.parse(dataKeySettingsSchema);
    this.functionsOnly = this.dashboard() ? false : true;
    const form = this.theForm();
    if (form && typeof form.$setPristine === 'function') {
      form.$setPristine();
    }
  }

  fetchEntityKeys(entityAliasId?: any, query?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.aliasController().getAliasInfo(entityAliasId).then(
        (aliasInfo?: any) => {
            var entity: any = aliasInfo.currentEntity;
            if (entity) {
                this.entityService.getEntityKeys(entity.entityType, entity.id, query, type, {ignoreLoading: true}).then(
                    (keys?: any) => {
                        deferred.resolve(keys);
                    },
                    () => {
                        deferred.resolve([]);
                    }
                );
            } else {
                deferred.resolve([]);
            }
        },
        () => {
            deferred.resolve([]);
        }
    );
    return deferred.promise;
  }

  fetchDashboardStates(query?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var stateIds: any = Object.keys(this.dashboard().configuration.states);
    var result: any = query ? stateIds.filter(
        this.createFilterForDashboardState(query)) : stateIds;
    if (result && result.length) {
        deferred.resolve(result);
    } else {
        deferred.resolve([query]);
    }
    return deferred.promise;
  }

  createFilterForDashboardState(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = (query ?? '').toLowerCase();
    return function filterFn(stateId?: any) {
        return ((stateId ?? '').toLowerCase().indexOf(lowercaseQuery) === 0);
    };
  }

  createEntityAlias(event?: any, alias?: any, allowedEntityTypes?: any): Promise<any> {
    const singleEntityAlias: any = {id: null, alias: alias, filter: {}};
    return firstValueFrom(this.dialog.open(EntityAliasDialogComponent, {
        data: {
            isAdd: true,
            allowedEntityTypes: allowedEntityTypes,
            entityAliases: this.dashboard().configuration.entityAliases,
            alias: singleEntityAlias
        },
        panelClass: 'tb-dialog'
    }).afterClosed()).then((result?: any) => {
        if (result === undefined) {
            return Promise.reject();
        }
        this.dashboard().configuration.entityAliases[result.id] = result;
        this.aliasController().updateEntityAliases(this.dashboard().configuration.entityAliases);
        return result;
    });
  }
}
