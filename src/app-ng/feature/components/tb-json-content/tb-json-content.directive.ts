import { Component, DestroyRef, ElementRef, effect, inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';
import $ from 'jquery';
import * as beautify from 'js-beautify';
import { ToastService } from '../../services/toast.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { UiAceDirective, UiAceOptions } from '../ui-ace/ui-ace.directive';
import { fixAceEditor } from '../ui-ace/ace-editor-fix';

const js_beautify: any = beautify.js;

/**
 * Ported from the AngularJS directive `tbJsonContent` (module `thingsboard.directives.jsonContent`)
 * in src/app/components/json-content.directive.js:37: text content (JSON, JS, text …) in an ace editor,
 * bound through `[(ngModel)]` (the string), validated as JSON when `validateContent` is set.
 */
@Component({
  selector: 'tb-json-content',
  standalone: true,
  imports: [TranslatePipe, MatButtonModule, CommonModule, FormsModule, TbExpandFullscreenDirective, UiAceDirective],
  templateUrl: './tb-json-content.directive.html',
  providers: ngModelProviders(TbJsonContentDirective),
})
export class TbJsonContentDirective extends NgModelController {
  readonly contentType = model<any>();
  readonly validateContent = model<any>();
  readonly hideErrorToast = model<any>();
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });
  readonly fillHeight = model<any>();
  readonly label = input<string>();
  readonly validationTriggerArg = input<any>(undefined, { alias: 'validation-trigger-arg' });

  protected readonly toast = inject(ToastService);
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);

  contentValid = true;
  json_editor: any;
  private contentBodyValue: any;

  readonly jsonEditorOptions: UiAceOptions = {
    useWrapMode: true,
    mode: 'text',
    advanced: {
      enableSnippets: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    },
    onLoad: (_ace: any) => {
      this.json_editor = _ace;
      this.json_editor.session.setMode('ace/mode/' + this.modeFor(this.contentType()));
      this.json_editor.session.on('change', () => {
        this.cleanupJsonErrors();
      });
      fixAceEditor(_ace);
    },
  };

  constructor() {
    super();
    // `scope.$watch('contentType', …)`
    effect(() => {
      const mode = this.modeFor(this.contentType());
      if (this.json_editor) {
        this.json_editor.session.setMode('ace/mode/' + mode);
      }
    });
    const offFormSubmit = this.rootScope.$on('form-submit', (_event: any, args?: any) => {
      if (!this.readonly()) {
        const triggerArg = this.validationTriggerArg();
        if (!args || (triggerArg && triggerArg == args)) {
          this.cleanupJsonErrors();
          this.contentValid = true;
          this.updateValidity();
          this.contentValid = this.validateBody();
          this.updateValidity();
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

  /** The legacy `scope.$watch('contentBody', …)`: push to the form, re-validate on change. */
  set contentBody(newContent: any) {
    const prev = this.contentBodyValue;
    this.contentBodyValue = newContent;
    if (newContent === prev) {
      return;
    }
    this.$setViewValue(newContent);
    this.contentValid = this.validateBody();
    this.updateValidity();
  }

  override $render(): void {
    this.contentBodyValue = this.$viewValue;
  }

  onFullscreenChanged(): void {
    this.updateEditorSize();
  }

  beautifyJSON(): void {
    this.contentBody = js_beautify(this.contentBody, { indent_size: 4, wrap_line_length: 60 });
  }

  minifyJSON(): void {
    this.contentBody = JSON.stringify(JSON.parse(this.contentBody));
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
    this.$setValidity('contentBody', this.contentValid);
  }

  showError(error: string): void {
    const toastParent = $('#tb-json-panel', $(this.element.nativeElement));
    this.toast.showError(error, toastParent, 'bottom left');
  }

  /** The legacy `scope.validate()`: parse JSON content when asked to validate it. */
  validateBody(): boolean {
    try {
      if (this.validateContent() && this.contentType() == types.contentType.JSON.value) {
        JSON.parse(this.contentBody);
      }
      return true;
    } catch (e: unknown) {
      if (!this.hideErrorToast()) {
        const details: any = this.utils.parseException(e);
        let errorInfo = 'Error:';
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
  }

  private modeFor(contentType: any): string {
    return contentType ? (types as any).contentType[contentType].code : 'text';
  }
}
