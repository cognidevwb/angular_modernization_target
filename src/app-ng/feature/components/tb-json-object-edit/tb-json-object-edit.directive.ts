import { Component, inject, model, effect, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../common/services/utils.service';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import fixAceEditor from '../../../../app/components/ace-editor-fix';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RootState } from '../../../root-state';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;

/**
 * Ported from the AngularJS directive `tbJsonObjectEdit` (module `thingsboard.directives.jsonObjectEdit`) in src/app/components/json-object-edit.directive.js:31.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-json-object-edit',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <div id="tb-json-panel" class="tb-json-object-edit">
      @if (label) {
        <label class="tb-title" [class.tb-error]="!objectValid">{{ label }}</label>
      }
      <div class="tb-json-toolbar">
        <button type="button" mat-icon-button [attr.aria-label]="'action.beautify' | translate" (click)="beautifyJSON()">
          <mat-icon>code</mat-icon>
        </button>
        <button type="button" mat-icon-button [attr.aria-label]="'action.minify' | translate" (click)="minifyJSON()">
          <mat-icon>format_align_left</mat-icon>
        </button>
      </div>
      <textarea class="tb-json-editor" [(ngModel)]="contentBody" [readonly]="readonly()"></textarea>
      @if (!objectValid) {
        <div class="tb-json-error">{{ validationError }}</div>
      }
    </div>
  `,
  providers: ngModelProviders(TbJsonObjectEditDirective),
})
export class TbJsonObjectEditDirective extends NgModelController {
  readonly required = model<any>(undefined, { alias: 'ngRequired' });
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });
  readonly fillHeight = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly toast = inject(ToastService);
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);
  protected readonly destroy$ = new Subject<void>();

  label: any;
  objectValid: any = true;
  validationError: any = '';
  jsonEditorOptions: any;
  $on: any;
  $watch: any;
  contentBody: any;
  _prevContentBody: any;
  json_editor: any;
  object: any;
  onChange: (value: any) => void = () => {};
  onValidatorChange: () => void = () => {};

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    inject(DestroyRef).onDestroy(() => this.destroy$.next());
    this.label = this.attrs.label;
    this.json_editor;
    this.jsonEditorOptions = {
            useWrapMode: true,
            mode: 'json',
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
    effect(() => {
      const newVal = this.contentBody;
      if (!isEqual(newVal, this._prevContentBody)) {
            var object: any = this.validate();
            if (this.objectValid) {
                if (object == null) {
                    this.object = null;
                } else {
                    if (this.object == null) {
                        this.object = {};
                    }
                    Object.keys(this.object).forEach((key?: any) => {
                        delete this.object[key];
                    });
                    Object.keys(object).forEach((key?: any) => {
                        this.object[key] = object[key];
                    });
                }
                this.onChange(this.object);
            }
            this.updateValidity();
      }
      this._prevContentBody = newVal;
    });
    this.rootScope.formSubmit$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            if (!this.readonly()) {
                this.cleanupJsonErrors();
                if (!this.objectValid) {
                    this.showError(this.validationError);
                }
            }
        });
    this.rootScope.updateAceEditorSize$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.updateEditorSize();
        });
  }

  override $render(): void {
    this.object = this.$viewValue;
    var content: any = '';
    try {
        if (this.object) {
            content = JSON.stringify(this.object, null, 2);
        }
    } catch (e: any) {
        //
    }
    this.contentBody = content;
  }

  onFullscreenChanged(...rest: any[]): any {
    this.updateEditorSize();
  }

  beautifyJSON(...rest: any[]): any {
    this.contentBody = JSON.stringify(this.object, null, 4);
  }

  minifyJSON(...rest: any[]): any {
    this.contentBody = JSON.stringify(this.object);
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
    this.onValidatorChange();
  }

  showError(error?: any, ...rest: any[]): any {
    var toastParent: any = $('#tb-json-panel', $(this.element.nativeElement));
    this.toast.showError(error, toastParent, 'bottom left');
  }

  validate(...rest: any[]): any {
    if (!this.contentBody || !this.contentBody.length) {
        if (this.required()) {
            this.validationError = 'Json object is required.';
            this.objectValid = false;
        } else {
            this.validationError = '';
            this.objectValid = true;
        }
        return null;
    } else {
        try {
            var object: any = JSON.parse(this.contentBody);
            this.validationError = '';
            this.objectValid = true;
            return object;
        } catch (e: any) {
            var details: any = this.utils.parseException(e);
            var errorInfo: any = 'Error:';
            if (details.name) {
                errorInfo += ' ' + details.name + ':';
            }
            if (details.message) {
                errorInfo += ' ' + details.message;
            }
            this.validationError = errorInfo;
            this.objectValid = false;
            return null;
        }
    }
    return undefined;
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
