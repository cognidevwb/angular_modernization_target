import { Component, ElementRef, forwardRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import beautify from 'js-beautify';
import Split from 'split.js';
import $ from 'jquery';
import { RootState } from '../../../root-state';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { TbExpandFullscreenDirective } from '../tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbJsFuncDirective } from '../tb-js-func/tb-js-func.directive';
import { UiAceDirective, UiAceOptions } from '../ui-ace/ui-ace.directive';
import { SAMPLE_CSS, SAMPLE_HTML_TEMPLATE, SAMPLE_JS_FUNCTION } from './custom-action-samples';

const html_beautify = beautify.html;
const css_beautify = beautify.css;

/** The arguments a custom action's function is called with. */
const CUSTOM_ACTION_FUNCTION_ARGS = ['$event', 'widgetContext', 'entityId', 'entityName', 'htmlTemplate', 'additionalParams'];

/**
 * Ported from the AngularJS directive `tbCustomActionPrettyEditor` (module `thingsboard.directives.customActionPrettyEditor`)
 * in src/app/components/widget/action/custom-action-pretty-editor.directive.js:33: edits a custom-pretty widget action
 * (`[(ngModel)]`, the action object) — resources, CSS, HTML and the JS function — in tabs, or side by side in fullscreen.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-custom-action-pretty-editor',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatTabsModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, NgClass, FormsModule,
    UiAceDirective, forwardRef(() => TbExpandFullscreenDirective), forwardRef(() => TbJsFuncDirective)],
  templateUrl: './tb-custom-action-pretty-editor.directive.html',
  providers: ngModelProviders(TbCustomActionPrettyEditorDirective),
})
export class TbCustomActionPrettyEditorDirective extends NgModelController {
  protected readonly rootScope = inject(RootState);
  protected readonly element = inject(ElementRef);

  protected readonly functionArgs = CUSTOM_ACTION_FUNCTION_ARGS;
  private readonly ace_editors: any[] = [];
  fullscreen = false;
  action: any;
  customActionEditorElement: any;
  layoutInited = false;

  readonly htmlEditorOptions: UiAceOptions = {
    useWrapMode: true,
    mode: 'html',
    advanced: {
      enableSnippets: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    },
    onLoad: (_ace: any) => {
      this.ace_editors.push(_ace);
    },
  };

  readonly cssEditorOptions: UiAceOptions = {
    useWrapMode: true,
    mode: 'css',
    advanced: {
      enableSnippets: true,
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true,
    },
    onLoad: (_ace: any) => {
      this.ace_editors.push(_ace);
    },
  };

  override $render(): void {
    this.action = this.$viewValue;
    if (this.action && this.action.customHtml === undefined && this.action.customCss === undefined && this.action.customFunction === undefined) {
      this.action.customFunction = SAMPLE_JS_FUNCTION;
      this.action.customHtml = SAMPLE_HTML_TEMPLATE;
      this.action.customCss = SAMPLE_CSS;
    }
  }

  /** An edit inside the action: the action goes back to the form (and marks it dirty). */
  onActionChanged(): void {
    this.$setViewValue(this.action);
  }

  removeResource(index: number): void {
    if (index > -1) {
      this.action.customResources.splice(index, 1);
      this.onActionChanged();
    }
  }

  addResource(): void {
    if (!this.action.customResources) {
      this.action.customResources = [];
    }
    this.action.customResources.push({ url: '' });
    this.onActionChanged();
  }

  beautifyHtml(): void {
    this.action.customHtml = html_beautify(this.action.customHtml, { indent_size: 4, wrap_line_length: 60 });
    this.onActionChanged();
  }

  beautifyCss(): void {
    this.action.customCss = css_beautify(this.action.customCss, { indent_size: 4 });
    this.onActionChanged();
  }

  toggleFullscreen(): void {
    this.fullscreen = !this.fullscreen;
    if (this.fullscreen) {
      // the fullscreen panel renders on the next change detection; split it once it has a width
      setTimeout(() => this.initSplitLayoutWhenSized());
    } else {
      this.layoutInited = false;
    }
  }

  /** The legacy `$watch` on the editor's width: split as soon as the panel is laid out. */
  private initSplitLayoutWhenSized(attempt = 0): void {
    if (!this.fullscreen) {
      return;
    }
    this.customActionEditorElement = $('.tb-custom-action-editor', $(this.element.nativeElement));
    const el: HTMLElement | undefined = this.customActionEditorElement[0];
    const width = el ? el.offsetWidth || parseInt(this.customActionEditorElement.css('width'), 10) : 0;
    if (width > 0) {
      this.initSplitLayout();
    } else if (attempt < 50) {
      requestAnimationFrame(() => this.initSplitLayoutWhenSized(attempt + 1));
    }
  }

  onDividerDrag(): void {
    this.rootScope.$broadcast('update-ace-editor-size');
    for (const ace of this.ace_editors) {
      ace.resize();
      ace.renderer.updateFull();
    }
  }

  initSplitLayout(): void {
    if (!this.layoutInited) {
        Split([$('#left-panel', this.customActionEditorElement)[0], $('#right-panel', this.customActionEditorElement)[0]], {
            sizes: [50, 50],
            gutterSize: 8,
            cursor: 'col-resize',
            onDrag: () => {
                this.onDividerDrag();
            }
        });

        this.onDividerDrag();

        queueMicrotask(() => {
            this.layoutInited = true;
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            });
        });

    }
  }
}
