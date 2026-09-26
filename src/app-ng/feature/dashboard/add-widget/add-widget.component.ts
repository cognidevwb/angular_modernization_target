import { Component, forwardRef, inject, ViewChild } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { FormsModule, NgForm } from '@angular/forms';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbWidgetConfigDirective } from '../../components/tb-widget-config/tb-widget-config.directive';

import { firstValueFrom } from 'rxjs';
import { EntityAliasDialogComponent } from '../../entity/entity-alias-dialog/entity-alias-dialog.component';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';

/** The legacy `theForm` as the widget config reads it (`$valid`, `$dirty`, `$setDirty()` …), over the dialog's NgForm. */
class AddWidgetFormState {
  ngForm: NgForm | null = null;
  private dirty = false;

  get $invalid(): boolean {
    return !!this.ngForm?.invalid;
  }

  get $valid(): boolean {
    return !this.$invalid;
  }

  get $dirty(): boolean {
    return this.dirty || !!this.ngForm?.dirty;
  }

  $setDirty(): void {
    this.dirty = true;
  }

  $setPristine(): void {
    this.dirty = false;
    this.ngForm?.form.markAsPristine();
  }
}

/**
 * Ported from the AngularJS controller `AddWidgetController` (src/app/dashboard/add-widget.controller.js):
 * the dialog that configures a new widget before it is added; closes with `{widget}`.
 */
@Component({
  selector: 'add-widget',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbHelpDirective), forwardRef(() => TbWidgetConfigDirective)],
  templateUrl: './add-widget.component.html',
})
export class AddWidgetComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly entityService = inject(EntityService);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogRef = inject(MatDialogRef<AddWidgetComponent>);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  dashboard: any;
  aliasController: any;
  widget: any;
  widgetInfo: any;
  functionsOnly: any = false;
  widgetConfig: any;
  dataKeySettingsSchema: any;
  settingsSchema: any;
  readonly theForm = new AddWidgetFormState();

  @ViewChild('theFormRef')
  set theFormRef(form: NgForm | undefined) {
    this.theForm.ngForm = form ?? null;
  }

  constructor() {
    this.dashboard = this.dialogData.dashboard;
    this.aliasController = this.dialogData.aliasController;
    this.widget = this.dialogData.widget;
    this.widgetInfo = this.dialogData.widgetInfo;
    this.widgetConfig = {
        config: this.widget.config,
        layout: {}
    };
    this.widgetConfig.layout.mobileOrder = this.widget.config.mobileOrder;
    this.widgetConfig.layout.mobileHeight = this.widget.config.mobileHeight;
    const settingsSchema = this.widgetInfo.typeSettingsSchema || this.widgetInfo.settingsSchema;
    const dataKeySettingsSchema = this.widgetInfo.typeDataKeySettingsSchema || this.widgetInfo.dataKeySettingsSchema;
    if (!settingsSchema || settingsSchema === '') {
        this.settingsSchema = {};
    } else {
        this.settingsSchema = JSON.parse(settingsSchema);
    }
    if (!dataKeySettingsSchema || dataKeySettingsSchema === '') {
        this.dataKeySettingsSchema = {};
    } else {
        this.dataKeySettingsSchema = JSON.parse(dataKeySettingsSchema);
    }
  }

  helpLinkIdForWidgetType = (...rest: any[]): any => {
    var link: any = 'widgetsConfig';
    if (this.widget && this.widget.type) {
        switch (this.widget.type) {
            case types.widgetType.timeseries.value: {
                link = 'widgetsConfigTimeseries';
                break;
            }
            case types.widgetType.latest.value: {
                link = 'widgetsConfigLatest';
                break;
            }
            case types.widgetType.rpc.value: {
                link = 'widgetsConfigRpc';
                break;
            }
            case types.widgetType.alarm.value: {
                link = 'widgetsConfigAlarm';
                break;
            }
            case types.widgetType.static.value: {
                link = 'widgetsConfigStatic';
                break;
            }
        }
    }
    return link;
  };

  cancel = (...rest: any[]): any => {
    this.dialogRef.close();
  };

  add = (...rest: any[]): any => {
    if (this.theForm.$valid) {
        this.theForm.$setPristine();
        this.widget.config = this.widgetConfig.config;
        this.widget.config.mobileOrder = this.widgetConfig.layout.mobileOrder;
        this.widget.config.mobileHeight = this.widgetConfig.layout.mobileHeight;
        this.dialogRef.close({widget: this.widget});
    }
  };

  fetchEntityKeys = (entityAliasId?: any, query?: any, type?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    this.aliasController.getAliasInfo(entityAliasId).then(
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
  };

  fetchDashboardStates = (query?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    var stateIds: any = Object.keys(this.dashboard.configuration.states);
    var result: any = query ? stateIds.filter(
        this.createFilterForDashboardState(query)) : stateIds;
    if (result && result.length) {
        deferred.resolve(result);
    } else {
        deferred.resolve([query]);
    }
    return deferred.promise;
  };

  createFilterForDashboardState(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = query.toLowerCase();
    return function filterFn(stateId?: any) {
        return (stateId.toLowerCase().indexOf(lowercaseQuery) === 0);
    };
  }

  createEntityAlias = (event?: any, alias?: any, allowedEntityTypes?: any, ...rest: any[]): any => {
    var singleEntityAlias: any = {id: null, alias: alias, filter: {}};

    return firstValueFrom(this.dialog.open(EntityAliasDialogComponent, {
        data: {
            isAdd: true,
            allowedEntityTypes: allowedEntityTypes,
            entityAliases: this.dashboard.configuration.entityAliases,
            alias: singleEntityAlias
        },
        panelClass: 'tb-dialog'
    }).afterClosed()).then((result?: any) => {
        if (result !== undefined) {
            this.dashboard.configuration.entityAliases[result.id] = result;
            this.aliasController.updateEntityAliases(this.dashboard.configuration.entityAliases);
            return result;
        }
        return Promise.reject();
    });
  };
}
