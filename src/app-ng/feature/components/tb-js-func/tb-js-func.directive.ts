import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { linkAttrs } from '../../../legacy-link';
import { RootState } from '../../../root-state';
import ace from 'brace';
import $ from 'jquery';
import fixAceEditor from '../../../../app/components/ace-editor-fix';
import jsFuncTemplate from '../../../../app/components/js-func.tpl.html?raw';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let vm: any;
declare let element: any;
declare let ngModelCtrl: any;

// Helpers at the legacy file's top level, beside the registration (as written).
import beautify from 'js-beautify';

/**
 * Ported from the AngularJS directive `tbJsFunc` (module `thingsboard.directives.jsFunc`) in src/app/components/js-func.directive.js:40.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-js-func',
  standalone: true,
  imports: [TranslatePipe, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbExpandFullscreenDirective)],
  templateUrl: './tb-js-func.directive.html',
})
export class TbJsFuncDirective {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly noValidate = model<any>();
  readonly fillHeight = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);

protected template: any = jsFuncTemplate;
  functionName: any;
  functionArgs: any;
  validationArgs: any;
  resultType: any;
  validationTriggerArg: any;
  functionValid: any = true;
  protected Range: any = ace.acequire("ace/range").Range;
  errorMarkers: any = [];
  functionArgsString: any = '';
  jsEditorOptions: any;
  $eval: any;
  $on: any;
  $watch: any;
  errorAnnotationId: any;
  functionBody: any;
  js_editor: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.functionName = this.attrs.functionName;
this.functionArgs = this.attrs.functionArgs;
this.validationArgs = this.attrs.validationArgs;
    this.resultType = this.attrs.resultType;
    if (!this.resultType || this.resultType.length === 0) {
            this.resultType = "nocheck";
        }
    this.validationTriggerArg = this.attrs.validationTriggerArg;
    this.js_editor;
    for (var i: any = 0; i < this.functionArgs.length; i++) {
            if (this.functionArgsString.length > 0) {
                this.functionArgsString += ', ';
            }
            this.functionArgsString += this.functionArgs[i];
        }
    this.jsEditorOptions = {
            useWrapMode: true,
            mode: 'javascript',
            advanced: {
                enableSnippets: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            },
            onLoad: (_ace?: any, ...rest: any[]) => {
                this.js_editor = _ace;
                this.js_editor.session.on("change", () => {
                    this.cleanupJsErrors();
                });
                fixAceEditor(_ace);
            }
        };
    this.$watch('functionBody', (newFunctionBody?: any, oldFunctionBody?: any) => {
            ngModelCtrl.$setViewValue(this.functionBody);
            if (!angular.equals(newFunctionBody, oldFunctionBody)) {
                this.functionValid = true;
            }
            this.updateValidity();
        });
    ngModelCtrl.$render = function () {
            this.functionBody = ngModelCtrl.$viewValue;
        };
this.formSubmitSub = this.rootScope.$on('form-submit', (args?: any) => {
      if (!args || this.validationTriggerArg && this.validationTriggerArg == args) {
            this.validationArgs = this.attrs.validationArgs;
            this.cleanupJsErrors();
            this.functionValid = true;
            this.updateValidity();
            this.functionValid = this.validate();
            this.updateValidity();
        }
    });
this.updateAceEditorSizeSub = this.rootScope.$on('update-ace-editor-size', () => {
      this.updateEditorSize();
    });
  }

  onFullscreenChanged(...rest: any[]): any {
    this.updateEditorSize();
  }

  beautifyJs(...rest: any[]): any {
    var res: any = beautify(this.functionBody, {indent_size: 4, wrap_line_length: 60});
    this.functionBody = res;
  }

  updateEditorSize(...rest: any[]): any {
    if (this.js_editor) {
        this.js_editor.resize();
        this.js_editor.renderer.updateFull();
    }
  }

  cleanupJsErrors(...rest: any[]): any {
    this.toast.hide();
    for (var i: any = 0; i < this.errorMarkers.length; i++) {
        this.js_editor.session.removeMarker(this.errorMarkers[i]);
    }
    this.errorMarkers = [];
    if (this.errorAnnotationId && this.errorAnnotationId > -1) {
        var annotations: any = this.js_editor.session.getAnnotations();
        annotations.splice(this.errorAnnotationId, 1);
        this.js_editor.session.setAnnotations(annotations);
        this.errorAnnotationId = -1;
    }
  }

  updateValidity(...rest: any[]): any {
ngModelCtrl.setErrors(this.functionValid ? null : { functionBody: true });
  }

  showError(error?: any, ...rest: any[]): any {
    var toastParent: any = $('#tb-javascript-panel', $(this.element.nativeElement));
    var dialogContent: any = toastParent.closest('md-dialog-content');
    if (dialogContent.length > 0) {
        toastParent = dialogContent;
    }
    this.toast.showError(error, toastParent, 'bottom left');
  }

  validate(...rest: any[]): any {
    let vm = this;
    try {
        var toValidate: any = new Function(vm.functionArgsString, vm.functionBody);
        if (vm.noValidate()) {
            return true;
        }
        var res: any;
        var validationError: any;
        for (var i: any=0;i<vm.validationArgs.length;i++) {
            try {
                res = toValidate.apply(this, vm.validationArgs[i]);
                validationError = null;
                break;
            } catch (e: any) {
                validationError = e;
            }
        }
        if (validationError) {
            throw validationError;
        }
        if (vm.resultType != 'nocheck') {
            if (vm.resultType === 'any') {
                if ((res === undefined)) {
                    vm.showError(vm.translate.instant('js-func.no-return-error'));
                    return false;
                }
            } else {
                var resType: any = typeof res;
                if (resType != vm.resultType) {
                    vm.showError(vm.translate.instant('js-func.return-type-mismatch', {type: vm.resultType}));
                    return false;
                }
            }
        }
        return true;
    } catch (e: any) {
        var details: any = vm.utils.parseException(e);
        var errorInfo: any = 'Error:';
        if (details.name) {
            errorInfo += ' ' + details.name + ':';
        }
        if (details.message) {
            errorInfo += ' ' + details.message;
        }
        if (details.lineNumber) {
            errorInfo += '<br>Line ' + details.lineNumber;
            if (details.columnNumber) {
                errorInfo += ' column ' + details.columnNumber;
            }
            errorInfo += ' of script.';
        }
        vm.showError(errorInfo);
        if (vm.js_editor && details.lineNumber) {
            var line: any = details.lineNumber - 1;
            var column: any = 0;
            if (details.columnNumber) {
                column = details.columnNumber;
            }

            var errorMarkerId: any = vm.js_editor.session.addMarker(new vm.Range(line, 0, line, Infinity), "ace_active-line", "screenLine");
            vm.errorMarkers.push(errorMarkerId);
            var annotations: any = vm.js_editor.session.getAnnotations();
            var errorAnnotation: any = {
                row: line,
                column: column,
                text: details.message,
                type: "error"
            };
            vm.errorAnnotationId = annotations.push(errorAnnotation) - 1;
            vm.js_editor.session.setAnnotations(annotations);
        }
        return false;
    }
    return undefined;
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
