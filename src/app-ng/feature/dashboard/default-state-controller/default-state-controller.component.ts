import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { StatesControllerBase } from '../services/states-controller-base';

/**
 * Ported from the AngularJS controller `DefaultStateController` + its template
 * (src/app/dashboard/states/default-state-controller.js / .tpl.html): one state at a time,
 * picked from a select when the dashboard has more than one state.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-default-state-controller',
  standalone: true,
  imports: [TranslatePipe, FormsModule, MatSelectModule],
  template: `
    @if (displayStateSelection() && stateObject) {
      <mat-select class="default-state-controller" [attr.aria-label]="'dashboard.state' | translate" [(ngModel)]="stateObject[0].id">
        @for (stateId of stateIds(); track stateId) {
          <mat-option [value]="stateId">
            {{ getStateName(stateId, states[stateId]) }}
          </mat-option>
        }
      </mat-select>
    }
  `,
})
export class DefaultStateControllerComponent extends StatesControllerBase {
  openState(id?: any, params?: any, openRightLayout?: any): void {
    if (this.states && this.states[id]) {
      if (!params) {
        params = {};
      }
      const newState = {
        id: id,
        params: params,
      };
      //append new state
      this.stateObject[0] = newState;
      this.gotoState(this.stateObject[0].id, true, openRightLayout);
      this.skipStateChange = true;
    }
  }

  updateState(id?: any, params?: any, openRightLayout?: any): void {
    if (!id) {
      id = this.getStateId();
    }
    if (this.states && this.states[id]) {
      if (!params) {
        params = {};
      }
      const newState = {
        id: id,
        params: params,
      };
      //replace with new state
      this.stateObject[0] = newState;
      this.gotoState(this.stateObject[0].id, true, openRightLayout);
      this.skipStateChange = true;
    }
  }

  navigatePrevState(index?: any): void {
    if (index < this.stateObject.length - 1) {
      this.stateObject.splice(index + 1, this.stateObject.length - index - 1);
      this.gotoState(this.stateObject[this.stateObject.length - 1].id, true);
      this.skipStateChange = true;
    }
  }

  getEntityId(): any {
    return null;
  }

  getStateName(id?: any, state?: any): any {
    return this.utils.customTranslation(state.name, id);
  }

  /** The state ids in the order `ng-repeat="(stateId, state) in vm.states"` listed them. */
  stateIds(): string[] {
    return this.states ? Object.keys(this.states) : [];
  }

  displayStateSelection(): boolean {
    return this.states && Object.keys(this.states).length > 1;
  }

  protected parseState(stateBase64: any): any {
    return this.decodeState(stateBase64, true);
  }

  protected init(): void {
    if (this.preservedState) {
      this.stateObject = this.preservedState;
      this.gotoState(this.stateObject[0].id, true);
    } else {
      const initialState = this.stateParam;
      this.stateObject = this.parseState(initialState);
      this.gotoState(this.stateObject[0].id, false);
    }

    setTimeout(() => {
      this.watchStateParam((currentState) => {
        this.stateObject = this.parseState(currentState);
      });

      this.watch(() => this.dashboardCtrl.dashboardCtx.state, () => {
        if (this.stateObject[0].id !== this.dashboardCtrl.dashboardCtx.state) {
          this.stateObject[0].id = this.dashboardCtrl.dashboardCtx.state;
          this.updateLocation();
          this.skipStateChange = true;
        }
      });
      this.watch(() => this.stateObject, (newVal, prevVal) => {
        if (newVal !== prevVal && newVal) {
          if (this.skipStateChange) {
            this.skipStateChange = false;
          } else {
            this.gotoState(this.stateObject[0].id, true);
          }
        }
      }, true);
    });
  }

  protected gotoState(stateId: any, update: any, openRightLayout?: any): void {
    if (this.dashboardCtrl.dashboardCtx.state != stateId) {
      this.dashboardCtrl.openDashboardState(stateId, openRightLayout);
      if (update) {
        this.updateLocation();
      }
    }
  }

  private updateLocation(): void {
    if (this.stateObject[0].id) {
      this.setLocationState(this.utils.objToBase64(this.stateObject));
    }
  }
}
