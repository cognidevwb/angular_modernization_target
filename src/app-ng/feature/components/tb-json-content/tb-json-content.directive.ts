import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import fixAceEditor from '../../../../app/components/ace-editor-fix';
import jsonContentTemplate from '../../../../app/components/json-content.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

// Helpers at the legacy file's top level, beside the registration (as written).
const js_beautify: any = beautify.js;

/**
 * Ported from the AngularJS directive `tbJsonContent` (module `thingsboard.directives.jsonContent`) in src/app/components/json-content.directive.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-json-content',
  standalone: true,
  imports: [TranslatePipe, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbExpandFullscreenDirective)],
  templateUrl: './tb-json-content.directive.html',
})
export class TbJsonContentDirective {
  readonly contentType = model<any>();
  readonly validateContent = model<any>();
  readonly hideErrorToast = model<any>();
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });
  readonly fillHeight = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly toast = inject(ToastService);
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(jsonContentTemplate);
  label: any;
  validationTriggerArg: any;
  contentValid: any = true;
  protected mode: any;
  jsonEditorOptions: any;
  $on: any;
  $watch: any;
  contentBody: any;
  json_editor: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.label = this.attrs.label;
    this.validationTriggerArg = this.attrs.validationTriggerArg;
    this.json_editor;
    if (this.contentType()) {
            this.mode = types.contentType[this.contentType()].code;
        } else {
            this.mode = 'text';
        }
    this.jsonEditorOptions = {
            useWrapMode: true,
            mode: this.mode,
            advanced: {
                enableSnippets: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            },
            onLoad: (_ace?: any, ...rest: any[]) => {
                this.json_editor = _ace;
                this.json_editor.session.on("change", () => {
                    this.cleanupJsonErrors();
                });
                fixAceEditor(_ace);
            }
        };
    this.$watch('contentType', () => {
            var mode: any;
            if (this.contentType()) {
                mode = types.contentType[this.contentType()].code;
            } else {
                mode = 'text';
            }
            if (this.json_editor) {
                this.json_editor.session.setMode('ace/mode/' + mode);
            }
        });
    this.$watch('contentBody', (newContent?: any, oldContent?: any) => {
            ngModelCtrl.$setViewValue(this.contentBody);
            if (!angular.equals(newContent, oldContent)) {
                this.contentValid = this.validate();
            }
            this.updateValidity();
        });
    ngModelCtrl.$render = function () {
            this.contentBody = ngModelCtrl.$viewValue;
        };
    this.$on('form-submit', (event?: any, args?: any) => {
            if (!this.readonly()) {
                if (!args || this.validationTriggerArg && this.validationTriggerArg == args) {
                    this.cleanupJsonErrors();
                    this.contentValid = true;
                    this.updateValidity();
                    this.contentValid = this.validate();
                    this.updateValidity();
                }
            }
        });
    this.$on('update-ace-editor-size', () => {
            this.updateEditorSize();
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  onFullscreenChanged(...rest: any[]): any {
    this.updateEditorSize();
  }

  beautifyJSON(...rest: any[]): any {
    this.contentBody = js_beautify(this.contentBody, {indent_size: 4, wrap_line_length: 60});
  }

  minifyJSON(...rest: any[]): any {
    this.contentBody = JSON.stringify(JSON.parse(this.contentBody));
  }

  updateEditorSize(...rest: any[]): any {
    if (this.json_editor) {
        this.json_editor.resize();
        this.json_editor.renderer.updateFull();
    }
  }

  cleanupJsonErrors(...rest: any[]): any {
    this.toast.hide();
  }

  updateValidity(...rest: any[]): any {
    ngModelCtrl.$setValidity('contentBody', this.contentValid);
  }

  showError(error?: any, ...rest: any[]): any {
    var toastParent: any = $('#tb-json-panel', $(this.element.nativeElement));
    this.toast.showError(error, toastParent, 'bottom left');
  }

  validate(...rest: any[]): any {
    try {
        if (this.validateContent()) {
            if (this.contentType() == types.contentType.JSON.value) {
                JSON.parse(this.contentBody);
            }
        }
        return true;
    } catch (e: any) {
        if (!this.hideErrorToast()) {
            var details: any = this.utils.parseException(e);
            var errorInfo: any = 'Error:';
            if (details.name) {
                errorInfo += ' ' + details.name + ':';
            }
            if (details.message) {
                errorInfo += ' ' + details.message;
            }
            this.showError(errorInfo);
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
