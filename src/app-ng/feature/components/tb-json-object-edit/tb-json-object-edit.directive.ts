import { Component, DestroyRef, ElementRef, inject, input, model } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import $ from 'jquery';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../common/services/utils.service';
import { RootState } from '../../../root-state';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { UiAceDirective, UiAceOptions } from '../ui-ace/ui-ace.directive';
import { fixAceEditor } from '../ui-ace/ace-editor-fix';

/**
 * Ported from the AngularJS directive `tbJsonObjectEdit` (module `thingsboard.directives.jsonObjectEdit`)
 * in src/app/components/json-object-edit.directive.js:31: a JSON object edited as text in an ace editor,
 * bound through `[(ngModel)]` (the object), with tidy/minify and a fullscreen toggle.
 */
@Component({
  selector: 'tb-json-object-edit',
  standalone: true,
  imports: [NgClass, FormsModule, MatButtonModule, TranslatePipe, TbExpandFullscreenDirective, UiAceDirective],
  template: `
<div style="background: #fff;" [ngClass]="{'fill-height': fillHeight()}" tb-expand-fullscreen fullscreenZindex="100"
     expand-button-id="expand-button" (onFullscreenChanged)="onFullscreenChanged()" layout="column">
    <div layout="row" layout-align="start center" class="tb-json-object-edit-toolbar">
        <label class="tb-title no-padding"
               [ngClass]="{'tb-required': required(), 'tb-readonly': readonly(), 'tb-error': !objectValid}">{{ label() }}</label>
        <span flex></span>
        @if (!readonly()) {
        <button mat-button type="button" class="md-button tidy" [attr.aria-label]="'js-func.tidy' | translate" (click)="beautifyJSON()">
            {{ 'js-func.tidy' | translate }}
        </button>
        <button mat-button type="button" class="md-button tidy" [attr.aria-label]="'js-func.mini' | translate" (click)="minifyJSON()">
            {{ 'js-func.mini' | translate }}
        </button>
        }
        <button type="button" id="expand-button" aria-label="Fullscreen" class="md-button md-icon-button tb-md-32 tb-fullscreen-button-style"></button>
    </div>
    <div flex id="tb-json-panel" class="tb-json-object-panel" layout="column">
        <div flex id="tb-json-input" [ngClass]="{'fill-height': fillHeight()}"
             [readonly]="readonly()"
             [ui-ace]="jsonEditorOptions"
             [ngModel]="contentBody" (ngModelChange)="contentBody = $event">
        </div>
    </div>
</div>
  `,
  providers: ngModelProviders(TbJsonObjectEditDirective),
})
export class TbJsonObjectEditDirective extends NgModelController {
  readonly required = model<any>(undefined, { alias: 'ngRequired' });
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });
  readonly fillHeight = model<any>();
  readonly label = input<string>();

  protected readonly toast = inject(ToastService);
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);

  objectValid = true;
  validationError = '';
  json_editor: any;
  object: any;
  private contentBodyValue: any;

  readonly jsonEditorOptions: UiAceOptions = {
    useWrapMode: true,
    mode: 'json',
    advanced: {
      enableSnippets: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    },
    onLoad: (_ace: any) => {
      this.json_editor = _ace;
      this.json_editor.session.on('change', () => {
        this.cleanupJsonErrors();
      });
      fixAceEditor(_ace);
    },
  };

  constructor() {
    super();
    const offFormSubmit = this.rootScope.$on('form-submit', () => {
      if (!this.readonly()) {
        this.cleanupJsonErrors();
        if (!this.objectValid) {
          this.showError(this.validationError);
        }
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

  get contentBody(): any {
    return this.contentBodyValue;
  }

  /** The legacy `scope.$watch('contentBody', …)`: parse, and push the object to the form. */
  set contentBody(newVal: any) {
    const prevVal = this.contentBodyValue;
    this.contentBodyValue = newVal;
    if (newVal === prevVal) {
      return;
    }
    const object = this.parseContent();
    if (this.objectValid) {
      if (object == null) {
        this.object = null;
      } else {
        if (this.object == null) {
          this.object = {};
        }
        Object.keys(this.object).forEach((key) => {
          delete this.object[key];
        });
        Object.keys(object).forEach((key) => {
          this.object[key] = object[key];
        });
      }
      this.$setViewValue(this.object);
    }
    this.updateValidity();
  }

  override $render(): void {
    this.object = this.$viewValue;
    let content = '';
    try {
      if (this.object) {
        content = JSON.stringify(this.object, null, 2);
      }
    } catch (e: unknown) {
      // an unserializable value renders as empty, as angular.toJson's failure did
    }
    this.contentBodyValue = content;
    this.objectValid = true;
    this.validationError = '';
    this.parseContent();
    this.updateValidity();
  }

  onFullscreenChanged(): void {
    this.updateEditorSize();
  }

  beautifyJSON(): void {
    this.contentBody = JSON.stringify(this.object, null, 4);
  }

  minifyJSON(): void {
    this.contentBody = JSON.stringify(this.object);
  }

  updateEditorSize(): void {
    if (this.json_editor) {
      this.json_editor.resize();
      this.json_editor.renderer.updateFull();
    }
  }

  cleanupJsonErrors(): void {
    this.toast.hide();
  }

  updateValidity(): void {
    this.$setValidity('objectValid', this.objectValid);
  }

  showError(error: string): void {
    const toastParent = $('#tb-json-panel', $(this.element.nativeElement));
    this.toast.showError(error, toastParent, 'bottom left');
  }

  /** The legacy `scope.validate()`: parse the text, setting `objectValid`/`validationError`. */
  parseContent(): any {
    if (!this.contentBody || !this.contentBody.length) {
      if (this.required()) {
        this.validationError = 'Json object is required.';
        this.objectValid = false;
      } else {
        this.validationError = '';
        this.objectValid = true;
      }
      return null;
    }
    try {
      const object = JSON.parse(this.contentBody);
      this.validationError = '';
      this.objectValid = true;
      return object;
    } catch (e: unknown) {
      const details: any = this.utils.parseException(e);
      let errorInfo = 'Error:';
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
}
