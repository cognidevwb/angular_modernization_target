import { Component, forwardRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbMessageTypeAutocompleteDirective } from '../tb-message-type-autocomplete/tb-message-type-autocomplete.directive';
import { TbJsonContentDirective } from '../../components/tb-json-content/tb-json-content.directive';
import { TbKeyValMapDirective } from '../../components/tb-key-val-map/tb-key-val-map.directive';
import { TbJsFuncDirective } from '../../components/tb-js-func/tb-js-func.directive';

import $ from 'jquery';
import Split from 'split.js';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $mdUtil: any;
declare let $q: any;
declare let $scope: any;
declare let $window: any;

// Helpers at the legacy file's top level, beside the registration (as written).
declare let beautify: any;
const js_beautify: any = beautify.js;

/**
 * Ported from the AngularJS controller `NodeScriptTestController` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'node-script-test',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbMessageTypeAutocompleteDirective), forwardRef(() => TbJsonContentDirective), forwardRef(() => TbKeyValMapDirective), forwardRef(() => TbJsFuncDirective)],
  templateUrl: './node-script-test.component.html',
})
export class NodeScriptTestComponent {
  protected readonly rootScope = injectRoot(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly typesRef: any = types;
  protected readonly utils = inject(UtilsService);
  protected readonly ruleChainService = inject(RuleChainService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  types: any;
  functionTitle: any;
  inputParams: any;
  output: any = '';
  layoutInited: any;
  nodeScriptTestDialogElement: any;
  theForm: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $scope.$broadcast — a scope event: call the service that listens
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    this.types = this.typesRef;
    this.functionTitle = this.dialogData.functionTitle;
    this.inputParams = this.dialogData.inputParams;
    this.inputParams.msg = js_beautify(JSON.stringify(this.dialogData.msg), {indent_size: 4});
    this.inputParams.metadata = this.dialogData.metadata;
    this.inputParams.msgType = this.dialogData.msgType;
    this.test = this.test;
    this.save = this.save;
    this.cancel = this.cancel;
    $scope.$watch('theForm.metadataForm.$dirty', (newVal?: any) => {
        if (newVal) {
            this.toast.hide();
        }
    });
    this.dialogData.onShowingCallback.onShowed = () => {
        this.nodeScriptTestDialogElement = $('.tb-node-script-test-dialog');
        var w: any = this.nodeScriptTestDialogElement.width();
        if (w > 0) {
            this.initSplitLayout();
        } else {
            $scope.$watch(
                () => {
                    return this.nodeScriptTestDialogElement[0].offsetWidth || parseInt(this.nodeScriptTestDialogElement.css('width'), 10);
                },
                (newSize?: any) => {
                    if (newSize > 0) {
                        this.initSplitLayout();
                    }
                }
            );
        }
    };
  }

  onDividerDrag(...rest: any[]): any {
    $scope.$broadcast('update-ace-editor-size');
  }

  initSplitLayout(...rest: any[]): any {
    if (!this.layoutInited) {
        Split([$('#top_panel', this.nodeScriptTestDialogElement)[0], $('#bottom_panel', this.nodeScriptTestDialogElement)[0]], {
            sizes: [35, 65],
            gutterSize: 8,
            cursor: 'row-resize',
            direction: 'vertical',
            onDrag: (...rest: any[]) => {
                this.onDividerDrag()
            }
        });

        Split([$('#top_left_panel', this.nodeScriptTestDialogElement)[0], $('#top_right_panel', this.nodeScriptTestDialogElement)[0]], {
            sizes: [50, 50],
            gutterSize: 8,
            cursor: 'col-resize',
            onDrag: (...rest: any[]) => {
                this.onDividerDrag()
            }
        });

        Split([$('#bottom_left_panel', this.nodeScriptTestDialogElement)[0], $('#bottom_right_panel', this.nodeScriptTestDialogElement)[0]], {
            sizes: [50, 50],
            gutterSize: 8,
            cursor: 'col-resize',
            onDrag: (...rest: any[]) => {
                this.onDividerDrag()
            }
        });

        this.onDividerDrag();

        queueMicrotask(() => {
            this.layoutInited = true;
            var w: any = $($window);
            setTimeout(function () {
                w.triggerHandler('resize')
            });
        });

    }
  }

  test = (...rest: any[]): any => {
    this.testNodeScript().then(
        (output?: any) => {
            this.output = js_beautify(output, {indent_size: 4});
        }
    );
  };

  checkInputParamErrors(...rest: any[]): any {
    this.theForm.metadataForm.$setPristine();
    $scope.$broadcast('form-submit', 'validatePayload');
    if (!this.theForm.payloadForm.$valid) {
        return false;
    } else if (!this.theForm.metadataForm.$valid) {
        this.showMetadataError(this.translate.instant('rulenode.metadata-required'));
        return false;
    }
    return true;
  }

  showMetadataError(error?: any, ...rest: any[]): any {
    var toastParent: any = $('#metadata-panel', this.nodeScriptTestDialogElement);
    this.toast.showError(error, toastParent, 'bottom left');
  }

  testNodeScript(...rest: any[]): any {
    var deferred: any = $q.defer();
    if (this.checkInputParamErrors()) {
        $mdUtil.nextTick(() => {
            this.ruleChainService.testScript(this.inputParams).then(
                (result?: any) => {
                    if (result.error) {
                        this.toast.showError(result.error);
                        deferred.reject();
                    } else {
                        deferred.resolve(result.output);
                    }
                },
                () => {
                    deferred.reject();
                }
            );
        });
    } else {
        deferred.reject();
    }
    return deferred.promise;
  }

  cancel = (...rest: any[]): any => {
(this.dialog as any).cancel();
  };

  save = (...rest: any[]): any => {
    this.testNodeScript().then(() => {
        this.theForm.funcBodyForm.$setPristine();
(this.dialog as any).hide(this.inputParams.script);
    });
  };
}
