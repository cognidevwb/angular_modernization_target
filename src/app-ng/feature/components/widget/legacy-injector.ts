import { Injector, ProviderToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import $ from 'jquery';
import { firstValueFrom } from 'rxjs';

import { AlarmService } from '../../api/services/alarm.service';
import { AssetService } from '../../api/services/asset.service';
import { AttributeService } from '../../api/services/attribute.service';
import { CustomerService } from '../../api/services/customer.service';
import { DashboardService } from '../../api/services/dashboard.service';
import { DatasourceService } from '../../api/services/datasource.service';
import { DeviceService } from '../../api/services/device.service';
import { EntityRelationService } from '../../api/services/entity-relation.service';
import { EntityService } from '../../api/services/entity.service';
import { EntityViewService } from '../../api/services/entity-view.service';
import { TelemetryWebsocketService } from '../../api/services/telemetry-websocket.service';
import { TimeService } from '../../api/services/time.service';
import { UserService } from '../../api/services/user.service';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { ToastService } from '../../services/toast.service';
import { RootState } from '../../../root-state';
import { $q, $timeout } from '../../../core/q';
import { createLegacyFilter } from './legacy-helpers';

/** The services a stored widget script asks `$injector.get(name)` for, by their legacy names. */
const SERVICES: Record<string, ProviderToken<any>> = {
  alarmService: AlarmService,
  assetService: AssetService,
  attributeService: AttributeService,
  customerService: CustomerService,
  dashboardService: DashboardService,
  dashboardUtils: DashboardUtilsService,
  datasourceService: DatasourceService,
  deviceService: DeviceService,
  entityRelationService: EntityRelationService,
  entityService: EntityService,
  entityViewService: EntityViewService,
  telemetryWebsocketService: TelemetryWebsocketService,
  timeService: TimeService,
  userService: UserService,
  utils: UtilsService,
  toast: ToastService,
  $rootScope: RootState,
};

/**
 * `$injector` as widget scripts use it (`self.ctx.$scope.$injector.get('utils')`):
 * the legacy name of a service gives the Angular service that replaced it; a few
 * built-ins (`$q`, `$timeout`, `$filter`, `$translate`, `$http`, `$window`, `$document`, `types`)
 * are given as the plain functions/objects the rewrite uses for them.
 */
export function createLegacyInjector(injector: Injector): { get(name: string): any; has(name: string): boolean } {
  const translate = injector.get(TranslateService);
  const http = injector.get(HttpClient);
  const builtIns: Record<string, () => any> = {
    types: () => types,
    $q: () => $q,
    $timeout: () => $timeout,
    $window: () => window,
    $document: () => $(injector.get(DOCUMENT)),
    $filter: () => createLegacyFilter((key, params) => translate.instant(key, params)),
    $translate: () =>
      Object.assign((key: any, params?: any) => firstValueFrom(translate.get(key, params)), {
        instant: (key: any, params?: any) => translate.instant(key, params),
        use: (lang?: string) => (lang ? firstValueFrom(translate.use(lang)) : translate.getCurrentLang()),
      }),
    $http: () => {
      const call = (config: any) =>
        firstValueFrom(http.request(config.method || 'GET', config.url, { body: config.data, params: config.params, headers: config.headers }))
          .then((data) => ({ data, status: 200, config }));
      return Object.assign(call, {
        get: (url: string, config?: any) => call({ ...config, method: 'GET', url }),
        delete: (url: string, config?: any) => call({ ...config, method: 'DELETE', url }),
        post: (url: string, data?: any, config?: any) => call({ ...config, method: 'POST', url, data }),
        put: (url: string, data?: any, config?: any) => call({ ...config, method: 'PUT', url, data }),
      });
    },
  };
  return {
    get(name: string): any {
      if (builtIns[name]) {
        return builtIns[name]();
      }
      const token = SERVICES[name];
      if (!token) {
        throw new Error('Unknown provider: ' + name + 'Provider <- ' + name);
      }
      return injector.get(token);
    },
    has(name: string): boolean {
      return !!(builtIns[name] || SERVICES[name]);
    },
  };
}
