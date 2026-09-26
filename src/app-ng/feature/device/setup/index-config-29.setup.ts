import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS config block `index-config-29` (module `thingsboard.device`) in src/app/device/index.js:29.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig29(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/device/index.js:29. Port it, then delete this block.
  /* ORIGINAL
function DeviceRoutes($stateProvider, types) {
    $stateProvider
        .state('home.devices', {
            url: '/devices',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "content@home": {
                    templateUrl: devicesTemplate,
                    controller: 'DeviceController',
                    controllerAs: 'vm'
                }
            },
            data: {
                devicesType: 'tenant',
                searchEnabled: true,
                searchByEntitySubtype: true,
                searchEntityType: types.entityType.device,
                pageTitle: 'device.devices'
            },
            ncyBreadcrumb: {
                label: '{"icon": "devices_other", "label": "device.devices"}'
            }
        })
        .state('home.customers.devices', {
            url: '/:customerId/devices',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: devicesTemplate,
                    controllerAs: 'vm',
                    controller: 'DeviceController'
                }
            },
            data: {
                devicesType: 'customer',
                searchEnabled: true,
                searchByEntitySubtype: true,
                searchEntityType: types.entityType.device,
                pageTitle: 'customer.devices'
            },
            ncyBreadcrumb: {
                label: '{"icon": "devices_other", "label": "{{ vm.customerDevicesTitle }}", "translate": "false"}'
            }
        });

}
  */
}
