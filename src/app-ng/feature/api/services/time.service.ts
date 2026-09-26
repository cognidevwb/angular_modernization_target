import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';

import moment from 'moment';
import { bindMethods } from '../../../bind-methods';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

// Helpers at the legacy file's top level, beside the registration (as written).
const SECOND: any = 1000;

const MIN_LIMIT: any = 7;

const MIN_INTERVAL: any = SECOND;

const MINUTE: any = 60 * SECOND;

const MAX_INTERVAL: any = 365 * 20 * 24 * 60 * MINUTE;

const DAY: any = 24 * 60 * MINUTE;

const HOUR: any = 60 * MINUTE;

/**
 * Ported from the AngularJS factory `timeService` (module `thingsboard.api.time`) in src/app/api/time.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class TimeService {
  private readonly __bound = bindMethods(this);
  private readonly http = inject(HttpClient);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly translate = inject(TranslateService);

  private predefIntervals: any;
  private maxDatapointsLimit: any;

  // TODO(port): $http — $http: this.http returns an Observable; the response body is the value, not .data
  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  getMaxDatapointsLimit(...rest: any[]): any {
    return this.maxDatapointsLimit;
  }

  getMinDatapointsLimit(...rest: any[]): any {
    return MIN_LIMIT;
  }

  loadMaxDatapointsLimit(...rest: any[]): any {
    var url: any = '/api/dashboard/maxDatapointsLimit';
    return new Promise((resolve, reject) => {
      firstValueFrom(this.http.get(url, {ignoreLoading: true} as any)).then((response: any) => {
          this.maxDatapointsLimit = response;
          if (!this.maxDatapointsLimit || this.maxDatapointsLimit <= MIN_LIMIT) {
              this.maxDatapointsLimit = MIN_LIMIT + 1;
          }
          resolve(this.maxDatapointsLimit);
      }, () => {
          reject();
      });
    });
  }

  minIntervalLimit(timewindow?: any, ...rest: any[]): any {
    var min: any = timewindow / 500;
    return this.boundMinInterval(min);
  }

  avgInterval(timewindow?: any, ...rest: any[]): any {
    var avg: any = timewindow / 200;
    return this.boundMinInterval(avg);
  }

  maxIntervalLimit(timewindow?: any, ...rest: any[]): any {
    var max: any = timewindow / MIN_LIMIT;
    return this.boundMaxInterval(max);
  }

  boundMinInterval(min?: any, ...rest: any[]): any {
    return this.toBound(min, MIN_INTERVAL, MAX_INTERVAL, MIN_INTERVAL);
  }

  boundMaxInterval(max?: any, ...rest: any[]): any {
    return this.toBound(max, MIN_INTERVAL, MAX_INTERVAL, MAX_INTERVAL);
  }

  toBound(value?: any, min?: any, max?: any, defValue?: any, ...rest: any[]): any {
    if ((value !== undefined)) {
        value = Math.max(value, min);
        value = Math.min(value, max);
        return value;
    } else {
        return defValue;
    }
    return undefined;
  }

  getIntervals(min?: any, max?: any, ...rest: any[]): any {
    min = this.boundMinInterval(min);
    max = this.boundMaxInterval(max);
    var intervals: any = [];
    this.initPredefIntervals();
    for (var i in this.predefIntervals) {
        var interval: any = this.predefIntervals[i];
        if (interval.value >= min && interval.value <= max) {
            intervals.push(interval);
        }
    }
    return intervals;
  }

  initPredefIntervals(...rest: any[]): any {
    if (!this.predefIntervals) {
        this.predefIntervals = [
            {
                name: this.translate.instant('timeinterval.seconds-interval', {seconds: 1}, 'messageformat'),
                value: 1 * SECOND
            },
            {
                name: this.translate.instant('timeinterval.seconds-interval', {seconds: 5}, 'messageformat'),
                value: 5 * SECOND
            },
            {
                name: this.translate.instant('timeinterval.seconds-interval', {seconds: 10}, 'messageformat'),
                value: 10 * SECOND
            },
            {
                name: this.translate.instant('timeinterval.seconds-interval', {seconds: 15}, 'messageformat'),
                value: 15 * SECOND
            },
            {
                name: this.translate.instant('timeinterval.seconds-interval', {seconds: 30}, 'messageformat'),
                value: 30 * SECOND
            },
            {
                name: this.translate.instant('timeinterval.minutes-interval', {minutes: 1}, 'messageformat'),
                value: 1 * MINUTE
            },
            {
                name: this.translate.instant('timeinterval.minutes-interval', {minutes: 2}, 'messageformat'),
                value: 2 * MINUTE
            },
            {
                name: this.translate.instant('timeinterval.minutes-interval', {minutes: 5}, 'messageformat'),
                value: 5 * MINUTE
            },
            {
                name: this.translate.instant('timeinterval.minutes-interval', {minutes: 10}, 'messageformat'),
                value: 10 * MINUTE
            },
            {
                name: this.translate.instant('timeinterval.minutes-interval', {minutes: 15}, 'messageformat'),
                value: 15 * MINUTE
            },
            {
                name: this.translate.instant('timeinterval.minutes-interval', {minutes: 30}, 'messageformat'),
                value: 30 * MINUTE
            },
            {
                name: this.translate.instant('timeinterval.hours-interval', {hours: 1}, 'messageformat'),
                value: 1 * HOUR
            },
            {
                name: this.translate.instant('timeinterval.hours-interval', {hours: 2}, 'messageformat'),
                value: 2 * HOUR
            },
            {
                name: this.translate.instant('timeinterval.hours-interval', {hours: 5}, 'messageformat'),
                value: 5 * HOUR
            },
            {
                name: this.translate.instant('timeinterval.hours-interval', {hours: 10}, 'messageformat'),
                value: 10 * HOUR
            },
            {
                name: this.translate.instant('timeinterval.hours-interval', {hours: 12}, 'messageformat'),
                value: 12 * HOUR
            },
            {
                name: this.translate.instant('timeinterval.days-interval', {days: 1}, 'messageformat'),
                value: 1 * DAY
            },
            {
                name: this.translate.instant('timeinterval.days-interval', {days: 7}, 'messageformat'),
                value: 7 * DAY
            },
            {
                name: this.translate.instant('timeinterval.days-interval', {days: 30}, 'messageformat'),
                value: 30 * DAY
            }
        ];
    }
  }

  matchesExistingInterval(min?: any, max?: any, intervalMs?: any, ...rest: any[]): any {
    var intervals: any = this.getIntervals(min, max);
    for (var i in intervals) {
        var interval: any = intervals[i];
        if (intervalMs === interval.value) {
            return true;
        }
    }
    return false;
  }

  boundToPredefinedInterval(min?: any, max?: any, intervalMs?: any, ...rest: any[]): any {
    var intervals: any = this.getIntervals(min, max);
    var minDelta: any = MAX_INTERVAL;
    var boundedInterval: any = intervalMs || min;
    var matchedInterval: any;
    for (var i in intervals) {
        var interval: any = intervals[i];
        var delta: any = Math.abs(interval.value - boundedInterval);
        if (delta < minDelta) {
            matchedInterval = interval;
            minDelta = delta;
        }
    }
    boundedInterval = matchedInterval.value;
    return boundedInterval;
  }

  defaultTimewindow(...rest: any[]): any {
    var currentTime: any = (new Date).getTime();
    var timewindow: any = {
        displayValue: "",
        selectedTab: 0,            
        hideInterval: false,
        hideAggregation: false,
        hideAggInterval: false,
        realtime: {
            interval: SECOND,
            timewindowMs: MINUTE // 1 min by default
        },
        history: {
            historyType: 0,
                interval: SECOND,
                timewindowMs: MINUTE, // 1 min by default
                fixedTimewindow: {
                    startTimeMs: currentTime - DAY, // 1 day by default
                    endTimeMs: currentTime
                }
        },
        aggregation: {
            type: types.aggregation.avg.value,
            limit: Math.floor(this.maxDatapointsLimit / 2)
        }
    }
    return timewindow;
  }

  toHistoryTimewindow(timewindow?: any, startTimeMs?: any, endTimeMs?: any, interval?: any, ...rest: any[]): any {
    if (timewindow.history) {
        interval = (interval !== undefined) ? interval : timewindow.history.interval;
    } else if (timewindow.realtime) {
        interval = timewindow.realtime.interval;
    } else {
        interval = 0;
    }

    var aggType: any;
    var limit: any;
    if (timewindow.aggregation) {
        aggType = timewindow.aggregation.type || types.aggregation.avg.value;
        limit = timewindow.aggregation.limit || this.maxDatapointsLimit;
    } else {
        aggType = types.aggregation.avg.value;
        limit = this.maxDatapointsLimit;
    }


    var historyTimewindow: any = {
        hideInterval: timewindow.hideInterval || false,
        hideAggregation: timewindow.hideAggregation || false,
        hideAggInterval: timewindow.hideAggInterval || false,
        history: {
            fixedTimewindow: {
                startTimeMs: startTimeMs,
                endTimeMs: endTimeMs
            },
            interval: this.boundIntervalToTimewindow(endTimeMs - startTimeMs, interval, types.aggregation.avg.value)
        },
        aggregation: {
            type: aggType,
            limit: limit
        }
    }

    return historyTimewindow;
  }

  createSubscriptionTimewindow(timewindow?: any, stDiff?: any, stateData?: any, ...rest: any[]): any {

    var subscriptionTimewindow: any = {
        fixedWindow: null,
        realtimeWindowMs: null,
        aggregation: {
            interval: SECOND,
            limit: this.maxDatapointsLimit,
            type: types.aggregation.avg.value
        }
    };
    var aggTimewindow: any = 0;
    if (stateData) {
        subscriptionTimewindow.aggregation = {
            interval: SECOND,
            limit: this.maxDatapointsLimit,
            type: types.aggregation.none.value,
            stateData: true
        };
    } else {
        subscriptionTimewindow.aggregation = {
            interval: SECOND,
            limit: this.maxDatapointsLimit,
            type: types.aggregation.avg.value
        };
    }

    if ((timewindow.aggregation !== undefined) && !stateData) {
        subscriptionTimewindow.aggregation = {
            type: timewindow.aggregation.type || types.aggregation.avg.value,
            limit: timewindow.aggregation.limit || this.maxDatapointsLimit
        };
    }
    if ((timewindow.realtime !== undefined)) {
        subscriptionTimewindow.realtimeWindowMs = timewindow.realtime.timewindowMs;
        subscriptionTimewindow.aggregation.interval =
            this.boundIntervalToTimewindow(subscriptionTimewindow.realtimeWindowMs, timewindow.realtime.interval,
                subscriptionTimewindow.aggregation.type);
        subscriptionTimewindow.startTs = (new Date).getTime() + stDiff - subscriptionTimewindow.realtimeWindowMs;
        var startDiff: any = subscriptionTimewindow.startTs % subscriptionTimewindow.aggregation.interval;
        aggTimewindow = subscriptionTimewindow.realtimeWindowMs;
        if (startDiff) {
            subscriptionTimewindow.startTs -= startDiff;
            aggTimewindow += subscriptionTimewindow.aggregation.interval;
        }
    } else if ((timewindow.history !== undefined)) {
        if ((timewindow.history.timewindowMs !== undefined)) {
            var currentTime: any = (new Date).getTime();
            subscriptionTimewindow.fixedWindow = {
                startTimeMs: currentTime - timewindow.history.timewindowMs,
                endTimeMs: currentTime
            }
            aggTimewindow = timewindow.history.timewindowMs;

        } else {
            subscriptionTimewindow.fixedWindow = {
                startTimeMs: timewindow.history.fixedTimewindow.startTimeMs,
                endTimeMs: timewindow.history.fixedTimewindow.endTimeMs
            }
            aggTimewindow = subscriptionTimewindow.fixedWindow.endTimeMs - subscriptionTimewindow.fixedWindow.startTimeMs;
        }
        subscriptionTimewindow.startTs = subscriptionTimewindow.fixedWindow.startTimeMs;
        subscriptionTimewindow.aggregation.interval =
            this.boundIntervalToTimewindow(aggTimewindow, timewindow.history.interval, subscriptionTimewindow.aggregation.type);
    }
    var aggregation: any = subscriptionTimewindow.aggregation;
    aggregation.timeWindow = aggTimewindow;
    if (aggregation.type !== types.aggregation.none.value) {
        aggregation.limit = Math.ceil(aggTimewindow / subscriptionTimewindow.aggregation.interval);
    }
    return subscriptionTimewindow;
  }

  boundIntervalToTimewindow(timewindow?: any, intervalMs?: any, aggType?: any, ...rest: any[]): any {
    if (aggType === types.aggregation.none.value) {
        return SECOND;
    } else {
        var min: any = this.minIntervalLimit(timewindow);
        var max: any = this.maxIntervalLimit(timewindow);
        if (intervalMs) {
            return this.toBound(intervalMs, min, max, intervalMs);
        } else {
            return this.boundToPredefinedInterval(min, max, this.avgInterval(timewindow));
        }
    }
    return undefined;
  }

  createTimewindowForComparison(subscriptionTimewindow?: any, timeUnit?: any, ...rest: any[]): any {
    var timewindowForComparison: any = {
        fixedWindow: null,
        realtimeWindowMs: null,
        aggregation: subscriptionTimewindow.aggregation
    };

    if (subscriptionTimewindow.realtimeWindowMs) {
        timewindowForComparison.startTs = moment(subscriptionTimewindow.startTs).subtract(1, timeUnit).valueOf(); //eslint-disable-line
        timewindowForComparison.realtimeWindowMs = subscriptionTimewindow.realtimeWindowMs;
    } else if (subscriptionTimewindow.fixedWindow) {
        var timeInterval: any = subscriptionTimewindow.fixedWindow.endTimeMs - subscriptionTimewindow.fixedWindow.startTimeMs;
        var endTimeMs: any = moment(subscriptionTimewindow.fixedWindow.endTimeMs).subtract(1, timeUnit).valueOf(); //eslint-disable-line

        timewindowForComparison.startTs = endTimeMs - timeInterval;
        timewindowForComparison.fixedWindow = {
            startTimeMs: timewindowForComparison.startTs,
            endTimeMs: endTimeMs
        };
    }

    return timewindowForComparison;
  }
}
