import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input, effect } from '@angular/core';
import ace from 'brace';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/mode/json';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/text';
import 'brace/snippets/json';
import 'brace/snippets/javascript';
import 'brace/snippets/html';
import 'brace/snippets/css';
import 'brace/snippets/text';
import 'brace/theme/github';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/** The option object the legacy `ui-ace="…"` attribute took (angular-ui-ace). */
export interface UiAceOptions {
  mode?: string;
  theme?: string;
  useWrapMode?: boolean;
  showGutter?: boolean;
  showPrintMargin?: boolean;
  firstLineNumber?: number;
  advanced?: Record<string, unknown>;
  rendererOptions?: Record<string, unknown>;
  onLoad?: (editor: any) => void;
  onChange?: (args: [any, any]) => void;
  onBlur?: (args: [any, any]) => void;
}

/**
 * The angular-ui-ace directive the legacy templates used (`<div ui-ace="opts" ng-model="text">`):
 * an ace editor on the host element, two-way bound through `[(ngModel)]` (a string).
 * `[ui-ace]` takes the options; `[readonly]` makes the editor read-only.
 */
@Directive({
  selector: '[ui-ace]',
  standalone: true,
  providers: ngModelProviders(UiAceDirective),
})
export class UiAceDirective extends NgModelController implements AfterViewInit, OnDestroy {
  readonly options = input<UiAceOptions | string | undefined>(undefined, { alias: 'ui-ace' });
  readonly readonly = input<unknown>(undefined);

  private readonly element = inject(ElementRef);
  private editor: any;
  private settingValue = false;

  constructor() {
    super();
    effect(() => {
      const ro = this.isReadonly(this.readonly());
      this.editor?.setReadOnly(ro);
    });
  }

  ngAfterViewInit(): void {
    const opts = this.resolvedOptions();
    const editor = ace.edit(this.element.nativeElement);
    this.editor = editor;
    editor.$blockScrolling = Infinity;
    const session = editor.getSession();
    session.setMode('ace/mode/' + (opts.mode || 'text'));
    if (opts.theme) {
      editor.setTheme('ace/theme/' + opts.theme);
    }
    if (opts.useWrapMode !== undefined) {
      session.setUseWrapMode(opts.useWrapMode);
    }
    if (opts.showGutter !== undefined) {
      editor.renderer.setShowGutter(opts.showGutter);
    }
    if (opts.showPrintMargin !== undefined) {
      editor.setShowPrintMargin(opts.showPrintMargin);
    }
    if (opts.firstLineNumber !== undefined) {
      editor.setOption('firstLineNumber', opts.firstLineNumber);
    }
    if (opts.advanced) {
      editor.setOptions(opts.advanced);
    }
    if (opts.rendererOptions) {
      (editor.renderer as any).setOptions(opts.rendererOptions);
    }
    editor.setReadOnly(this.isReadonly(this.readonly()) || this.$disabled);
    this.$render();
    session.on('change', (e: any) => {
      if (this.settingValue) {
        return;
      }
      this.$setViewValue(session.getValue());
      opts.onChange?.([e, editor]);
    });
    editor.on('blur', () => {
      this.$setTouched();
      opts.onBlur?.([undefined, editor]);
    });
    opts.onLoad?.(editor);
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  override $render(): void {
    if (!this.editor) {
      return;
    }
    const value = this.$viewValue == null ? '' : String(this.$viewValue);
    if (value === this.editor.getValue()) {
      return;
    }
    this.settingValue = true;
    this.editor.getSession().setValue(value);
    this.settingValue = false;
  }

  override setDisabledState(disabled: boolean): void {
    super.setDisabledState(disabled);
    this.editor?.setReadOnly(disabled || this.isReadonly(this.readonly()));
  }

  private resolvedOptions(): UiAceOptions {
    const opts = this.options();
    return opts && typeof opts === 'object' ? opts : {};
  }

  /** A static `readonly` attribute arrives as '' — present means read-only, as in HTML. */
  private isReadonly(value: unknown): boolean {
    return value === '' || (!!value && value !== 'false');
  }
}
