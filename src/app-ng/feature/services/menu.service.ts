import { inject, Injectable } from '@angular/core';
import { RootState } from '../../root-state';
import { Router } from '@angular/router';
import { UserService } from '../api/services/user.service';
import { bindMethods } from '../../legacy-injector';

/**
 * Ported from the AngularJS factory `menu` (module `thingsboard.menu`) in src/app/services/menu.service.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class MenuService {
  private readonly __bound = bindMethods(this);
  private readonly rootScope = inject(RootState);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  private authority: any = '';
  private sections: any = [];
  private homeSections: any = [];
  authenticatedHandle: any;

  // TODO(port): $rootScope.$on — a root scope event: subscribe to the service that raises it
  // TODO(port): $state.includes — $state.includes: this.router.url.startsWith(...)

  constructor() {
    if (this.userService.isUserLoaded() === true) {
        this.buildMenu();
    }
    this.authenticatedHandle = this.rootScope.$on('authenticated', () => {
        this.buildMenu();
    });
  }

  getSections(...rest: any[]): any {
    return this.sections;
  }

  getHomeSections(...rest: any[]): any {
    return this.homeSections;
  }

  buildMenu(...rest: any[]): any {
    var user: any = this.userService.getCurrentUser();
    if (user) {
        if (this.authority !== user.authority) {
            this.sections = [];
            this.authority = user.authority;
            if (this.authority === 'SYS_ADMIN') {
                this.sections = [
                    {
                        name: 'home.home',
                        type: 'link',
                        state: 'home.links',
                        icon: 'home'
                    },
                    {
                        name: 'tenant.tenants',
                        type: 'link',
                        state: 'home.tenants',
                        icon: 'supervisor_account'
                    },
                    {
                        name: 'widget.widget-library',
                        type: 'link',
                        state: 'home.widgets-bundles',
                        icon: 'now_widgets'
                    },
                    {
                        name: 'admin.system-settings',
                        type: 'toggle',
                        state: 'home.settings',
                        height: '120px',
                        icon: 'settings',
                        pages: [
                            {
                                name: 'admin.general',
                                type: 'link',
                                state: 'home.settings.general',
                                icon: 'settings_applications'
                            },
                            {
                                name: 'admin.outgoing-mail',
                                type: 'link',
                                state: 'home.settings.outgoing-mail',
                                icon: 'mail'
                            },
                            {
                                name: 'admin.security-settings',
                                type: 'link',
                                state: 'home.settings.security-settings',
                                icon: 'security'
                            }
                        ]
                    }];
                this.homeSections =
                    [{
                        name: 'tenant.management',
                        places: [
                            {
                                name: 'tenant.tenants',
                                icon: 'supervisor_account',
                                state: 'home.tenants'
                            }
                        ]
                    },
                        {
                            name: 'widget.management',
                            places: [
                                {
                                    name: 'widget.widget-library',
                                    icon: 'now_widgets',
                                    state: 'home.widgets-bundles'
                                }
                            ]
                        },
                        {
                            name: 'admin.system-settings',
                            places: [
                                {
                                    name: 'admin.general',
                                    icon: 'settings_applications',
                                    state: 'home.settings.general'
                                },
                                {
                                    name: 'admin.outgoing-mail',
                                    icon: 'mail',
                                    state: 'home.settings.outgoing-mail'
                                },
                                {
                                    name: 'admin.security-settings',
                                    icon: 'security',
                                    state: 'home.settings.security-settings'
                                }
                            ]
                        }];
            } else if (this.authority === 'TENANT_ADMIN') {
                this.sections = [
                    {
                        name: 'home.home',
                        type: 'link',
                        state: 'home.links',
                        icon: 'home'
                    },
                    {
                        name: 'rulechain.rulechains',
                        type: 'link',
                        state: 'home.ruleChains',
                        icon: 'settings_ethernet'
                    },
                    {
                        name: 'customer.customers',
                        type: 'link',
                        state: 'home.customers',
                        icon: 'supervisor_account'
                    },
                    {
                        name: 'asset.assets',
                        type: 'link',
                        state: 'home.assets',
                        icon: 'domain'
                    },
                    {
                        name: 'device.devices',
                        type: 'link',
                        state: 'home.devices',
                        icon: 'devices_other'
                    },
                    {
                        name: 'entity-view.entity-views',
                        type: 'link',
                        state: 'home.entityViews',
                        icon: 'view_quilt'
                    },
                    {
                        name: 'widget.widget-library',
                        type: 'link',
                        state: 'home.widgets-bundles',
                        icon: 'now_widgets'
                    },
                    {
                        name: 'dashboard.dashboards',
                        type: 'link',
                        state: 'home.dashboards',
                        icon: 'dashboards'
                    },
                    {
                        name: 'audit-log.audit-logs',
                        type: 'link',
                        state: 'home.auditLogs',
                        icon: 'track_changes'
                    }];

                this.homeSections =
                    [{
                        name: 'rulechain.management',
                        places: [
                            {
                                name: 'rulechain.rulechains',
                                icon: 'settings_ethernet',
                                state: 'home.ruleChains'
                            }
                        ]
                    },
                    {
                        name: 'customer.management',
                        places: [
                            {
                                name: 'customer.customers',
                                icon: 'supervisor_account',
                                state: 'home.customers'
                            }
                        ]
                    },
                        {
                            name: 'asset.management',
                            places: [
                                {
                                    name: 'asset.assets',
                                    icon: 'domain',
                                    state: 'home.assets'
                                }
                            ]
                        },
                        {
                            name: 'device.management',
                            places: [
                                {
                                    name: 'device.devices',
                                    icon: 'devices_other',
                                    state: 'home.devices'
                                }
                            ]
                        },
                        {
                            name: 'entity-view.management',
                            places: [
                                {
                                    name: 'entity-view.entity-views',
                                    icon: 'view_quilt',
                                    state: 'home.entityViews'
                                }
                            ]
                        },
                        {
                            name: 'dashboard.management',
                            places: [
                                {
                                    name: 'widget.widget-library',
                                    icon: 'now_widgets',
                                    state: 'home.widgets-bundles'
                                },
                                {
                                    name: 'dashboard.dashboards',
                                    icon: 'dashboard',
                                    state: 'home.dashboards'
                                }
                            ]
                        },
                        {
                            name: 'audit-log.audit',
                            places: [
                                {
                                    name: 'audit-log.audit-logs',
                                    icon: 'track_changes',
                                    state: 'home.auditLogs'
                                }
                            ]
                        }];

            } else if (this.authority === 'CUSTOMER_USER') {
                this.sections = [
                    {
                        name: 'home.home',
                        type: 'link',
                        state: 'home.links',
                        icon: 'home'
                    },
                    {
                        name: 'asset.assets',
                        type: 'link',
                        state: 'home.assets',
                        icon: 'domain'
                    },
                    {
                        name: 'device.devices',
                        type: 'link',
                        state: 'home.devices',
                        icon: 'devices_other'
                    },
                    {
                        name: 'entity-view.entity-views',
                        type: 'link',
                        state: 'home.entityViews',
                        icon: 'view_quilt'
                    },
                    {
                        name: 'dashboard.dashboards',
                        type: 'link',
                        state: 'home.dashboards',
                        icon: 'dashboard'
                    }];

                this.homeSections =
                    [{
                        name: 'asset.view-assets',
                        places: [
                            {
                                name: 'asset.assets',
                                icon: 'domain',
                                state: 'home.assets'
                            }
                        ]
                    },
                    {
                        name: 'device.view-devices',
                        places: [
                            {
                                name: 'device.devices',
                                icon: 'devices_other',
                                state: 'home.devices'
                            }
                        ]
                    },
                    {
                        name: 'entity-view.management',
                        places: [
                            {
                                name: 'entity-view.entity-views',
                                icon: 'view_quilt',
                                state: 'home.entityViews'
                            }
                        ]
                    },
                    {
                        name: 'dashboard.view-dashboards',
                        places: [
                            {
                                name: 'dashboard.dashboards',
                                icon: 'dashboard',
                                state: 'home.dashboards'
                            }
                        ]
                    }];
            }
        }
    }
  }

  sectionHeight(section?: any, ...rest: any[]): any {
    if (this.router.includes(section.state)) {
        return section.height;
    } else {
        return '0px';
    }
    return undefined;
  }

  sectionActive(section?: any, ...rest: any[]): any {
    return this.router.includes(section.state);
  }
}
