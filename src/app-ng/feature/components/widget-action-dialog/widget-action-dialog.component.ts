import { Component, DoCheck, forwardRef, inject } from '@angular/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbMaterialIconSelectDirective } from '../tb-material-icon-select/tb-material-icon-select.directive';
import { TbDashboardAutocompleteDirective } from '../tb-dashboard-autocomplete/tb-dashboard-autocomplete.directive';
import { TbJsFuncDirective } from '../tb-js-func/tb-js-func.directive';
import { TbCustomActionPrettyEditorDirective } from '../tb-custom-action-pretty-editor/tb-custom-action-pretty-editor.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

import { $q } from '../../../core/q';
import { isEqual } from 'lodash-es';

/**
 * Ported from the AngularJS controller `WidgetActionDialogController` (module `thingsboard.directives.widgetActions`) in src/app/components/widget/action/manage-widget-actions.directive.js:49.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'widget-action-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatSelectModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbMaterialIconSelectDirective), forwardRef(() => TbDashboardAutocompleteDirective), forwardRef(() => TbJsFuncDirective), forwardRef(() => TbCustomActionPrettyEditorDirective)],
  templateUrl: './widget-action-dialog.component.html',
})
export class WidgetActionDialogComponent implements DoCheck {
  protected readonly rootScope = injectRoot(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly typesRef: any = types;
  protected readonly toast = inject(ToastService);
  protected readonly utils = inject(UtilsService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 5 × ng-message left in place
  // TODO(port): template: 4 × ng-messages left in place

  types: any;
  isAdd: any;
  fetchDashboardStates: any;
  actionSources: any;
  widgetActions: any;
  targetDashboardStateSearchText: any = '';
  selectedDashboardStateIds: any = [];
  action: any;
  theForm: any;
  item: any;

  private prevActionName: any;
  private prevActionSourceId: any;
  private prevActionTargetDashboardId: any;
  private prevActionType: any;

  constructor() {
    let vm = this;
    this.types = this.typesRef;
    this.isAdd = this.dialogData.isAdd;
    this.fetchDashboardStates = this.dialogData.fetchDashboardStates;
    this.actionSources = this.dialogData.actionSources;
    this.widgetActions = this.dialogData.widgetActions;
    if (this.isAdd) {
        this.action = {
            id: this.utils.guid()
        };
    } else {
        this.action = this.dialogData.action;
    }
    this.actionSourceName = this.actionSourceName;
    this.dashboardStateSearch = this.dashboardStateSearch;
    this.cancel = this.cancel;
    this.save = this.save;
    this.prevActionName = this.action ? this.action.name : undefined;
    this.prevActionSourceId = this.action ? this.action.actionSourceId : undefined;
    this.prevActionTargetDashboardId = this.action ? this.action.targetDashboardId : undefined;
    this.prevActionType = this.action ? this.action.type : undefined;
  }

  ngDoCheck(): void {
    const newName = this.action ? this.action.name : undefined;
    if (!isEqual(newName, this.prevActionName)) {
        this.prevActionName = newName;
        if (this.action.name != null) {
            this.checkActionName();
        }
    }
    const newSourceId = this.action ? this.action.actionSourceId : undefined;
    if (!isEqual(newSourceId, this.prevActionSourceId)) {
        this.prevActionSourceId = newSourceId;
        if (this.action.actionSourceId != null) {
            this.checkActionName();
        }
    }
    const newTargetDashboardId = this.action ? this.action.targetDashboardId : undefined;
    if (!isEqual(newTargetDashboardId, this.prevActionTargetDashboardId)) {
        this.prevActionTargetDashboardId = newTargetDashboardId;
        this.selectedDashboardStateIds = [];
        if (this.action.targetDashboardId) {
            this.dashboardService.getDashboard(this.action.targetDashboardId).then(
                (dashboard?: any) => {
                    dashboard = this.dashboardUtils.validateAndUpdateDashboard(dashboard);
                    var states: any = dashboard.configuration.states;
                    this.selectedDashboardStateIds = Object.keys(states);
                }
            );
        }
    }
    const newType = this.action ? this.action.type : undefined;
    if (!isEqual(newType, this.prevActionType)) {
        this.prevActionType = newType;
        if (newType) {
            switch (newType) {
                case this.types.widgetActionTypes.openDashboardState.value:
                case this.types.widgetActionTypes.updateDashboardState.value:
                case this.types.widgetActionTypes.openDashboard.value:
                    if ((this.action.setEntityId === undefined)) {
                        this.action.setEntityId = true;
                    }
                    break;
            }
        }
    }
  }

  targetDashboardStateSearchTextChanged(...rest: any[]): any {
      }

  checkActionName(...rest: any[]): any {
    var actionNameIsUnique: any = true;
    if (this.action.actionSourceId && this.action.name) {
        var sourceActions: any = this.widgetActions[this.action.actionSourceId];
        if (sourceActions) {
            var result: any = sourceActions.filter((item: any) => item.name === this.action.name);
            if (result && result.length && result[0].id !== this.action.id) {
                actionNameIsUnique = false;
            }
        }
    }
    this.theForm.name.$setValidity('actionNameNotUnique', actionNameIsUnique);
  }

  actionSourceName = (actionSource?: any, ...rest: any[]): any => {
    if (actionSource) {
        return this.utils.customTranslation(actionSource.name, actionSource.name);
    } else {
        return '';
    }
    return undefined;
  };

  dashboardStateSearch = (query?: any, ...rest: any[]): any => {
    if (this.action.type == this.types.widgetActionTypes.openDashboard.value) {
        var deferred: any = $q.defer();
        var result: any = query ? this.selectedDashboardStateIds.filter(
            this.createFilterForDashboardState(query)) : this.selectedDashboardStateIds;
        if (result && result.length) {
            deferred.resolve(result);
        } else {
            deferred.resolve([query]);
        }
        return deferred.promise;
    } else {
        return this.fetchDashboardStates?.(query);
    }
    return undefined;
  };

  createFilterForDashboardState(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = query != null ? query.toLowerCase() : query;
    return function filterFn(stateId?: any) {
        return (stateId.toLowerCase().indexOf(lowercaseQuery) === 0);
    };
  }

  cleanupAction(action?: any, ...rest: any[]): any {
    var result: any = {};
    result.id = action.id;
    result.actionSourceId = action.actionSourceId;
    result.name = action.name;
    result.icon = action.icon;
    result.type = action.type;
    switch (action.type) {
        case this.types.widgetActionTypes.openDashboardState.value:
        case this.types.widgetActionTypes.updateDashboardState.value:
            result.targetDashboardStateId = action.targetDashboardStateId;
            result.openRightLayout = action.openRightLayout;
            result.setEntityId = action.setEntityId;
            result.stateEntityParamName = action.stateEntityParamName;
            break;
        case this.types.widgetActionTypes.openDashboard.value:
            result.targetDashboardId = action.targetDashboardId;
            result.targetDashboardStateId = action.targetDashboardStateId;
            result.setEntityId = action.setEntityId;
            result.stateEntityParamName = action.stateEntityParamName;
            break;
        case this.types.widgetActionTypes.custom.value:
            result.customFunction = action.customFunction;
            break;
        case this.types.widgetActionTypes.customPretty.value:
            result.customResources = action.customResources;
            result.customHtml = action.customHtml;
            result.customCss = action.customCss;
            result.customFunction = action.customFunction;
            break;
    }
    return result;
  }

  cancel = (...rest: any[]): any => {
(this.dialog as any).cancel();
  };

  save = (...rest: any[]): any => {
    this.theForm.$setPristine();
(this.dialog as any).hide(this.cleanupAction(this.action));
  };

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
