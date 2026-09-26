import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { bindMethods } from '../../../legacy-injector';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $filter: any;
declare let $q: any;

/**
 * Ported from the AngularJS factory `dashboardService` (module `thingsboard.api.dashboard`) in src/app/api/dashboard.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly rootScope = inject(RootState);

  private stDiffPromise: any;

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $location.host — $location.host: window.location.host
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $rootScope.$on — a root scope event: subscribe to the service that raises it

  constructor() {
    this.rootScope.dadshboardServiceStateChangeStartHandle = this.rootScope.$on('$stateChangeStart', () => {
        this.stDiffPromise = undefined;
    });
  }

  getTenantDashboardsByTenantId(tenantId?: any, pageLink?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/' + tenantId + '/dashboards?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    return new Promise((resolve, reject) => {
      this.http.get(url, config).subscribe((response: any) => {
        resolve(this.prepareDashboards(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  getTenantDashboards(pageLink?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/tenant/dashboards?limit=' + pageLink.limit;
    if ((pageLink.textSearch !== undefined)) {
        url += '&textSearch=' + pageLink.textSearch;
    }
    if ((pageLink.idOffset !== undefined)) {
        url += '&idOffset=' + pageLink.idOffset;
    }
    if ((pageLink.textOffset !== undefined)) {
        url += '&textOffset=' + pageLink.textOffset;
    }
    return new Promise((resolve, reject) => {
      this.http.get(url, config).subscribe((response: any) => {
        resolve(this.prepareDashboards(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  getCustomerDashboards(customerId?: any, pageLink?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/dashboards?limit=' + pageLink.limit;
    if ((pageLink.idOffset !== undefined)) {
        url += '&offset=' + pageLink.idOffset;
    }
    this.http.get(url, config).then((response?: any) => {
        response.data = this.prepareDashboards(response.data);
        if (pageLink.textSearch) {
            response.data.data = $filter('filter')(response.data.data, {title: pageLink.textSearch});
        }
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getServerTimeDiff(...rest: any[]): any {
    if (this.stDiffPromise) {
        return this.stDiffPromise;
    } else {
        var deferred: any = $q.defer();
        this.stDiffPromise = deferred.promise;
        var url: any = '/api/dashboard/serverTime';
        var ct1: any = Date.now();
        return new Promise((resolve, reject) => {
          this.http.get(url, {params: {ignoreLoading: true} as any}).subscribe((response: any) => {
            var ct2: any = Date.now();
            var st: any = response;
            var stDiff: any = Math.ceil(st - (ct1 + ct2) / 2);
            resolve(stDiff);
          }, () => {
            reject();
          });
        });
    }
    return this.stDiffPromise;
  }

  getDashboard(dashboardId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/dashboard/' + dashboardId;
    return new Promise((resolve, reject) => {
      this.http.get(url, null as any).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  getDashboardInfo(dashboardId?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/dashboard/info/' + dashboardId;
    return new Promise((resolve, reject) => {
      this.http.get(url, config).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  saveDashboard(dashboard?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/dashboard';
    return new Promise((resolve, reject) => {
      this.http.post(url, this.cleanDashboard(dashboard)).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  deleteDashboard(dashboardId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/dashboard/' + dashboardId;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe(() => {
        resolve(undefined);
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  assignDashboardToCustomer(customerId?: any, dashboardId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/dashboard/' + dashboardId;
    return new Promise((resolve, reject) => {
      this.http.post(url, null).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  unassignDashboardFromCustomer(customerId?: any, dashboardId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/' + customerId + '/dashboard/' + dashboardId;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  updateDashboardCustomers(dashboardId?: any, customerIds?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/dashboard/' + dashboardId + '/customers';
    return new Promise((resolve, reject) => {
      this.http.post(url, customerIds).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  addDashboardCustomers(dashboardId?: any, customerIds?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/dashboard/' + dashboardId + '/customers/add';
    return new Promise((resolve, reject) => {
      this.http.post(url, customerIds).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  removeDashboardCustomers(dashboardId?: any, customerIds?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/dashboard/' + dashboardId + '/customers/remove';
    return new Promise((resolve, reject) => {
      this.http.post(url, customerIds).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  makeDashboardPublic(dashboardId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/public/dashboard/' + dashboardId;
    return new Promise((resolve, reject) => {
      this.http.post(url, null).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  makeDashboardPrivate(dashboardId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/customer/public/dashboard/' + dashboardId;
    return new Promise((resolve, reject) => {
      this.http.delete(url).subscribe((response: any) => {
        resolve(this.prepareDashboard(response));
      }, () => {
        reject();
      });
    });
    return deferred.promise;
  }

  getPublicDashboardLink(dashboard?: any, ...rest: any[]): any {
    var url: any = (window.location.protocol) + '://' + window.location.hostname;
    var port: any = window.location.port;
    if (port != 80 && port != 443) {
        url += ":" + port;
    }
    url += "/dashboard/" + dashboard.id.id + "?publicId=" + dashboard.publicCustomerId;
    return url;
  }

  prepareDashboards(dashboardsData?: any, ...rest: any[]): any {
    if (dashboardsData.data) {
        for (var i: any = 0; i < dashboardsData.data.length; i++) {
            dashboardsData.data[i] = this.prepareDashboard(dashboardsData.data[i]);
        }
    }
    return dashboardsData;
  }

  prepareDashboard(dashboard?: any, ...rest: any[]): any {
    dashboard.publicCustomerId = null;
    dashboard.assignedCustomersText = "";
    dashboard.assignedCustomersIds = [];
    if (dashboard.assignedCustomers && dashboard.assignedCustomers.length) {
        var assignedCustomersTitles: any = [];
        for (var i: any = 0; i < dashboard.assignedCustomers.length; i++) {
            var assignedCustomer: any = dashboard.assignedCustomers[i];
            dashboard.assignedCustomersIds.push(assignedCustomer.customerId.id);
            if (assignedCustomer.public) {
                dashboard.publicCustomerId = assignedCustomer.customerId.id;
            } else {
                assignedCustomersTitles.push(assignedCustomer.title);
            }
        }
        dashboard.assignedCustomersText = assignedCustomersTitles.join(', ');
    }
    return dashboard;
  }

  cleanDashboard(dashboard?: any, ...rest: any[]): any {
    delete dashboard.publicCustomerId;
    delete dashboard.assignedCustomersText;
    delete dashboard.assignedCustomersIds;
    return dashboard;
  }
}
