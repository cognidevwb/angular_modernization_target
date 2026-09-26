import { Component, ComponentRef, inject, model, ViewContainerRef } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { StatesControllerService } from '../services/states-controller.service';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $controller: any;
declare let $templateCache: any;
declare let $scope: any;
declare let scope: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbStatesComponent` (module `thingsboard.dashboard.states`) in src/app/dashboard/states/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-states-component',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbStatesComponentDirective {
  readonly statesControllerId = model<any>();
  readonly dashboardCtrl = model<any>();
  readonly states = model<any>();

  protected readonly statesControllerService = inject(StatesControllerService);
  protected readonly element = inject(ElementRef);
  protected readonly viewContainerRef = inject(ViewContainerRef);
  protected readonly destroyRef = inject(DestroyRef);

  $watch: any;
  statesController: any;
  private componentRef?: ComponentRef<any>;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    let vm = this;
    this.destroyRef.onDestroy(() => {
            this.destroyStateController();
        });
    this.$watch('scope.dashboardCtrl', () => {
            if (this.dashboardCtrl().dashboardCtx) {
                this.init();
            }
        })
    this.$watch('statesControllerId', (newValue?: any) => {
            if (newValue) {
                if (this.statesController) {
                    this.destroyStateController();
                }
                var statesControllerInfo: any = this.statesControllerService.getStateController(this.statesControllerId());
                if (!statesControllerInfo) {
                    //fallback to default
                    statesControllerInfo = this.statesControllerService.getStateController('default');
                }

                var preservedState: any = this.statesControllerService.withdrawStateControllerState(this.statesControllerId());

                this.componentRef = this.viewContainerRef.createComponent(statesControllerInfo.controller);
                this.statesController = this.componentRef.instance;
                this.statesController.preservedState = preservedState;
                this.statesController.dashboardCtrl = this.dashboardCtrl();
                this.statesController.states = this.states();
            }
        });
    this.$watch('states', () => {
            if (this.statesController) {
                this.statesController.states = this.states();
            }
        });
  }

  destroyStateController(...rest: any[]): any {
    if (this.statesController && (typeof this.statesController.ngOnDestroy === 'function')) {
        this.statesController.ngOnDestroy();
    }
    if (this.componentRef) {
        this.componentRef.destroy();
        this.componentRef = undefined;
    }
  }

  init(...rest: any[]): any {

    var stateController: any = this.dashboardCtrl().dashboardCtx.stateController;

    stateController.openState = (id?: any, params?: any, openRightLayout?: any) => {
        if (this.statesController) {
            this.statesController.openState(id, params, openRightLayout);
        }
    }

    stateController.updateState = (id?: any, params?: any, openRightLayout?: any) => {
        if (this.statesController) {
            this.statesController.updateState(id, params, openRightLayout);
        }
    }

    stateController.resetState = () => {
        if (this.statesController) {
            this.statesController.resetState();
        }
    }

    stateController.preserveState = () => {
        if (this.statesController) {
            var state: any = this.statesController.getStateObject();
            this.statesControllerService.preserveStateControllerState(this.statesControllerId(), state);
        }
    }

    stateController.cleanupPreservedStates = () => {
        this.statesControllerService.cleanupPreservedStates();
    }

    stateController.navigatePrevState = (index?: any) => {
        if (this.statesController) {
            this.statesController.navigatePrevState(index);
        }
    }

    stateController.getStateId = () => {
        if (this.statesController) {
            return this.statesController.getStateId();
        } else {
            return '';
        }
        return undefined;
    }

    stateController.getStateIndex = () => {
        if (this.statesController) {
            return this.statesController.getStateIndex();
        } else {
            return -1;
        }
        return undefined;
    }

    stateController.getStateIdAtIndex = (index?: any) => {
        if (this.statesController) {
            return this.statesController.getStateIdAtIndex(index);
        } else {
            return '';
        }
        return undefined;
    }

    stateController.getStateParams = () => {
        if (this.statesController) {
            return this.statesController.getStateParams();
        } else {
            return {};
        }
        return undefined;
    }

    stateController.getStateParamsByStateId = (id?: any) => {
        if (this.statesController) {
            return this.statesController.getStateParamsByStateId(id);
        } else {
            return null;
        }
        return undefined;
    }

    stateController.getEntityId = (entityParamName?: any) => {
        if (this.statesController) {
            return this.statesController.getEntityId(entityParamName);
        } else {
            return null;
        }
        return undefined;
    }

  }
}
