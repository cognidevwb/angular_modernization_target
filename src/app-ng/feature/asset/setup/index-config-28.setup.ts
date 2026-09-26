import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS config block `index-config-28` (module `thingsboard.asset`) in src/app/asset/index.js:28.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig28(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/asset/index.js:28. Port it, then delete this block.
  /* ORIGINAL
function AssetRoutes($stateProvider, types) {
    $stateProvider
        .state('home.assets', {
            url: '/assets',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "content@home": {
                    templateUrl: assetsTemplate,
                    controller: 'AssetController',
                    controllerAs: 'vm'
                }
            },
            data: {
                assetsType: 'tenant',
                searchEnabled: true,
                searchByEntitySubtype: true,
                searchEntityType: types.entityType.asset,
                pageTitle: 'asset.assets'
            },
            ncyBreadcrumb: {
                label: '{"icon": "domain", "label": "asset.assets"}'
            }
        })
        .state('home.customers.assets', {
            url: '/:customerId/assets',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: assetsTemplate,
                    controllerAs: 'vm',
                    controller: 'AssetController'
                }
            },
            data: {
                assetsType: 'customer',
                searchEnabled: true,
                searchByEntitySubtype: true,
                searchEntityType: types.entityType.asset,
                pageTitle: 'customer.assets'
            },
            ncyBreadcrumb: {
                label: '{"icon": "domain", "label": "{{ vm.customerAssetsTitle }}", "translate": "false"}'
            }
        });

}
  */
}
