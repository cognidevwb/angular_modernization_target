import { Injectable } from '@angular/core';
import { bindMethods } from '../../../bind-methods';
import DefaultStateController from '../../../../app/dashboard/states/default-state-controller';
import EntityStateController from '../../../../app/dashboard/states/entity-state-controller';

/**
 * Ported from the AngularJS factory `statesControllerService` (module `thingsboard.dashboard.states`) in src/app/dashboard/states/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class StatesControllerService {
  private readonly __bound = bindMethods(this);

  private statesControllers: any = {};

  constructor() {
    this.statesControllers['default'] = {
        controller: DefaultStateController
    };
    this.statesControllers['entity'] = {
        controller: EntityStateController
    };
  }

  registerStatesController(id?: any, stateControllerInfo?: any, ...rest: any[]): any {
    this.statesControllers[id] = stateControllerInfo;
  }

  getStateControllers(...rest: any[]): any {
    return this.statesControllers;
  }

  getStateController(id?: any, ...rest: any[]): any {
    return this.statesControllers[id];
  }

  preserveStateControllerState(id?: any, state?: any, ...rest: any[]): any {
    this.statesControllers[id].state = structuredClone(state);
  }

  withdrawStateControllerState(id?: any, ...rest: any[]): any {
    var state: any = this.statesControllers[id].state;
    this.statesControllers[id].state = null;
    return state;
  }

  cleanupPreservedStates(...rest: any[]): any {
    for (var id in this.statesControllers) {
        this.statesControllers[id].state = null;
    }
  }
}
