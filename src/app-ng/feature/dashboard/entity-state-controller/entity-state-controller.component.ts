import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { EntityService } from '../../api/services/entity.service';
import { $q } from '../../../core/q';
import { StatesControllerBase } from '../services/states-controller-base';

/**
 * Ported from the AngularJS controller `EntityStateController` + its template
 * (src/app/dashboard/states/entity-state-controller.js / .tpl.html): a stack of states,
 * each naming the entity it was opened for, shown as a breadcrumb (a select on mobile).
 */
@Component({
  selector: 'tb-entity-state-controller',
  standalone: true,
  imports: [TranslatePipe, FormsModule, MatSelectModule],
  template: `
    @if (stateObject) {
      <div class="entity-state-controller" layout="row" layout-align="start center">
        @if (!dashboardCtrl.isMobile || stateObject.length === 1) {
          <div layout="row" layout-align="start center">
            @for (state of stateObject; track $index; let last = $last) {
              <span class="state-entry" [style.fontWeight]="last ? 'bold' : 'normal'" [style.cursor]="last ? 'default' : 'pointer'" (click)="navigatePrevState($index)">
                {{ getStateName($index) }}
                <span class="state-divider" [hidden]="last"> &gt; </span>
              </span>
            }
          </div>
        }
        @if (dashboardCtrl.isMobile && stateObject.length > 1) {
          <mat-select [attr.aria-label]="'dashboard.state' | translate" [(ngModel)]="selectedStateIndex" (ngModelChange)="navigatePrevState($event)">
            @for (state of stateObject; track $index) {
              <mat-option [value]="$index">
                {{ getStateName($index) }}
              </mat-option>
            }
          </mat-select>
        }
      </div>
    }
  `,
})
export class EntityStateControllerComponent extends StatesControllerBase {
  protected readonly entityService = inject(EntityService);

  selectedStateIndex = -1;

  openState(id?: any, params?: any, openRightLayout?: any): void {
    if (this.states && this.states[id]) {
      this.resolveEntity(params).then(() => {
        const newState = {
          id: id,
          params: params,
        };
        //append new state
        this.stateObject.push(newState);
        this.selectedStateIndex = this.stateObject.length - 1;
        this.gotoState(this.stateObject[this.stateObject.length - 1].id, true, openRightLayout);
        this.skipStateChange = true;
      });
    }
  }

  updateState(id?: any, params?: any, openRightLayout?: any): void {
    if (!id) {
      id = this.getStateId();
    }
    if (this.states && this.states[id]) {
      this.resolveEntity(params).then(() => {
        const newState = {
          id: id,
          params: params,
        };
        //replace with new state
        this.stateObject[this.stateObject.length - 1] = newState;
        this.gotoState(this.stateObject[this.stateObject.length - 1].id, true, openRightLayout);
        this.skipStateChange = true;
      });
    }
  }

  /** Also what the mobile select does when a state is picked (the legacy `selectedStateIndex` watch). */
  navigatePrevState(index?: any): void {
    if (index < this.stateObject.length - 1) {
      this.stateObject.splice(index + 1, this.stateObject.length - index - 1);
      this.selectedStateIndex = this.stateObject.length - 1;
      this.gotoState(this.stateObject[this.stateObject.length - 1].id, true);
      this.skipStateChange = true;
    }
  }

  getEntityId(entityParamName?: any): any {
    const stateParams = this.getStateParams();
    if (!entityParamName || !entityParamName.length) {
      return stateParams.entityId;
    } else if (stateParams[entityParamName]) {
      return stateParams[entityParamName].entityId;
    }
    return null;
  }

  getStateName(index?: any): any {
    let result = '';
    if (this.stateObject[index]) {
      let stateName = this.states[this.stateObject[index].id].name;
      stateName = this.utils.customTranslation(stateName, stateName);
      const params = this.stateObject[index].params;

      const entityName = params && params.entityName ? params.entityName : '';
      const entityLabel = params && params.entityLabel ? params.entityLabel : entityName;

      result = this.utils.insertVariable(stateName, 'entityName', entityName);
      result = this.utils.insertVariable(result, 'entityLabel', entityLabel);
      for (const prop in params) {
        if (params[prop] && params[prop].entityName) {
          result = this.utils.insertVariable(result, prop + ':entityName', params[prop].entityName);
        }
        if (params[prop] && params[prop].entityLabel) {
          result = this.utils.insertVariable(result, prop + ':entityLabel', params[prop].entityLabel);
        }
      }
    }
    return result;
  }

  private resolveEntity(params: any): Promise<any> {
    const deferred = $q.defer();
    if (params && params.targetEntityParamName) {
      params = params[params.targetEntityParamName];
    }
    if (params && params.entityId && params.entityId.id && params.entityId.entityType) {
      if (this.isEntityResolved(params)) {
        deferred.resolve();
      } else {
        this.entityService.getEntity(params.entityId.entityType, params.entityId.id, {
          ignoreLoading: true,
          ignoreErrors: true,
        }).then(
          (entity: any) => {
            params.entityName = entity.name;
            params.entityLabel = entity.label;
            deferred.resolve();
          },
          () => {
            deferred.reject();
          }
        );
      }
    } else {
      deferred.resolve();
    }
    return deferred.promise;
  }

  private isEntityResolved(params: any): boolean {
    if (!params.entityName || !params.entityName.length) {
      return false;
    }
    return true;
  }

  protected parseState(stateBase64: any): any {
    return this.decodeState(stateBase64, false);
  }

  protected init(): void {
    if (this.preservedState) {
      this.stateObject = this.preservedState;
      this.selectedStateIndex = this.stateObject.length - 1;
      this.gotoState(this.stateObject[this.stateObject.length - 1].id, true);
    } else {
      const initialState = this.stateParam;
      this.stateObject = this.parseState(initialState);
      this.selectedStateIndex = this.stateObject.length - 1;
      this.gotoState(this.stateObject[this.stateObject.length - 1].id, false);
    }

    setTimeout(() => {
      this.watchStateParam((currentState) => {
        this.stateObject = this.parseState(currentState);
      });

      this.watch(() => this.dashboardCtrl.dashboardCtx.state, () => {
        if (this.stateObject[this.stateObject.length - 1].id !== this.dashboardCtrl.dashboardCtx.state) {
          this.stateObject[this.stateObject.length - 1].id = this.dashboardCtrl.dashboardCtx.state;
          this.updateLocation();
          this.skipStateChange = true;
        }
      });

      this.watch(() => this.stateObject, (newVal, prevVal) => {
        if (newVal !== prevVal && newVal) {
          if (this.skipStateChange) {
            this.skipStateChange = false;
          } else {
            this.selectedStateIndex = this.stateObject.length - 1;
            this.gotoState(this.stateObject[this.stateObject.length - 1].id, true);
          }
        }
      }, true);
    });
  }

  protected gotoState(stateId: any, update: any, openRightLayout?: any): void {
    this.dashboardCtrl.openDashboardState(stateId, openRightLayout);
    if (update) {
      this.updateLocation();
    }
  }

  private updateLocation(): void {
    if (this.stateObject[this.stateObject.length - 1].id) {
      if (this.isDefaultState()) {
        this.setLocationState(null);
      } else {
        this.setLocationState(this.utils.objToBase64(this.stateObject));
      }
    }
  }

  private isDefaultState(): boolean {
    if (this.stateObject.length == 1) {
      const state = this.stateObject[0];
      const rootStateId = this.dashboardUtils.getRootStateId(this.states);
      if (state.id == rootStateId && (!state.params || this.isEmpty(state.params))) {
        return true;
      }
    }
    return false;
  }

  private isEmpty(map: any): boolean {
    for (const key in map) {
      return !Object.prototype.hasOwnProperty.call(map, key);
    }
    return true;
  }
}
