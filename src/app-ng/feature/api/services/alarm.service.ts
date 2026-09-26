import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $filter: any;
declare let $q: any;

/**
 * Ported from the AngularJS factory `alarmService` (module `thingsboard.api.alarm`) in src/app/api/alarm.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class AlarmService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly utils = inject(UtilsService);

  private alarmSourceListeners: any = {};
  private simulatedAlarm: any = {
        createdTime: (new Date).getTime(),
        startTs: (new Date).getTime(),
        endTs: 0,
        ackTs: 0,
        clearTs: 0,
        originatorName: 'Simulated',
        originator: {
            entityType: "DEVICE",
            id: "1"
        },
        type: 'TEMPERATURE',
        severity: "MAJOR",
        status: types.alarmStatus.activeUnack,
        details: {
            message: "Temperature is high!"
        }
    };

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getAlarm(alarmId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm/' + alarmId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    (this.http.get(url, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getAlarmInfo(alarmId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm/info/' + alarmId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    (this.http.get(url, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  saveAlarm(alarm?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm';
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    (this.http.post(url, alarm, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  ackAlarm(alarmId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm/' + alarmId + '/ack';
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    (this.http.post(url, null, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  clearAlarm(alarmId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm/' + alarmId + '/clear';
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    (this.http.post(url, null, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  deleteAlarm(alarmId?: any, ignoreErrors?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm/' + alarmId;
    if (!config) {
        config = {};
    }
    config = Object.assign(config, { ignoreErrors: ignoreErrors });
    (this.http.delete(url, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getAlarms(entityType?: any, entityId?: any, pageLink?: any, alarmSearchStatus?: any, alarmStatus?: any, fetchOriginator?: any, ascOrder?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm/' + entityType + '/' + entityId + '?limit=' + pageLink.limit;

    if ((pageLink.startTime !== undefined) && pageLink.startTime != null) {
        url += '&startTime=' + pageLink.startTime;
    }
    if ((pageLink.endTime !== undefined) && pageLink.endTime != null) {
        url += '&endTime=' + pageLink.endTime;
    }
    if ((pageLink.idOffset !== undefined) && pageLink.idOffset != null) {
        url += '&offset=' + pageLink.idOffset;
    }
    if (alarmSearchStatus) {
        url += '&searchStatus=' + alarmSearchStatus;
    }
    if (alarmStatus) {
        url += '&status=' + alarmStatus;
    }
    if (fetchOriginator) {
        url += '&fetchOriginator=' + ((fetchOriginator===true) ? 'true' : 'false');
    }
    if ((ascOrder !== undefined) && ascOrder != null) {
        url += '&ascOrder=' + (ascOrder ? 'true' : 'false');
    }

    (this.http.get(url, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  getHighestAlarmSeverity(entityType?: any, entityId?: any, alarmSearchStatus?: any, alarmStatus?: any, config?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var url: any = '/api/alarm/highestSeverity/' + entityType + '/' + entityId;

    if (alarmSearchStatus) {
        url += '?searchStatus=' + alarmSearchStatus;
    } else if (alarmStatus) {
        url += '?status=' + alarmStatus;
    }
    (this.http.get(url, config) as any).then(function success(response?: any) {
        deferred.resolve(response.data);
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  fetchAlarms(alarmsQuery?: any, pageLink?: any, deferred?: any, leftToLoad?: any, alarmsList?: any, ...rest: any[]): any {
    this.getAlarms(alarmsQuery.entityType, alarmsQuery.entityId,
        pageLink, alarmsQuery.alarmSearchStatus, alarmsQuery.alarmStatus,
        alarmsQuery.fetchOriginator, false, {ignoreLoading: true}).then(
        (alarms?: any) => {
            if (!alarmsList) {
                alarmsList = [];
            }
            alarmsList = alarmsList.concat(alarms.data);
            if ((leftToLoad !== undefined)) {
                leftToLoad -= pageLink.limit;
                if (leftToLoad === 0) {
                alarmsList = alarmsList.sort((a: any, b: any) => b.createdTime - a.createdTime);
                deferred.resolve(alarmsList);
                return;
            }
            if (leftToLoad < pageLink.limit) {
                alarms.nextPageLink.limit = leftToLoad;
            }
        }
        if (alarms.hasNext && !alarmsQuery.limit) {
            this.fetchAlarms(alarmsQuery, alarms.nextPageLink, deferred, leftToLoad, alarmsList);
        } else {
            alarmsList = alarmsList.sort((a: any, b: any) => b.createdTime - a.createdTime);
            deferred.resolve(alarmsList);
                deferred.resolve(alarmsList);
            }
        },
        function fail() {
            deferred.reject();
        }
    );
  }

  getAlarmsByQuery(alarmsQuery?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var time: any = Date.now();
    var pageLink: any;
    var leftToLoad: any;
    if (alarmsQuery.limit) {
        pageLink = {
            limit: alarmsQuery.limit
        };
    } else if (alarmsQuery.interval) {
        pageLink = {
            limit: alarmsQuery.alarmsFetchSize || 100,
            startTime: time - alarmsQuery.interval
        };
    } else if (alarmsQuery.startTime) {
        pageLink = {
            limit: alarmsQuery.alarmsFetchSize || 100,
            startTime: Math.round(alarmsQuery.startTime)
        };
        if (alarmsQuery.endTime) {
            pageLink.endTime = Math.round(alarmsQuery.endTime);
        }
    }

    if ((alarmsQuery.alarmsMaxCountLoad !== undefined) && alarmsQuery.alarmsMaxCountLoad !== 0) {
        leftToLoad = alarmsQuery.alarmsMaxCountLoad;
        if (leftToLoad < pageLink.limit) {
            pageLink.limit = leftToLoad;
        }
    }

    this.fetchAlarms(alarmsQuery, pageLink, deferred, leftToLoad);
    return deferred.promise;
  }

  onPollAlarms = (alarmsQuery?: any, ...rest: any[]): any => {
    this.getAlarmsByQuery(alarmsQuery).then(
        function success(alarms?: any) {
            alarmsQuery.onAlarms(alarms);
        },
        function fail() {}
    );
  };

  pollAlarms(entityType?: any, entityId?: any, alarmStatus?: any, interval?: any, limit?: any, pollingInterval?: any, onAlarms?: any, ...rest: any[]): any {
    var alarmsQuery: any = {
        entityType: entityType,
        entityId: entityId,
        alarmSearchStatus: null,
        alarmStatus: alarmStatus,
        fetchOriginator: false,
        interval: interval,
        limit: limit,
        onAlarms: onAlarms
    };
    this.onPollAlarms(alarmsQuery);
    return setInterval(this.onPollAlarms, pollingInterval, 0, false, alarmsQuery);
  }

  cancelPollAlarms(pollPromise?: any, ...rest: any[]): any {
    if ((pollPromise !== undefined)) {
        clearInterval(pollPromise);
    }
  }

  subscribeForAlarms(alarmSourceListener?: any, ...rest: any[]): any {
    alarmSourceListener.id = this.utils.guid();
    this.alarmSourceListeners[alarmSourceListener.id] = alarmSourceListener;
    var alarmSource: any = alarmSourceListener.alarmSource;
    if (alarmSource.type == types.datasourceType.function) {
        setTimeout(() => {
            alarmSourceListener.alarmsUpdated([this.simulatedAlarm], false);
        });
    } else if (alarmSource.entityType && alarmSource.entityId) {
        var pollingInterval: any = alarmSourceListener.alarmsPollingInterval;
        alarmSourceListener.alarmsQuery = {
            entityType: alarmSource.entityType,
            entityId: alarmSource.entityId,
            alarmSearchStatus: alarmSourceListener.alarmSearchStatus,
            alarmStatus: null,
            alarmsMaxCountLoad: alarmSourceListener.alarmsMaxCountLoad,
            alarmsFetchSize: alarmSourceListener.alarmsFetchSize
        };
        var originatorKeys: any = alarmSource.dataKeys.filter((dk: any) => dk.name === 'originator');
        if (originatorKeys && originatorKeys.length) {
            alarmSourceListener.alarmsQuery.fetchOriginator = true;
        }
        var subscriptionTimewindow: any = alarmSourceListener.subscriptionTimewindow;
        if (subscriptionTimewindow.realtimeWindowMs) {
            alarmSourceListener.alarmsQuery.startTime = subscriptionTimewindow.startTs;
        } else {
            alarmSourceListener.alarmsQuery.startTime = subscriptionTimewindow.fixedWindow.startTimeMs;
            alarmSourceListener.alarmsQuery.endTime = subscriptionTimewindow.fixedWindow.endTimeMs;
        }
        alarmSourceListener.alarmsQuery.onAlarms = function(alarms?: any) {
            if (subscriptionTimewindow.realtimeWindowMs) {
                var now: any = Date.now();
                if (alarmSourceListener.lastUpdateTs) {
                    var interval: any = now - alarmSourceListener.lastUpdateTs;
                    alarmSourceListener.alarmsQuery.startTime += interval;
                }
                alarmSourceListener.lastUpdateTs = now;
            }
            alarmSourceListener.alarmsUpdated(alarms, false);
        }
        this.onPollAlarms(alarmSourceListener.alarmsQuery);
        alarmSourceListener.pollPromise = setInterval(this.onPollAlarms, pollingInterval,
            0, false, alarmSourceListener.alarmsQuery);
    }

  }

  unsubscribeFromAlarms(alarmSourceListener?: any, ...rest: any[]): any {
    if (alarmSourceListener && alarmSourceListener.id) {
        if (alarmSourceListener.pollPromise) {
            clearInterval(alarmSourceListener.pollPromise);
            alarmSourceListener.pollPromise = null;
        }
        delete this.alarmSourceListeners[alarmSourceListener.id];
    }
  }
}
