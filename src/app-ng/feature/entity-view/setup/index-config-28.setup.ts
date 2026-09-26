import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS config block `index-config-28` (module `thingsboard.entityView`) in src/app/entity-view/index.js:28.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig28(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/entity-view/index.js:28. Port it, then delete this block.
  /* ORIGINAL
function EntityViewRoutes($stateProvider, types) {
    $stateProvider
        .state('home.entityViews', {
            url: '/entityViews',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN', 'CUSTOMER_USER'],
            views: {
                "content@home": {
                    templateUrl: entityViewsTemplate,
                    controller: 'EntityViewController',
                    controllerAs: 'vm'
                }
            },
            data: {
                entityViewsType: 'tenant',
                searchEnabled: true,
                searchByEntitySubtype: true,
                searchEntityType: types.entityType.entityView,
                pageTitle: 'entity-view.entity-views'
            },
            ncyBreadcrumb: {
                label: '{"icon": "view_quilt", "label": "entity-view.entity-views"}'
            }
        })
        .state('home.customers.entityViews', {
            url: '/:customerId/entityViews',
            params: {'topIndex': 0},
            module: 'private',
            auth: ['TENANT_ADMIN'],
            views: {
                "content@home": {
                    templateUrl: entityViewsTemplate,
                    controllerAs: 'vm',
                    controller: 'EntityViewController'
                }
            },
            data: {
                entityViewsType: 'customer',
                searchEnabled: true,
                searchByEntitySubtype: true,
                searchEntityType: types.entityType.entityView,
                pageTitle: 'customer.entity-views'
            },
            ncyBreadcrumb: {
                label: '{"icon": "view_quilt", "label": "{{ vm.customerEntityViewsTitle }}", "translate": "false"}'
            }
        });

}
  */
}
