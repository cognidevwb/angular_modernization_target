import { Component, inject } from '@angular/core';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $filter: any;
declare let $scope: any;

/**
 * Ported from the AngularJS controller `DashboardStateDialogController` (module `thingsboard.dashboard.states`) in src/app/dashboard/states/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'dashboard-state-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule],
  templateUrl: './dashboard-state-dialog.component.html',
})
export class DashboardStateDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): template: 3 × ng-message left in place
  // TODO(port): template: 2 × ng-messages left in place

  isAdd: any;
  allStates: any;
  state: any;
  stateIdTouched: any = false;
  prevStateId: any;
  theForm: any;

  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    let vm = this;
    this.isAdd = this.dialogData.isAdd;
    this.allStates = this.dialogData.allStates;
    this.state = this.dialogData.state;
    if (this.isAdd) {
        this.state = this.dashboardUtils.createDefaultState('', false);
        this.state.id = '';
        this.prevStateId = '';
    } else {
        this.state = this.dialogData.state;
        this.prevStateId = this.state.id;
    }
    this.cancel = this.cancel;
    this.save = this.save;
    $scope.$watch("vm.state.name", (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal) && this.state.name != null) {
            this.checkStateName();
        }
    });
    $scope.$watch("vm.state.id", (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal) && this.state.id != null) {
            this.checkStateId();
        }
    });
  }

  checkStateName(...rest: any[]): any {
    if (!this.stateIdTouched && this.isAdd) {
        this.state.id = this.state.name.toLowerCase().replace(/\W/g,"_");
    }
  }

  checkStateId(...rest: any[]): any {
    var result: any = $filter('filter')(this.allStates, {id: this.state.id}, true);
    if (result && result.length && result[0].id !== this.prevStateId) {
        this.theForm.stateId.$setValidity('stateExists', false);
    } else {
        this.theForm.stateId.$setValidity('stateExists', true);
    }
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  save = (...rest: any[]): any => {
    this.theForm.$setPristine();
    this.state.id = this.state.id.trim();
    this.dialog.hide(this.state);
  };
}
