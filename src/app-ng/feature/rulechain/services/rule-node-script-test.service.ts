import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { UtilsService } from '../../common/services/utils.service';

import $ from 'jquery';
import { bindMethods } from '../../../legacy-injector';
import nodeScriptTestTemplate from '../../../../app/rulechain/script/node-script-test.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS factory `ruleNodeScriptTest` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class RuleNodeScriptTestService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly dialog = inject(MatDialog);
  private readonly document = inject(DOCUMENT);
  private readonly ruleChainService = inject(RuleChainService);
  private readonly utils = inject(UtilsService);

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  testNodeScript($event?: any, script?: any, scriptType?: any, functionTitle?: any, functionName?: any, argNames?: any, ruleNodeId?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if ($event) {
        $event.stopPropagation();
    }

    var msg: any, metadata: any, msgType: any;
    if (ruleNodeId) {
        this.ruleChainService.getLatestRuleNodeDebugInput(ruleNodeId).then(
            (debugIn?: any) => {
                if (debugIn) {
                    if (debugIn.data) {
                        msg = JSON.parse(debugIn.data);
                    }
                    if (debugIn.metadata) {
                        metadata = JSON.parse(debugIn.metadata);
                    }
                    msgType = debugIn.msgType;
                }
                this.openTestScriptDialog($event, script, scriptType, functionTitle,
                                     functionName, argNames, msg, metadata, msgType).then(
                    (script?: any) => {
                        deferred.resolve(script);
                    },
                    () => {
                        deferred.reject();
                    }
                );
            },
            () => {
                deferred.reject();
            }
        );
    } else {
        this.openTestScriptDialog($event, script, scriptType, functionTitle,
            functionName, argNames).then(
            (script?: any) => {
                deferred.resolve(script);
            },
            () => {
                deferred.reject();
            }
        );
    }
    return deferred.promise;
  }

  openTestScriptDialog($event?: any, script?: any, scriptType?: any, functionTitle?: any, functionName?: any, argNames?: any, msg?: any, metadata?: any, msgType?: any, ...rest: any[]): any {
    let vm = this;
    var deferred: any = $q.defer();
    if (!msg) {
        msg = {
            temperature: 22.4,
            humidity: 78
        };
    }
    if (!metadata) {
        metadata = {
            deviceType: "default",
            deviceName: "Test Device",
            ts: new Date().getTime() + ""
        };
    } else {
        metadata = this.utils.sortObjectKeys(metadata);
    }
    if (!msgType) {
        msgType = "POST_TELEMETRY_REQUEST";
    }

    var onShowingCallback: any = {
        onShowed: (...rest: any[]) => {
        }
    };

    var inputParams: any = {
        script: script,
        scriptType: scriptType,
        functionName: functionName,
        argNames: argNames
    };

    this.dialog.show({
        controller: 'NodeScriptTestController',
        controllerAs: 'vm',
        templateUrl: nodeScriptTestTemplate,
        parent: $(this.document.body),
        locals: {
            msg: msg,
            metadata: metadata,
            msgType: msgType,
            functionTitle: functionTitle,
            inputParams: inputParams,
            onShowingCallback: onShowingCallback
        },
        fullscreen: true,
        multiple: true,
        targetEvent: $event,
        onComplete: (...rest: any[]) => {
            onShowingCallback.onShowed();
        }
    }).then(
        (script?: any) => {
            deferred.resolve(script);
        },
        () => {
            deferred.reject();
        }
    );
    return deferred.promise;
  }
}
