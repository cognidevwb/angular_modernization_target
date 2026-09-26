import { Component, ComponentRef, DestroyRef, effect, inject, model, reflectComponentType, Type, untracked, viewChild, ViewContainerRef } from '@angular/core';
import { StatesControllerService } from '../services/states-controller.service';

/**
 * Ported from the AngularJS directive `tbStatesComponent` (module `thingsboard.dashboard.states`) in src/app/dashboard/states/index.js:22.
 * The legacy link compiled the registered states controller's template into the element at run time;
 * here the registered controller is a component, created into the outlet whenever `statesControllerId` changes.
 */
@Component({
  selector: 'tb-states-component',
  standalone: true,
  template: '<ng-container #outlet></ng-container>',
})
export class TbStatesComponentDirective {
  readonly statesControllerId = model<any>();
  readonly dashboardCtrl = model<any>();
  readonly states = model<any>();

  protected readonly statesControllerService = inject(StatesControllerService);
  protected readonly destroyRef = inject(DestroyRef);
  private readonly outlet = viewChild('outlet', { read: ViewContainerRef });

  statesController: any;
  private componentRef?: ComponentRef<any>;
  private createdFor: any;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.destroyStateController();
    });
    effect(() => {
      const dashboardCtrl = this.dashboardCtrl();
      if (dashboardCtrl && dashboardCtrl.dashboardCtx) {
        untracked(() => this.init());
      }
    });
    effect(() => {
      const outlet = this.outlet();
      const statesControllerId = this.statesControllerId();
      if (outlet && statesControllerId && statesControllerId !== this.createdFor) {
        untracked(() => this.createStateController(outlet, statesControllerId));
      }
    });
    effect(() => {
      const states = this.states();
      if (this.statesController) {
        untracked(() => this.setControllerProperty('states', states));
      }
    });
  }

  private createStateController(outlet: ViewContainerRef, statesControllerId: any): void {
    if (this.statesController) {
      this.destroyStateController();
    }
    let statesControllerInfo: any = this.statesControllerService.getStateController(statesControllerId);
    if (!statesControllerInfo) {
      //fallback to default
      statesControllerInfo = this.statesControllerService.getStateController('default');
    }
    const preservedState: any = this.statesControllerService.withdrawStateControllerState(statesControllerId);
    this.createdFor = statesControllerId;
    const controller: Type<any> = statesControllerInfo.controller;
    if (!reflectComponentType(controller)) {
      console.error('tb-states-component: the states controller "' + statesControllerId + '" is not a component');
      return;
    }
    this.componentRef = outlet.createComponent(controller);
    this.statesController = this.componentRef.instance;
    this.setControllerProperty('preservedState', preservedState);
    this.setControllerProperty('dashboardCtrl', this.dashboardCtrl());
    this.setControllerProperty('states', this.states());
  }

  /** Sets a declared input through the ref (signal inputs), anything else as a plain property. */
  private setControllerProperty(name: string, value: any): void {
    if (!this.componentRef) {
      return;
    }
    const mirror = reflectComponentType(this.componentRef.componentType);
    if (mirror && mirror.inputs.some((i) => i.templateName === name)) {
      this.componentRef.setInput(name, value);
    } else {
      this.statesController[name] = value;
    }
  }

  destroyStateController(): void {
    if (this.statesController && typeof this.statesController.$onDestroy === 'function') {
      this.statesController.$onDestroy();
    }
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = undefined;
    }
    this.statesController = undefined;
    this.createdFor = undefined;
  }

  init(): void {
    const stateController: any = this.dashboardCtrl().dashboardCtx.stateController;

    stateController.openState = (id?: any, params?: any, openRightLayout?: any) => {
      if (this.statesController) {
        this.statesController.openState(id, params, openRightLayout);
      }
    };

    stateController.updateState = (id?: any, params?: any, openRightLayout?: any) => {
      if (this.statesController) {
        this.statesController.updateState(id, params, openRightLayout);
      }
    };

    stateController.resetState = () => {
      if (this.statesController) {
        this.statesController.resetState();
      }
    };

    stateController.preserveState = () => {
      if (this.statesController) {
        const state: any = this.statesController.getStateObject();
        this.statesControllerService.preserveStateControllerState(this.statesControllerId(), state);
      }
    };

    stateController.cleanupPreservedStates = () => {
      this.statesControllerService.cleanupPreservedStates();
    };

    stateController.navigatePrevState = (index?: any) => {
      if (this.statesController) {
        this.statesController.navigatePrevState(index);
      }
    };

    stateController.getStateId = () => {
      return this.statesController ? this.statesController.getStateId() : '';
    };

    stateController.getStateIndex = () => {
      return this.statesController ? this.statesController.getStateIndex() : -1;
    };

    stateController.getStateIdAtIndex = (index?: any) => {
      return this.statesController ? this.statesController.getStateIdAtIndex(index) : '';
    };

    stateController.getStateParams = () => {
      return this.statesController ? this.statesController.getStateParams() : {};
    };

    stateController.getStateParamsByStateId = (id?: any) => {
      return this.statesController ? this.statesController.getStateParamsByStateId(id) : null;
    };

    stateController.getEntityId = (entityParamName?: any) => {
      return this.statesController ? this.statesController.getEntityId(entityParamName) : null;
    };
  }
}
