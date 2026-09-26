import { inject, Injectable } from '@angular/core';
import { RootState } from '../../../root-state';
import { ToastService } from '../../services/toast.service';
import { UserService } from './user.service';
import { types } from '../../common/constants/types';
import { bindMethods } from '../../../bind-methods';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $mdUtil: any;
declare let $websocket: any;
declare let $window: any;

// Helpers at the legacy file's top level, beside the registration (as written).
const WS_IDLE_TIMEOUT: any = 90000;

const RECONNECT_INTERVAL: any = 2000;

const MAX_PUBLISH_COMMANDS: any = 10;

/**
 * Ported from the AngularJS factory `telemetryWebsocketService` (module `thingsboard.api.telemetryWebsocket`) in src/app/api/telemetry-websocket.service.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class TelemetryWebsocketService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  private readonly rootScope = inject(RootState);
  // TODO(port): '$websocket' — an AngularJS built-in with no Angular counterpart
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  private readonly toast = inject(ToastService);
  private readonly userService = inject(UserService);

  private isOpening: any = false;
  private isOpened: any = false;
  private isActive: any = false;
  private isReconnect: any = false;
  private reconnectSubscribers: any = [];
  private lastCmdId: any = 0;
  private subscribers: any = {};
  private subscribersCount: any = 0;
  private commands: any = {};
  private cmdsWrapper: any = {
            tsSubCmds: [],
            historyCmds: [],
            attrSubCmds: []
        };
  private telemetryUri: any;
  private dataStream: any;
  private location: any = window.location;
  private socketCloseTimer: any;
  private reconnectTimer: any;
  private port: any;
  private telemetryWsLogoutSub: any;
  private telemetryWsLoginSub: any;

  // TODO(port): $rootScope.$broadcast — a root scope event: call the service that listens
  // TODO(port): $rootScope.$on — a root scope event: subscribe to the service that raises it

  constructor() {
    this.port = this.location.port;
    if (this.location.protocol === "https:") {
        if (!this.port) {
            this.port = "443";
        }
        this.telemetryUri = "wss:";
    } else {
        if (!this.port) {
            this.port = "80";
        }
        this.telemetryUri = "ws:";
    }
    this.telemetryUri += "//" + this.location.hostname + ":" + this.port;
    this.telemetryUri += "/api/ws/plugins/telemetry";
    this.telemetryWsLogoutSub = this.rootScope.$on('unauthenticated', (doLogout?: any) => {
        if (doLogout) {
            this.reset(true);
        }
    });
    this.telemetryWsLoginSub = this.rootScope.$on('authenticated', () => {
        this.reset(true);
    });
  }

  publishCommands(...rest: any[]): any {
    while(this.isOpened && this.hasCommands()) {
        this.dataStream.send(this.preparePublishCommands()).then(() => {
            this.checkToClose();
        });
    }
    this.tryOpenSocket();
  }

  hasCommands(...rest: any[]): any {
    return this.cmdsWrapper.tsSubCmds.length > 0 ||
        this.cmdsWrapper.historyCmds.length > 0 ||
        this.cmdsWrapper.attrSubCmds.length > 0;
  }

  preparePublishCommands(...rest: any[]): any {
    var preparedWrapper: any = {};
    var leftCount: any = MAX_PUBLISH_COMMANDS;
    preparedWrapper.tsSubCmds = this.popCmds(this.cmdsWrapper.tsSubCmds, leftCount);
    leftCount -= preparedWrapper.tsSubCmds.length;
    preparedWrapper.historyCmds = this.popCmds(this.cmdsWrapper.historyCmds, leftCount);
    leftCount -= preparedWrapper.historyCmds.length;
    preparedWrapper.attrSubCmds = this.popCmds(this.cmdsWrapper.attrSubCmds, leftCount);
    return preparedWrapper;
  }

  popCmds(cmds?: any, leftCount?: any, ...rest: any[]): any {
    var toPublish: any = Math.min(cmds.length, leftCount);
    if (toPublish > 0) {
        return cmds.splice(0, toPublish);
    } else {
        return [];
    }
    return undefined;
  }

  onError = (errorEvent?: any, ...rest: any[]): any => {
    if (errorEvent) {
        //showWsError(0, errorEvent);
        console.warn('WebSocket error event', errorEvent);
    }
    this.isOpening = false;
  };

  onOpen = (...rest: any[]): any => {
    this.isOpening = false;
    this.isOpened = true;
    if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
    }
    if (this.isReconnect) {
        this.isReconnect = false;
        for (var r: any=0; r<this.reconnectSubscribers.length;r++) {
            var reconnectSubscriber: any = this.reconnectSubscribers[r];
            if (reconnectSubscriber.onReconnected) {
                reconnectSubscriber.onReconnected();
            }
            this.subscribe(reconnectSubscriber);
        }
        this.reconnectSubscribers = [];
    } else {
        this.publishCommands();
    }
  };

  onClose = (closeEvent?: any, ...rest: any[]): any => {
    if (closeEvent && closeEvent.code > 1000 && closeEvent.code !== 1006) {
        this.showWsError(closeEvent.code, closeEvent.reason);
    }
    this.isOpening = false;
    this.isOpened = false;
    if (this.isActive) {
        if (!this.isReconnect) {
            this.reconnectSubscribers = [];
            for (var id in this.subscribers) {
                var subscriber: any = this.subscribers[id];
                if (this.reconnectSubscribers.indexOf(subscriber) === -1) {
                    this.reconnectSubscribers.push(subscriber);
                }
            }
            this.reset(false);
            this.isReconnect = true;
        }
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }
        this.reconnectTimer = setTimeout(this.tryOpenSocket, RECONNECT_INTERVAL, false);
    }
  };

  onMessage = (message?: any, ...rest: any[]): any => {
    if (message.data) {
        var data: any = JSON.parse(message.data);
        if (data.errorCode) {
            this.showWsError(data.errorCode, data.errorMsg);
        } else if (data.subscriptionId) {
            var subscriber: any = this.subscribers[data.subscriptionId];
            if (subscriber && data) {
                var keys: any = this.fetchKeys(data.subscriptionId);
                if (!data.data) {
                    data.data = {};
                }
                for (var k: any = 0; k < keys.length; k++) {
                    var key: any = keys[k];
                    if (!data.data[key]) {
                        data.data[key] = [];
                    }
                }
                subscriber.onData(data, data.subscriptionId);
            }
        }
    }
    this.checkToClose();
  };

  showWsError(errorCode?: any, errorMsg?: any, ...rest: any[]): any {
    var message: any = 'WebSocket Error: ';
    if (errorMsg) {
        message += errorMsg;
    } else {
        message += "error code - " + errorCode + ".";
    }
    setTimeout(() => {
        this.toast.showError(message);
    }, 0);
  }

  fetchKeys(subscriptionId?: any, ...rest: any[]): any {
    var command: any = this.commands[subscriptionId];
    if (command && command.keys && command.keys.length > 0) {
        return command.keys.split(",");
    } else {
        return [];
    }
    return undefined;
  }

  nextCmdId(...rest: any[]): any {
    this.lastCmdId++;
    return this.lastCmdId;
  }

  subscribe(subscriber?: any, ...rest: any[]): any {
    this.isActive = true;
    var cmdId: any;
    if ((subscriber.subscriptionCommands !== undefined)) {
        for (var i: any=0;i<subscriber.subscriptionCommands.length;i++) {
            var subscriptionCommand: any = subscriber.subscriptionCommands[i];
            cmdId = this.nextCmdId();
            this.subscribers[cmdId] = subscriber;
            subscriptionCommand.cmdId = cmdId;
            this.commands[cmdId] = subscriptionCommand;
            if (subscriber.type === types.dataKeyType.timeseries) {
                this.cmdsWrapper.tsSubCmds.push(subscriptionCommand);
            } else if (subscriber.type === types.dataKeyType.attribute) {
                this.cmdsWrapper.attrSubCmds.push(subscriptionCommand);
            }
        }
    }
    if ((subscriber.historyCommands !== undefined)) {
        for (i=0;i<subscriber.historyCommands.length;i++) {
            var historyCommand: any = subscriber.historyCommands[i];
            cmdId = this.nextCmdId();
            this.subscribers[cmdId] = subscriber;
            historyCommand.cmdId = cmdId;
            this.commands[cmdId] = historyCommand;
            this.cmdsWrapper.historyCmds.push(historyCommand);
        }
    }
    this.subscribersCount++;
    this.publishCommands();
  }

  unsubscribe(subscriber?: any, ...rest: any[]): any {
    if (this.isActive) {
        var cmdId: any = null;
        if (subscriber.subscriptionCommands) {
            for (var i: any=0;i<subscriber.subscriptionCommands.length;i++) {
                var subscriptionCommand: any = subscriber.subscriptionCommands[i];
                subscriptionCommand.unsubscribe = true;
                if (subscriber.type === types.dataKeyType.timeseries) {
                    this.cmdsWrapper.tsSubCmds.push(subscriptionCommand);
                } else if (subscriber.type === types.dataKeyType.attribute) {
                    this.cmdsWrapper.attrSubCmds.push(subscriptionCommand);
                }
                cmdId = subscriptionCommand.cmdId;
                if (cmdId) {
                    if (this.subscribers[cmdId]) {
                        delete this.subscribers[cmdId];
                    }
                    if (this.commands[cmdId]) {
                        delete this.commands[cmdId];
                    }
                }
            }
        }
        if (subscriber.historyCommands) {
            for (i=0;i<subscriber.historyCommands.length;i++) {
                var historyCommand: any = subscriber.historyCommands[i];
                cmdId = historyCommand.cmdId;
                if (cmdId) {
                    if (this.subscribers[cmdId]) {
                        delete this.subscribers[cmdId];
                    }
                    if (this.commands[cmdId]) {
                        delete this.commands[cmdId];
                    }
                }
            }
        }
        var index: any = this.reconnectSubscribers.indexOf(subscriber);
        if (index > -1) {
            this.reconnectSubscribers.splice(index, 1);
        }
        this.subscribersCount--;
        this.publishCommands();
    }
  }

  checkToClose(...rest: any[]): any {
    if (this.subscribersCount === 0 && this.isOpened) {
        if (!this.socketCloseTimer) {
            this.socketCloseTimer = setTimeout(this.closeSocket, WS_IDLE_TIMEOUT, false);
        }
    }
  }

  tryOpenSocket = (...rest: any[]): any => {
    if (this.isActive) {
        if (!this.isOpened && !this.isOpening) {
            this.isOpening = true;
            if (this.userService.isJwtTokenValid()) {
                this.openSocket(this.userService.getJwtToken());
            } else {
                this.userService.refreshJwtToken().then(() => {
                    this.openSocket(this.userService.getJwtToken());
                }, () => {
                    this.isOpening = false;
                    this.rootScope.$broadcast('unauthenticated');
                });
            }
        }
        if (this.socketCloseTimer) {
            clearTimeout(this.socketCloseTimer);
            this.socketCloseTimer = null;
        }
    }
  };

  openSocket(token?: any, ...rest: any[]): any {
    this.dataStream = new WebSocket(this.telemetryUri + '?token=' + token) as any;
    this.dataStream.onError(this.onError);
    this.dataStream.onOpen(this.onOpen);
    this.dataStream.onClose(this.onClose);
    this.dataStream.onMessage(this.onMessage, {autoApply: false});
  }

  closeSocket = (...rest: any[]): any => {
    this.isActive = false;
    if (this.isOpened) {
        this.dataStream.close();
    }
  };

  reset(close?: any, ...rest: any[]): any {
    if (this.socketCloseTimer) {
        clearTimeout(this.socketCloseTimer);
        this.socketCloseTimer = null;
    }
    this.lastCmdId = 0;
    this.subscribers = {};
    this.subscribersCount = 0;
    this.commands = {};
    this.cmdsWrapper.tsSubCmds = [];
    this.cmdsWrapper.historyCmds = [];
    this.cmdsWrapper.attrSubCmds = [];
    if (close) {
        this.closeSocket();
    }
  }
}
