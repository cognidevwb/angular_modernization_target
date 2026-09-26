import { inject, Injectable } from '@angular/core';
import { TelemetryWebsocketService } from './telemetry-websocket.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $filter: any;
declare let $log: any;
declare let $timeout: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function DatasourceSubscription(this: any, datasourceSubscription?: any, telemetryWebsocketService?: any, $timeout?: any, $filter?: any, $log?: any, types?: any, utils?: any) {

    var listeners: any = [];
    var datasourceType: any = datasourceSubscription.datasourceType;
    var datasourceData: any = {};
    var dataSourceOrigData: any = {};
    var dataKeys: any = {};
    var subscribers: any = [];
    var history: any = datasourceSubscription.subscriptionTimewindow &&
        datasourceSubscription.subscriptionTimewindow.fixedWindow;
    var realtime: any = datasourceSubscription.subscriptionTimewindow &&
        datasourceSubscription.subscriptionTimewindow.realtimeWindowMs;
    var timer: any;
    var frequency: any;
    var tickElapsed: any = 0;
    var tickScheduledTime: any = 0;
    var dataAggregator: any;

    var subscription: any = {
        addListener: addListener,
        hasListeners: hasListeners,
        removeListener: removeListener,
        syncListener: syncListener,
        start: start,
        unsubscribe: unsubscribe
    }

    initializeSubscription();

    return subscription;

    function initializeSubscription() {
        for (var i: any = 0; i < datasourceSubscription.dataKeys.length; i++) {
            var dataKey: any = structuredClone(datasourceSubscription.dataKeys[i]);
            dataKey.index = i;
            var key: any;
            if (datasourceType === types.datasourceType.function) {
                if (!dataKey.func) {
                    dataKey.func = new Function("time", "prevValue", dataKey.funcBody);
                }
            } else {
                if (dataKey.postFuncBody && !dataKey.postFunc) {
                    dataKey.postFunc = new Function("time", "value", "prevValue", "timePrev", "prevOrigValue", dataKey.postFuncBody);
                }
            }
            if (datasourceType === types.datasourceType.entity || datasourceSubscription.type === types.widgetType.timeseries.value) {
                if (datasourceType === types.datasourceType.function) {
                    key = dataKey.name + '_' + dataKey.index + '_' + dataKey.type;
                } else {
                    key = dataKey.name + '_' + dataKey.type;
                }
                var dataKeysList: any = dataKeys[key];
                if (!dataKeysList) {
                    dataKeysList = [];
                    dataKeys[key] = dataKeysList;
                }
                var index: any = dataKeysList.push(dataKey) - 1;
                datasourceData[key + '_' + index] = {
                    data: []
                };
            } else {
                key = utils.objectHashCode(dataKey);
                datasourceData[key] = {
                    data: []
                };
                dataKeys[key] = dataKey;
            }
            dataSourceOrigData = structuredClone(datasourceData);
            dataKey.key = key;
        }
        if (datasourceType === types.datasourceType.function) {
            frequency = 1000;
            if (datasourceSubscription.type === types.widgetType.timeseries.value) {
                frequency = Math.min(datasourceSubscription.subscriptionTimewindow.aggregation.interval, 5000);
            }
        }
    }

    function addListener(listener?: any) {
        listeners.push(listener);
        if (history) {
            start();
        }
    }

    function hasListeners() {
        return listeners.length > 0;
    }

    function removeListener(listener?: any) {
        listeners.splice(listeners.indexOf(listener), 1);
    }

    function syncListener(listener?: any) {
        var key: any;
        var dataKey: any;
        if (datasourceType === types.datasourceType.entity || datasourceSubscription.type === types.widgetType.timeseries.value) {
            for (key in dataKeys) {
                var dataKeysList: any = dataKeys[key];
                for (var i: any = 0; i < dataKeysList.length; i++) {
                    dataKey = dataKeysList[i];
                    var datasourceKey: any = key + '_' + i;
                    listener.dataUpdated(datasourceData[datasourceKey],
                        listener.datasourceIndex,
                        dataKey.index, false);
                }
            }
        } else {
            for (key in dataKeys) {
                dataKey = dataKeys[key];
                listener.dataUpdated(datasourceData[key],
                    listener.datasourceIndex,
                    dataKey.index, false);
            }
        }
    }

    function start(this: any) {
        if (history && !hasListeners()) {
            return;
        }
        var subsTw: any = datasourceSubscription.subscriptionTimewindow;
        var tsKeyNames: any = [];
        var dataKey: any;

        if (datasourceType === types.datasourceType.entity) {

            //send subscribe command

            var tsKeys: any = '';
            var attrKeys: any = '';

            for (var key in dataKeys) {
                var dataKeysList: any = dataKeys[key];
                dataKey = dataKeysList[0];
                if (dataKey.type === types.dataKeyType.timeseries) {
                    if (tsKeys.length > 0) {
                        tsKeys += ',';
                    }
                    tsKeys += dataKey.name;
                    tsKeyNames.push(dataKey.name);
                } else if (dataKey.type === types.dataKeyType.attribute) {
                    if (attrKeys.length > 0) {
                        attrKeys += ',';
                    }
                    attrKeys += dataKey.name;
                }
            }

            if (tsKeys.length > 0) {

                var subscriber: any;

                if (history) {

                    var historyCommand: any = {
                        entityType: datasourceSubscription.entityType,
                        entityId: datasourceSubscription.entityId,
                        keys: tsKeys,
                        startTs: subsTw.fixedWindow.startTimeMs,
                        endTs: subsTw.fixedWindow.endTimeMs,
                        interval: subsTw.aggregation.interval,
                        limit: subsTw.aggregation.limit,
                        agg: subsTw.aggregation.type
                    };

                    subscriber = {
                        historyCommands: [ historyCommand ],
                        type: types.dataKeyType.timeseries,
                        subsTw: subsTw
                    };

                    if (subsTw.aggregation.stateData) {
                        subscriber.firstStateHistoryCommand = createFirstStateHistoryCommand(subsTw.fixedWindow.startTimeMs, tsKeys);
                        subscriber.historyCommands.push(subscriber.firstStateHistoryCommand);
                    }

                    subscriber.onData = function (this: any, data?: any, subscriptionId?: any) {
                        if (this.subsTw.aggregation.stateData &&
                            this.firstStateHistoryCommand && this.firstStateHistoryCommand.cmdId == subscriptionId) {
                            if (this.data) {
                                onStateHistoryData(data, this.data, this.subsTw.aggregation.limit,
                                    subsTw.fixedWindow.startTimeMs, this.subsTw.fixedWindow.endTimeMs,
                                    (data?: any) => {
                                        onData(data.data, types.dataKeyType.timeseries, true);
                                    });
                            } else {
                                this.firstStateData = data;
                            }
                        } else {
                            if (this.subsTw.aggregation.stateData) {
                                if (this.firstStateData) {
                                    onStateHistoryData(this.firstStateData, data, this.subsTw.aggregation.limit,
                                        this.subsTw.fixedWindow.startTimeMs, this.subsTw.fixedWindow.endTimeMs,
                                        (data?: any) => {
                                            onData(data.data, types.dataKeyType.timeseries, true);
                                        });
                                } else {
                                    this.data = data;
                                }
                            } else {
                                for (key in data.data) {
                                    var keyData: any = data.data[key];
                                    data.data[key] = $filter('orderBy')(keyData, '+this[0]');
                                }
                                onData(data.data, types.dataKeyType.timeseries, true);
                            }
                        }
                    };
                    subscriber.onReconnected = function() {};
                    telemetryWebsocketService.subscribe(subscriber);
                    subscribers.push(subscriber);

                } else {

                    var subscriptionCommand: any = {
                        entityType: datasourceSubscription.entityType,
                        entityId: datasourceSubscription.entityId,
                        keys: tsKeys
                    };

                    subscriber = {
                        subscriptionCommands: [subscriptionCommand],
                        type: types.dataKeyType.timeseries
                    };

                    if (datasourceSubscription.type === types.widgetType.timeseries.value) {
                        subscriber.subsTw = subsTw;
                        updateRealtimeSubscriptionCommand(subscriptionCommand, subsTw);

                        if (subsTw.aggregation.stateData) {
                            subscriber.firstStateSubscriptionCommand = createFirstStateHistoryCommand(subsTw.startTs, tsKeys);
                            subscriber.historyCommands = [subscriber.firstStateSubscriptionCommand];
                        }
                        dataAggregator = createRealtimeDataAggregator(subsTw, tsKeyNames, types.dataKeyType.timeseries);
                        subscriber.onData = function(this: any, data?: any, subscriptionId?: any) {
                            if (this.subsTw.aggregation.stateData &&
                                this.firstStateSubscriptionCommand && this.firstStateSubscriptionCommand.cmdId == subscriptionId) {
                                if (this.data) {
                                    onStateHistoryData(data, this.data, this.subsTw.aggregation.limit,
                                        this.subsTw.startTs, this.subsTw.startTs + this.subsTw.aggregation.timeWindow,
                                        (data?: any) => {
                                            dataAggregator.onData(data, false, false, true);
                                        });
                                    this.stateDataReceived = true;
                                } else {
                                    this.firstStateData = data;
                                }
                            } else {
                                if (this.subsTw.aggregation.stateData && !this.stateDataReceived) {
                                    if (this.firstStateData) {
                                        onStateHistoryData(this.firstStateData, data, this.subsTw.aggregation.limit,
                                            this.subsTw.startTs, this.subsTw.startTs + this.subsTw.aggregation.timeWindow,
                                            (data?: any) => {
                                                dataAggregator.onData(data, false, false, true);
                                            });
                                        this.stateDataReceived = true;
                                    } else {
                                        this.data = data;
                                    }
                                } else {
                                    dataAggregator.onData(data, false, false, true);
                                }
                            }
                        }
                        subscriber.onReconnected = function(this: any) {
                            var newSubsTw: any = null;
                            for (var i2: any = 0; i2 < listeners.length; i2++) {
                                var listener: any = listeners[i2];
                                if (!newSubsTw) {
                                    newSubsTw = listener.updateRealtimeSubscription();
                                } else {
                                    listener.setRealtimeSubscription(newSubsTw);
                                }
                            }
                            this.subsTw = newSubsTw;
                            this.firstStateData = null;
                            this.data = null;
                            this.stateDataReceived = false;
                            updateRealtimeSubscriptionCommand(this.subscriptionCommands[0], this.subsTw);
                            if (this.subsTw.aggregation.stateData) {
                                updateFirstStateHistoryCommand(this.firstStateSubscriptionCommand, this.subsTw.startTs);
                            }
                            dataAggregator.reset(newSubsTw.startTs,  newSubsTw.aggregation.timeWindow, newSubsTw.aggregation.interval);
                        }
                    } else {
                        subscriber.onReconnected = function() {}
                        subscriber.onData = function(data?: any) {
                            if (data.data) {
                                onData(data.data, types.dataKeyType.timeseries, true);
                            }
                        }
                    }

                    telemetryWebsocketService.subscribe(subscriber);
                    subscribers.push(subscriber);

                }
            }

            if (attrKeys.length > 0) {

                var attrsSubscriptionCommand: any = {
                    entityType: datasourceSubscription.entityType,
                    entityId: datasourceSubscription.entityId,
                    keys: attrKeys
                };

                subscriber = {
                    subscriptionCommands: [attrsSubscriptionCommand],
                    type: types.dataKeyType.attribute,
                    onData: function (data?: any) {
                        if (data.data) {
                            onData(data.data, types.dataKeyType.attribute, true);
                        }
                    },
                    onReconnected: function() {}
                };

                telemetryWebsocketService.subscribe(subscriber);
                subscribers.push(subscriber);

            }

        } else if (datasourceType === types.datasourceType.function) {
            if (datasourceSubscription.type === types.widgetType.timeseries.value) {
                for (key in dataKeys) {
                    var dataKeyList: any = dataKeys[key];
                    for (var index: any = 0; index < dataKeyList.length; index++) {
                        dataKey = dataKeyList[index];
                        tsKeyNames.push(dataKey.name+'_'+dataKey.index);
                    }
                }
                dataAggregator = createRealtimeDataAggregator(subsTw, tsKeyNames, types.dataKeyType.function);
            }
            tickScheduledTime = currentTime();
            if (history) {
                onTick(false);
            } else {
                timer = $timeout(
                    function() {
                        onTick(true)
                    },
                    0,
                    false
                );
            }
        }
    }

    function createFirstStateHistoryCommand(startTs?: any, tsKeys?: any) {
        return {
            entityType: datasourceSubscription.entityType,
            entityId: datasourceSubscription.entityId,
            keys: tsKeys,
            startTs: startTs - YEAR,
            endTs: startTs,
            interval: 1000,
            limit: 1,
            agg: types.aggregation.none.value
        };
    }

    function updateFirstStateHistoryCommand(stateHistoryCommand?: any, startTs?: any) {
        stateHistoryCommand.startTs = startTs - YEAR;
        stateHistoryCommand.endTs = startTs;
    }

    function onStateHistoryData(this: any, firstStateData?: any, data?: any, limit?: any, startTs?: any, endTs?: any, onData?: any) {
        for (var key in data.data) {
            var keyData: any = data.data[key];
            data.data[key] = $filter('orderBy')(keyData, '+this[0]');
            keyData = data.data[key];
            if (keyData.length < limit) {
                var firstStateKeyData: any = firstStateData.data[key];
                if (firstStateKeyData.length) {
                    var firstStateDataTsKv: any = firstStateKeyData[0];
                    firstStateDataTsKv[0] = startTs;
                    firstStateKeyData = [
                        [ startTs, firstStateKeyData[0][1] ]
                    ];
                    keyData.unshift(firstStateDataTsKv);
                }
            }
            if (keyData.length) {
                var lastTsKv: any = structuredClone(keyData[keyData.length-1]);
                lastTsKv[0] = endTs;
                keyData.push(lastTsKv);
            }
        }
        onData(data);
    }

    function createRealtimeDataAggregator(subsTw?: any, tsKeyNames?: any, dataKeyType?: any) {
        return new dataAggregator(
            function(data?: any, apply?: any) {
                onData(data, dataKeyType, apply);
            },
            tsKeyNames,
            subsTw.startTs,
            subsTw.aggregation.limit,
            subsTw.aggregation.type,
            subsTw.aggregation.timeWindow,
            subsTw.aggregation.interval,
            subsTw.aggregation.stateData,
            types,
            $timeout,
            $filter
        );
    }

    function updateRealtimeSubscriptionCommand(subscriptionCommand?: any, subsTw?: any) {
        subscriptionCommand.startTs = subsTw.startTs;
        subscriptionCommand.timeWindow = subsTw.aggregation.timeWindow;
        subscriptionCommand.interval = subsTw.aggregation.interval;
        subscriptionCommand.limit = subsTw.aggregation.limit;
        subscriptionCommand.agg = subsTw.aggregation.type;
    }

    function unsubscribe() {
        if (timer) {
            $timeout.cancel(timer);
            timer = null;
        }
        if (datasourceType === types.datasourceType.entity) {
            for (var i: any=0;i<subscribers.length;i++) {
                var subscriber: any = subscribers[i];
                telemetryWebsocketService.unsubscribe(subscriber);
                if (subscriber.onDestroy) {
                    subscriber.onDestroy();
                }
            }
            subscribers.length = 0;
        }
        if (dataAggregator) {
            dataAggregator.destroy();
            dataAggregator = null;
        }
    }

    function generateSeries(dataKey?: any, index?: any, startTime?: any, endTime?: any) {
        var data: any = [];
        var prevSeries: any;
        var datasourceDataKey: any = dataKey.key + '_' + index;
        var datasourceKeyData: any = datasourceData[datasourceDataKey].data;
        if (datasourceKeyData.length > 0) {
            prevSeries = datasourceKeyData[datasourceKeyData.length - 1];
        } else {
            prevSeries = [0, 0];
        }
        for (var time: any = startTime; time <= endTime && (timer || history); time += frequency) {
            var series: any = [];
            series.push(time);
            var value: any = dataKey.func(time, prevSeries[1]);
            series.push(value);
            data.push(series);
            prevSeries = series;
        }
        if (data.length > 0) {
            dataKey.lastUpdateTime = data[data.length - 1][0];
        }
        return data;
    }

    function generateLatest(dataKey?: any, apply?: any) {
        var prevSeries: any;
        var datasourceKeyData: any = datasourceData[dataKey.key].data;
        if (datasourceKeyData.length > 0) {
            prevSeries = datasourceKeyData[datasourceKeyData.length - 1];
        } else {
            prevSeries = [0, 0];
        }
        var series: any = [];
        var time: any = (new Date).getTime();
        series.push(time);
        var value: any = dataKey.func(time, prevSeries[1]);
        series.push(value);
        datasourceData[dataKey.key].data = [series];
        for (var i: any = 0; i < listeners.length; i++) {
            var listener: any = listeners[i];
            listener.dataUpdated(datasourceData[dataKey.key],
                listener.datasourceIndex,
                dataKey.index, apply);
        }
    }

    /* eslint-disable */
    function currentTime() {
        return window.performance && window.performance.now ?
            window.performance.now() : Date.now();
    }
    /* eslint-enable */


    function onTick(apply?: any) {

        var now: any = currentTime();
        tickElapsed += now - tickScheduledTime;
        tickScheduledTime = now;

        if (timer) {
            $timeout.cancel(timer);
        }

        var key: any;
        if (datasourceSubscription.type === types.widgetType.timeseries.value) {
            var startTime: any;
            var endTime: any;
            var delta: any;
            var generatedData: any = {
                data: {
                }
            };
            if (!history) {
                delta = Math.floor(tickElapsed / frequency);
            }
            var deltaElapsed: any = history ? frequency : delta * frequency;
            tickElapsed = tickElapsed - deltaElapsed;
            for (key in dataKeys) {
                var dataKeyList: any = dataKeys[key];
                for (var index: any = 0; index < dataKeyList.length && (timer || history); index ++) {
                    var dataKey: any = dataKeyList[index];
                    if (!startTime) {
                        if (realtime) {
                            if (dataKey.lastUpdateTime) {
                                startTime = dataKey.lastUpdateTime + frequency;
                                endTime = dataKey.lastUpdateTime + deltaElapsed;
                            } else {
                                startTime = datasourceSubscription.subscriptionTimewindow.startTs;
                                endTime = startTime + datasourceSubscription.subscriptionTimewindow.realtimeWindowMs + frequency;
                                if (datasourceSubscription.subscriptionTimewindow.aggregation.type == types.aggregation.none.value) {
                                    var time: any = endTime - frequency * datasourceSubscription.subscriptionTimewindow.aggregation.limit;
                                    startTime = Math.max(time, startTime);
                                }
                            }
                        } else {
                            startTime = datasourceSubscription.subscriptionTimewindow.fixedWindow.startTimeMs;
                            endTime = datasourceSubscription.subscriptionTimewindow.fixedWindow.endTimeMs;
                        }
                    }
                    var data: any = generateSeries(dataKey, index, startTime, endTime);
                    generatedData.data[dataKey.name+'_'+dataKey.index] = data;
                }
            }
            if (dataAggregator) {
                dataAggregator.onData(generatedData, true, history, apply);
            }
        } else if (datasourceSubscription.type === types.widgetType.latest.value) {
            for (key in dataKeys) {
                generateLatest(dataKeys[key], apply);
            }
        }

        if (!history) {
            timer = $timeout(function() {onTick(true)}, frequency, false);
        }
    }

    function isNumeric(val?: any) {
        return (val - parseFloat( val ) + 1) >= 0;
    }

    function convertValue(val?: any) {
        if (val && isNumeric(val)) {
            return Number(val);
        } else {
            return val;
        }
        return undefined;
    }

    function onData(sourceData?: any, type?: any, apply?: any) {
        for (var keyName in sourceData) {
            var keyData: any = sourceData[keyName];
            var key: any = keyName + '_' + type;
            var dataKeyList: any = dataKeys[key];
            for (var keyIndex: any = 0; dataKeyList && keyIndex < dataKeyList.length; keyIndex++) {
                var datasourceKey: any = key + "_" + keyIndex;
                if (datasourceData[datasourceKey].data) {
                    var dataKey: any = dataKeyList[keyIndex];
                    var data: any = [];
                    var prevSeries: any;
                    var prevOrigSeries: any;
                    var datasourceKeyData: any;
                    var datasourceOrigKeyData: any;
                    var update: any = false;
                    if (realtime) {
                        datasourceKeyData = [];
                        datasourceOrigKeyData = [];
                    } else {
                        datasourceKeyData = datasourceData[datasourceKey].data;
                        datasourceOrigKeyData = dataSourceOrigData[datasourceKey].data;
                    }
                    if (datasourceKeyData.length > 0) {
                        prevSeries = datasourceKeyData[datasourceKeyData.length - 1];
                        prevOrigSeries = datasourceOrigKeyData[datasourceOrigKeyData.length -1];
                    } else {
                        prevSeries = [0, 0];
                        prevOrigSeries = [0, 0];
                    }
                    dataSourceOrigData[datasourceKey].data = [];
                    if (datasourceSubscription.type === types.widgetType.timeseries.value) {
                        var series: any, time: any, value: any;
                        for (var i: any = 0; i < keyData.length; i++) {
                            series = keyData[i];
                            time = series[0];
                            dataSourceOrigData[datasourceKey].data.push(series);
                            value = convertValue(series[1]);
                            if (dataKey.postFunc) {
                                value = dataKey.postFunc(time, value, prevSeries[1], prevOrigSeries[0], prevOrigSeries[1]);
                            }
                            prevOrigSeries = series;
                            series = [time, value];
                            data.push(series);
                            prevSeries = series;
                        }
                        update = true;
                    } else if (datasourceSubscription.type === types.widgetType.latest.value) {
                        if (keyData.length > 0) {
                            series = keyData[0];
                            time = series[0];
                            dataSourceOrigData[datasourceKey].data.push(series);
                            value = convertValue(series[1]);
                            if (dataKey.postFunc) {
                                value = dataKey.postFunc(time, value, prevSeries[1], prevOrigSeries[0], prevOrigSeries[1]);
                            }
                            series = [time, value];
                            data.push(series);
                        }
                        update = true;
                    }
                    if (update) {
                        datasourceData[datasourceKey].data = data;
                        for (var i2: any = 0; i2 < listeners.length; i2++) {
                            var listener: any = listeners[i2];
                            if (typeof listener === 'function')
                              continue;
                            listener.dataUpdated(datasourceData[datasourceKey],
                                listener.datasourceIndex,
                                dataKey.index, apply);
                        }
                    }
                }
            }
        }
    }
    return undefined;
}

const YEAR: any = 1000 * 60 * 60 * 24 * 365;

/**
 * Ported from the AngularJS factory `datasourceService` (module `thingsboard.api.datasource`) in src/app/api/datasource.service.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class DatasourceService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  // TODO(port): '$log' — console
  // TODO(port): '$timeout' — use setTimeout, or an rxjs timer
  private readonly telemetryWebsocketService = inject(TelemetryWebsocketService);
  private readonly utils = inject(UtilsService);

  private subscriptions: any = {};

  subscribeToDatasource(listener?: any, ...rest: any[]): any {
    var datasource: any = listener.datasource;

    if (datasource.type === types.datasourceType.entity && (!listener.entityId || !listener.entityType)) {
        return;
    }

    var subscriptionDataKeys: any = [];
    for (var d: any = 0; d < datasource.dataKeys.length; d++) {
        var dataKey: any = datasource.dataKeys[d];
        var subscriptionDataKey: any = {
            name: dataKey.name,
            type: dataKey.type,
            funcBody: dataKey.funcBody,
            postFuncBody: dataKey.postFuncBody
        }
        subscriptionDataKeys.push(subscriptionDataKey);
    }

    var datasourceSubscription: any = {
        datasourceType: datasource.type,
        dataKeys: subscriptionDataKeys,
        type: listener.subscriptionType
    };

    if (listener.subscriptionType === types.widgetType.timeseries.value) {
        datasourceSubscription.subscriptionTimewindow = structuredClone(listener.subscriptionTimewindow);
    }
    if (datasourceSubscription.datasourceType === types.datasourceType.entity) {
        datasourceSubscription.entityType = listener.entityType;
        datasourceSubscription.entityId = listener.entityId;
    }

    listener.datasourceSubscriptionKey = this.utils.objectHashCode(datasourceSubscription);
    var subscription: any;
    if (this.subscriptions[listener.datasourceSubscriptionKey]) {
        subscription = this.subscriptions[listener.datasourceSubscriptionKey];
        subscription.syncListener(listener);
    } else {
        subscription = new (DatasourceSubscription as any)(datasourceSubscription, this.telemetryWebsocketService, $timeout, $filter, $log, types, this.utils);
        this.subscriptions[listener.datasourceSubscriptionKey] = subscription;
        subscription.start();
    }
    subscription.addListener(listener);
  }

  unsubscribeFromDatasource(listener?: any, ...rest: any[]): any {
    if (listener.datasourceSubscriptionKey) {
        if (this.subscriptions[listener.datasourceSubscriptionKey]) {
            var subscription: any = this.subscriptions[listener.datasourceSubscriptionKey];
            subscription.removeListener(listener);
            if (!subscription.hasListeners()) {
                subscription.unsubscribe();
                delete this.subscriptions[listener.datasourceSubscriptionKey];
            }
        }
        listener.datasourceSubscriptionKey = null;
    }
  }
}
