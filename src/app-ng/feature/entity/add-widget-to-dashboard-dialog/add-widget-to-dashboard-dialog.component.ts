import { Component, forwardRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DashboardService } from '../../api/services/dashboard.service';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { ItembufferService } from '../../services/itembuffer.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbDashboardAutocompleteDirective } from '../../components/tb-dashboard-autocomplete/tb-dashboard-autocomplete.directive';

import $ from 'jquery';
const selectTargetStateTemplate = '../../../../app/dashboard/states/select-target-state.tpl.html';
const selectTargetLayoutTemplate = '../../../../app/dashboard/layouts/select-target-layout.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS controller `AddWidgetToDashboardDialogController` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'add-widget-to-dashboard-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatRadioModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbDashboardAutocompleteDirective)],
  templateUrl: './add-widget-to-dashboard-dialog.component.html',
})
export class AddWidgetToDashboardDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly router = inject(Router);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly document = inject(DOCUMENT);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly utils = inject(UtilsService);
  protected readonly itembuffer = inject(ItembufferService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  widget: any;
  dashboardId: any = null;
  addToDashboardType: any = 0;
  newDashboard: any = {};
  openDashboard: any = false;
  theForm: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $state.go — $state.go: this.router.navigate([...])

  constructor() {
    this.widget = this.dialogData.widget;
    this.add = this.add;
    this.cancel = this.cancel;
  }

  cancel = (...rest: any[]): any => {
(this.dialog as any).cancel();
  };

  selectTargetState($event?: any, dashboard?: any, ...rest: any[]): any {
    let vm = this;
    var deferred: any = $q.defer();
    var states: any = dashboard.configuration.states;
    var stateIds: any = Object.keys(states);
    if (stateIds.length > 1) {
(this.dialog as any).show({
        controller: 'SelectTargetStateController',
        controllerAs: 'vm',
        templateUrl: selectTargetStateTemplate,
        parent: $(this.document.body),
        locals: {
            states: states
        },
        fullscreen: true,
        multiple: true,
        targetEvent: $event
    }).then(
        function success(stateId?: any) {
            deferred.resolve(stateId);
        },
        function fail() {
            deferred.reject();
        }
    );

    } else {
        deferred.resolve(stateIds[0]);
    }
    return deferred.promise;
  }

  selectTargetLayout($event?: any, dashboard?: any, targetState?: any, ...rest: any[]): any {
    let vm = this;
    var deferred: any = $q.defer();
    var layouts: any = dashboard.configuration.states[targetState].layouts;
    var layoutIds: any = Object.keys(layouts);
    if (layoutIds.length > 1) {
(this.dialog as any).show({
        controller: 'SelectTargetLayoutController',
        controllerAs: 'vm',
        templateUrl: selectTargetLayoutTemplate,
        parent: $(this.document.body),
        fullscreen: true,
        multiple: true,
        targetEvent: $event
    }).then(
        function success(layoutId?: any) {
            deferred.resolve(layoutId);
        },
        function fail() {
            deferred.reject();
        }
    );
    } else {
        deferred.resolve(layoutIds[0]);
    }
    return deferred.promise;
  }

  add = ($event?: any, ...rest: any[]): any => {
    if (this.addToDashboardType === 0) {
        this.dashboardService.getDashboard(this.dashboardId).then(
            (dashboard?: any) => {
                dashboard = this.dashboardUtils.validateAndUpdateDashboard(dashboard);
                this.selectTargetState($event, dashboard).then(
                    (targetState?: any) => {
                        this.selectTargetLayout($event, dashboard, targetState).then(
                            (targetLayout?: any) => {
                                this.addWidgetToDashboard(dashboard, targetState, targetLayout);
                            }
                        );
                   }
                );
            },
            function fail() {}
        );
    } else {
        this.addWidgetToDashboard(this.newDashboard, 'default', 'main');
    }

  };

  addWidgetToDashboard(theDashboard?: any, targetState?: any, targetLayout?: any, ...rest: any[]): any {
    var aliasesInfo: any = {
        datasourceAliases: {},
        targetDeviceAliases: {}
    };
    aliasesInfo.datasourceAliases[0] = {
        alias: this.dialogData.entityName,
        filter: this.dashboardUtils.createSingleEntityFilter(this.dialogData.entityType, this.dialogData.entityId)
    };
    this.itembuffer.addWidgetToDashboard(theDashboard, targetState, targetLayout, this.widget, aliasesInfo, null, 48, null, -1, -1).then(
        (theDashboard?: any) => {
            this.dashboardService.saveDashboard(theDashboard).then(
                (dashboard?: any) => {
                    this.theForm.$setPristine();
(this.dialog as any).hide();
                    if (this.openDashboard) {
                        var stateParams: any = {
                            dashboardId: dashboard.id.id
                        }
                        var stateIds: any = Object.keys(dashboard.configuration.states);
                        var stateIndex: any = stateIds.indexOf(targetState);
                        if (stateIndex > 0) {
                            stateParams.state = this.utils.objToBase64([ {id: targetState, params: {}} ]);
                        }
(this.router as any).go('home.dashboards.dashboard', stateParams);
                    }
                }
            );
        }
    );
  }
}
