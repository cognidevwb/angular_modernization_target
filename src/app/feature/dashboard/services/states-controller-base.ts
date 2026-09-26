import { DestroyRef, Directive, DoCheck, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { UtilsService } from '../../common/services/utils.service';
import { legacyCopy, legacyEquals } from '../../components/widget/legacy-helpers';

/** A watch as the legacy states controllers registered it with `$scope.$watch`. */
interface StateWatch {
  get: () => any;
  listener: (newVal: any, prevVal: any) => void;
  deep: boolean;
  last: any;
  initialized: boolean;
}

/** How many passes a check makes before it gives up, as AngularJS's digest TTL. */
const DIGEST_TTL = 10;

/**
 * What the legacy `DefaultStateController` and `EntityStateController` (src/app/dashboard/states/*.js)
 * share: the state stack lookups, the `state` query parameter, and their `$scope.$watch`es —
 * re-evaluated on every change detection pass of the component, as a digest would.
 * `tb-states-component` sets `preservedState`, `dashboardCtrl` and `states` on the instance.
 */
@Directive()
export abstract class StatesControllerBase implements DoCheck {
  protected readonly utils = inject(UtilsService);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly destroyRef = inject(DestroyRef);

  preservedState: any;
  dashboardCtrl: any;
  states: any;
  stateObject: any;
  inited = false;
  skipStateChange = false;

  private readonly watchers: StateWatch[] = [];

  constructor() {
    this.watch(() => this.states, () => {
      if (this.states) {
        if (!this.inited) {
          this.inited = true;
          this.init();
        }
      }
    });
  }

  abstract openState(id?: any, params?: any, openRightLayout?: any): void;
  abstract updateState(id?: any, params?: any, openRightLayout?: any): void;
  abstract navigatePrevState(index?: any): void;
  abstract getEntityId(entityParamName?: any): any;
  protected abstract init(): void;
  protected abstract parseState(stateBase64: any): any;

  ngDoCheck(): void {
    let ttl = DIGEST_TTL;
    let dirty: boolean;
    do {
      dirty = false;
      for (const w of [...this.watchers]) {
        const value = w.get();
        if (!w.initialized) {
          w.initialized = true;
          w.last = w.deep ? legacyCopy(value) : value;
          w.listener(value, value);
          dirty = true;
        } else if (w.deep ? !legacyEquals(value, w.last) : value !== w.last) {
          const prev = w.last;
          w.last = w.deep ? legacyCopy(value) : value;
          w.listener(value, prev);
          dirty = true;
        }
      }
    } while (dirty && --ttl > 0);
  }

  /** `$scope.$watch(get, listener, deep)`: the listener runs once on registration, then on each change. */
  protected watch(get: () => any, listener: (newVal: any, prevVal: any) => void, deep = false): void {
    this.watchers.push({ get, listener, deep, last: undefined, initialized: false });
  }

  /** `$stateParams.state`: the `state` query parameter of the dashboard route. */
  protected get stateParam(): any {
    return this.route.snapshot.queryParamMap.get('state');
  }

  /** `$scope.$watchCollection(() => $state.params, …)`: runs now with the current `state`, then on each change. */
  protected watchStateParam(listener: (state: any) => void): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => listener(params.get('state')));
  }

  /** `$location.search('state', value)`; `null` removes the parameter. */
  protected setLocationState(value: any): void {
    this.router.navigate([], { relativeTo: this.route, queryParams: { state: value }, queryParamsHandling: 'merge' });
  }

  resetState(): void {
    const rootStateId = this.dashboardUtils.getRootStateId(this.states);
    this.stateObject = [{ id: rootStateId, params: {} }];
    this.gotoState(rootStateId, true);
  }

  protected abstract gotoState(stateId: any, update: any, openRightLayout?: any): void;

  getStateObject(): any {
    return this.stateObject;
  }

  getStateId(): any {
    if (this.stateObject && this.stateObject.length) {
      return this.stateObject[this.stateObject.length - 1].id;
    } else {
      return '';
    }
  }

  getStateIndex(): any {
    if (this.stateObject && this.stateObject.length) {
      return this.stateObject.length - 1;
    } else {
      return -1;
    }
  }

  getStateIdAtIndex(index?: any): any {
    if (this.stateObject && this.stateObject[index]) {
      return this.stateObject[index].id;
    } else {
      return '';
    }
  }

  getStateParams(): any {
    if (this.stateObject && this.stateObject.length) {
      return this.stateObject[this.stateObject.length - 1].params;
    } else {
      return {};
    }
  }

  getStateParamsByStateId(stateId?: any): any {
    const stateObj = this.getStateObjById(stateId);
    if (stateObj) {
      return stateObj.params;
    } else {
      return null;
    }
  }

  protected getStateObjById(id: any): any {
    for (let i = 0; i < this.stateObject.length; i++) {
      if (this.stateObject[i].id === id) {
        return this.stateObject[i];
      }
    }
    return null;
  }

  /** The part of the legacy `parseState` both controllers share: decode, then drop unknown state ids. */
  protected decodeState(stateBase64: any, keepLastOnly: boolean): any {
    let result: any;
    if (stateBase64) {
      try {
        result = this.utils.base64toObj(stateBase64);
      } catch (e) {
        result = [{ id: null, params: {} }];
      }
    }
    if (!result) {
      result = [];
    }
    if (!result.length) {
      result[0] = { id: null, params: {} };
    } else if (keepLastOnly && result.length > 1) {
      result = [result[result.length - 1]];
    }
    const rootStateId = this.dashboardUtils.getRootStateId(this.states);
    if (!result[0].id) {
      result[0].id = rootStateId;
    }
    if (!this.states[result[0].id]) {
      result[0].id = rootStateId;
    }
    let i = result.length;
    while (i--) {
      if (!result[i].id || !this.states[result[i].id]) {
        result.splice(i, 1);
      }
    }
    return result;
  }
}
