import { Component, DestroyRef, ElementRef, computed, forwardRef, inject, input, model } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import ace from 'brace';
import beautify from 'js-beautify';
import $ from 'jquery';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../common/services/utils.service';
import { RootState } from '../../../root-state';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { UiAceDirective, UiAceOptions } from '../ui-ace/ui-ace.directive';
import { fixAceEditor } from '../ui-ace/ace-editor-fix';

/**
 * Ported from the AngularJS directive `tbJsFunc` (module `thingsboard.directives.jsFunc`) in src/app/components/js-func.directive.js:40:
 * a JavaScript function body edited in ace (`[(ngModel)]`, the body text), validated on `form-submit` by running it
 * against `validationArgs` and checking the result against `resultType`.
 * The legacy read `function-args` / `validation-args` with `scope.$eval(attrs.…)`; they are array inputs here.
 */
@Component({
  selector: 'tb-js-func',
  standalone: true,
  imports: [TranslatePipe, MatButtonModule, NgClass, FormsModule, UiAceDirective, forwardRef(() => TbExpandFullscreenDirective)],
  templateUrl: './tb-js-func.directive.html',
  providers: ngModelProviders(TbJsFuncDirective),
})
export class TbJsFuncDirective extends NgModelController {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly noValidate = model<any>();
  readonly fillHeight = model<any>();
  readonly functionName = input<string | undefined>(undefined);
  readonly functionArgs = input<string[] | null | undefined>([]);
  readonly validationArgs = input<any[][] | null | undefined>([]);
  readonly resultTypeInput = input<string | undefined>(undefined, { alias: 'result-type' });
  readonly validationTriggerArg = input<string | undefined>(undefined, { alias: 'validation-trigger-arg' });

  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);

  protected readonly Range: any = ace.acequire('ace/range').Range;
  readonly functionArgsString = computed(() => (this.functionArgs() ?? []).join(', '));
  readonly resultType = computed(() => this.resultTypeInput() || 'nocheck');
  functionValid = true;
  errorMarkers: any[] = [];
  errorAnnotationId: any;
  private functionBodyValue: any;
  js_editor: any;

  readonly jsEditorOptions: UiAceOptions = {
    useWrapMode: true,
    mode: 'javascript',
    advanced: {
      enableSnippets: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    },
    onLoad: (_ace: any) => {
      this.js_editor = _ace;
      this.js_editor.session.on('change', () => {
        this.cleanupJsErrors();
      });
      fixAceEditor(_ace);
    },
  };

  constructor() {
    super();
    const offFormSubmit = this.rootScope.$on('form-submit', (_event: unknown, args?: any) => {
      const trigger = this.validationTriggerArg();
      if (!args || (trigger && trigger == args)) {
        this.cleanupJsErrors();
        this.functionValid = true;
        this.updateValidity();
        this.functionValid = this.validateFunction();
        this.updateValidity();
      }
    });
    const offEditorSize = this.rootScope.$on('update-ace-editor-size', () => {
      this.updateEditorSize();
    });
    inject(DestroyRef).onDestroy(() => {
      offFormSubmit();
      offEditorSize();
    });
  }

  get functionBody(): any {
    return this.functionBodyValue;
  }

  /** The legacy `$watch('functionBody', …)`: the edited body goes to the form. */
  set functionBody(newFunctionBody: any) {
    const oldFunctionBody = this.functionBodyValue;
    this.functionBodyValue = newFunctionBody;
    this.$setViewValue(newFunctionBody);
    if (newFunctionBody !== oldFunctionBody) {
      this.functionValid = true;
    }
    this.updateValidity();
  }

  override $render(): void {
    this.functionBodyValue = this.$viewValue;
  }

  onFullscreenChanged(): void {
    this.updateEditorSize();
  }

  beautifyJs(): void {
    this.functionBody = beautify(this.functionBody, { indent_size: 4, wrap_line_length: 60 });
  }

  updateEditorSize(): void {
    if (this.js_editor) {
        this.js_editor.resize();
        this.js_editor.renderer.updateFull();
    }
  }

  cleanupJsErrors(): void {
    this.toast.hide();
    if (!this.js_editor) {
        return;
    }
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

  updateValidity(): void {
    this.$setValidity('functionBody', this.functionValid);
  }

  showError(error: string): void {
    var toastParent: any = $('#tb-javascript-panel', $(this.element.nativeElement));
    var dialogContent: any = toastParent.closest('md-dialog-content');
    if (dialogContent.length > 0) {
        toastParent = dialogContent;
    }
    this.toast.showError(error, toastParent, 'bottom left');
  }

  /** The legacy `scope.validate()`: compile and run the body; false (with the error shown) when it fails. */
  validateFunction(): boolean {
    const vm = this;
    try {
        var toValidate: any = new Function(vm.functionArgsString(), vm.functionBody);
        if (vm.noValidate()) {
            return true;
        }
        var res: any;
        var validationError: any;
        const validationArgs = vm.validationArgs() ?? [];
        for (var i: any=0;i<validationArgs.length;i++) {
            try {
                res = toValidate.apply(this, validationArgs[i]);
                validationError = null;
                break;
            } catch (e: any) {
                validationError = e;
            }
        }
        if (validationError) {
            throw validationError;
        }
        const resultType = vm.resultType();
        if (resultType != 'nocheck') {
            if (resultType === 'any') {
                if ((res === undefined)) {
                    vm.showError(vm.translate.instant('js-func.no-return-error'));
                    return false;
                }
            } else {
                var resType: any = typeof res;
                if (resType != resultType) {
                    vm.showError(vm.translate.instant('js-func.return-type-mismatch', {type: resultType}));
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
  }
}
