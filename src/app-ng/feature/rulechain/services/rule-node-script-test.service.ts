import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { UtilsService } from '../../common/services/utils.service';
import { bindMethods } from '../../../bind-methods';
import { NodeScriptTestComponent } from '../node-script-test/node-script-test.component';

/**
 * Ported from the AngularJS factory `ruleNodeScriptTest` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree.
 */
@Injectable({ providedIn: 'root' })
export class RuleNodeScriptTestService {
  private readonly __bound = bindMethods(this);
  private readonly dialog = inject(MatDialog);
  private readonly ruleChainService = inject(RuleChainService);
  private readonly utils = inject(UtilsService);

  testNodeScript($event?: any, script?: any, scriptType?: any, functionTitle?: any, functionName?: any, argNames?: any, ruleNodeId?: any, ...rest: any[]): Promise<any> {
    if ($event) {
        $event.stopPropagation();
    }
    if (ruleNodeId) {
        return this.ruleChainService.getLatestRuleNodeDebugInput(ruleNodeId).then(
            (debugIn?: any) => {
                let msg: any, metadata: any, msgType: any;
                if (debugIn) {
                    if (debugIn.data) {
                        msg = JSON.parse(debugIn.data);
                    }
                    if (debugIn.metadata) {
                        metadata = JSON.parse(debugIn.metadata);
                    }
                    msgType = debugIn.msgType;
                }
                return this.openTestScriptDialog($event, script, scriptType, functionTitle,
                                     functionName, argNames, msg, metadata, msgType);
            }
        );
    }
    return this.openTestScriptDialog($event, script, scriptType, functionTitle,
        functionName, argNames);
  }

  openTestScriptDialog($event?: any, script?: any, scriptType?: any, functionTitle?: any, functionName?: any, argNames?: any, msg?: any, metadata?: any, msgType?: any, ...rest: any[]): Promise<any> {
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

    const onShowingCallback: any = {
        onShowed: (...rest: any[]) => {
        }
    };

    const inputParams: any = {
        script: script,
        scriptType: scriptType,
        functionName: functionName,
        argNames: argNames
    };

    return firstValueFrom(this.dialog.open(NodeScriptTestComponent, {
        data: {
            msg: msg,
            metadata: metadata,
            msgType: msgType,
            functionTitle: functionTitle,
            inputParams: inputParams,
            onShowingCallback: onShowingCallback
        },
        panelClass: 'tb-dialog'
    }).afterClosed()).then(
        (script?: any) => {
            if (script !== undefined) {
                return script;
            }
            return Promise.reject();
        }
    );
  }
}
