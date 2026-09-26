import { Component, DestroyRef, Directive, DoCheck, ElementRef, HostListener, OnDestroy, OnInit, forwardRef, inject, input, output, effect } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { goState } from '../../../state-paths';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbConfirmOnExitDirective } from '../../components/tb-confirm-on-exit/tb-confirm-on-exit.directive';
import { SaveWidgetTypeAsComponent } from '../save-widget-type-as/save-widget-type-as.component';
import $ from 'jquery';
import ace from 'brace';
import 'brace/ext/language_tools';
import 'brace/ext/searchbox';
import 'brace/mode/javascript';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/json';
import 'brace/snippets/javascript';
import 'brace/snippets/text';
import 'brace/snippets/html';
import 'brace/snippets/css';
import 'brace/snippets/json';
import Split from 'split.js';
import { firstValueFrom } from 'rxjs';
import beautify from 'js-beautify';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { WIDGET_EDITOR_EVENT } from '../../dashboard/widget-editor-frame';

// Helpers at the legacy file's top level, beside the registration (as written).
const js_beautify: any = (beautify as any).js;

const html_beautify: any = (beautify as any).html;

const css_beautify: any = (beautify as any).css;

/**
 * The `ui-ace` attribute of the legacy template: an Ace editor on the host element whose
 * text is two-way bound (`value` in, `valueChange` out) and configured from the same
 * options object (`mode`, `useWrapMode`, `advanced`, `onLoad`).
 */
@Directive({
  selector: '[tbWidgetAce]',
  standalone: true,
})
export class TbWidgetAceDirective implements OnInit, OnDestroy {
  readonly options = input<any>(undefined, { alias: 'tbWidgetAce' });
  readonly value = input<any>(undefined);
  readonly valueChange = output<any>();

  private readonly element = inject(ElementRef);
  private editor: any;
  private settingValue = false;

  constructor() {
    effect(() => {
      const value: any = this.value();
      this.applyValue(value);
    });
  }

  ngOnInit(): void {
    const options: any = this.options() || {};
    this.editor = ace.edit(this.element.nativeElement);
    this.editor.$blockScrolling = Infinity;
    if (options.mode) {
      this.editor.session.setMode('ace/mode/' + options.mode);
    }
    if (options.useWrapMode !== undefined) {
      this.editor.session.setUseWrapMode(options.useWrapMode);
    }
    if (options.advanced) {
      this.editor.setOptions(options.advanced);
    }
    this.applyValue(this.value());
    this.editor.session.on('change', () => {
      if (!this.settingValue) {
        this.valueChange.emit(this.editor.getValue());
      }
    });
    if (options.onLoad) {
      options.onLoad(this.editor);
    }
  }

  ngOnDestroy(): void {
    const options: any = this.options() || {};
    if (this.editor) {
      if (options.onUnload) {
        options.onUnload(this.editor);
      }
      this.editor.destroy();
      this.editor = undefined;
    }
  }

  private applyValue(value: any): void {
    if (!this.editor) {
      return;
    }
    const text: string = value === undefined || value === null ? '' : String(value);
    if (this.editor.getValue() !== text) {
      this.settingValue = true;
      this.editor.setValue(text, -1);
      this.settingValue = false;
    }
  }
}

/**
 * Ported from the AngularJS controller `WidgetEditorController` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 */
@Component({
  selector: 'widget-editor',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatTabsModule, MatSelectModule, MatProgressSpinnerModule, MatMenuModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, forwardRef(() => TbConfirmOnExitDirective), TbWidgetAceDirective],
  templateUrl: './widget-editor.component.html',
})
export class WidgetEditorComponent implements DoCheck {
  protected readonly widgetService = inject(WidgetService);
  protected readonly userService = inject(UserService);
  protected readonly toast = inject(ToastService);
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  protected readonly dialog = inject(MatDialog);
  protected readonly destroyRef = inject(DestroyRef);

  protected Range: any = ace.acequire("ace/range").Range;
  protected ace_editors: any = [];
  protected js_editor: any;
  /** The editor's preview iframe (looked up when used: the template is not rendered in the constructor). */
  protected get iframe(): any {
    return $('iframe', $(this.element.nativeElement));
  }
  protected gotError: any = false;
  protected errorMarkers: any = [];
  protected errorAnnotationId: any = -1;
  protected elem: any;
  protected widgetsBundleId: any;
  isDirty: any = false;
  fullscreen: any = false;
  widgetType: any = null;
  widget: any = null;
  origWidget: any = null;
  widgetTypes: any = types.widgetType;
  /** `ng-repeat="type in vm.widgetTypes"` iterated the map's values. */
  widgetTypeList: any[] = Object.values(types.widgetType);
  iframeWidgetEditModeInited: any = false;
  layoutInited: any = false;
  htmlEditorOptions: any;
  cssEditorOptions: any;
  jsonSettingsEditorOptions: any;
  dataKeyJsonSettingsEditorOptions: any;
  jsEditorOptions: any;
  loading: any;
  saveWidgetAsEvent: any;
  saveWidgetAsPending: any;
  saveWidgetPending: any;
  saveWidgetTimeout: any;
  widgetWatcher: any;
  widgetsBundle: any;
  resource: any;

  /** Which editor panel is expanded to fullscreen (the per-panel `tb-expand-fullscreen` buttons). */
  expandedPanel: string | null = null;
  /** The `$scope.$watch('vm.widget', …, true)` state: the last seen widget, or undefined when not watching. */
  private widgetWatchSnapshot: string | undefined;
  /** The `$scope.$watch('vm.widget.type')` state. */
  private widgetTypeWatchInited = false;
  private lastWidgetType: any;
  /** The element-width `$watch` waiting for a non-zero width before the split layout. */
  private splitWidthWatchPending = false;
  /** The hotkeys bound in `initHotKeys` (the legacy `hotkeys.bindTo($scope)`). */
  private hotkeysBound = false;
  private readonly eventDeregistrations: Array<() => void> = [];

  constructor() {
    this.elem = $($(this.element.nativeElement));
    this.widgetsBundleId = this.route.snapshot.params['widgetsBundleId'];
    this.widgetsBundle;
    this.htmlEditorOptions = {
        useWrapMode: true,
        mode: 'html',
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.ace_editors.push(_ace);
        },
        onUnload: (_ace?: any) => {
            this.removeAceEditor(_ace);
        }
    };
    this.cssEditorOptions = {
        useWrapMode: true,
        mode: 'css',
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.ace_editors.push(_ace);
        },
        onUnload: (_ace?: any) => {
            this.removeAceEditor(_ace);
        }
    };
    this.jsonSettingsEditorOptions = {
        useWrapMode: true,
        mode: 'json',
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.ace_editors.push(_ace);
        },
        onUnload: (_ace?: any) => {
            this.removeAceEditor(_ace);
        }
    };
    this.dataKeyJsonSettingsEditorOptions = {
        useWrapMode: true,
        mode: 'json',
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.ace_editors.push(_ace);
        },
        onUnload: (_ace?: any) => {
            this.removeAceEditor(_ace);
        }
    };
    this.jsEditorOptions = {
        useWrapMode: true,
        mode: 'javascript',
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.ace_editors.push(_ace);
            this.js_editor = _ace;
            this.js_editor.session.on("change", () => {
                this.cleanupJsErrors();
            });
        },
        onUnload: (_ace?: any) => {
            this.removeAceEditor(_ace);
            if (this.js_editor === _ace) {
                this.js_editor = undefined;
            }
        }
    };
    this.addResource = this.addResource;
    this.applyWidgetScript = this.applyWidgetScript;
    this.beautifyCss = this.beautifyCss;
    this.beautifyDataKeyJson = this.beautifyDataKeyJson;
    this.beautifyHtml = this.beautifyHtml;
    this.beautifyJs = this.beautifyJs;
    this.beautifyJson = this.beautifyJson;
    this.removeResource = this.removeResource;
    this.undoDisabled = this.undoDisabled;
    this.undoWidget = this.undoWidget;
    this.saveDisabled = this.saveDisabled;
    this.saveWidget = this.saveWidget;
    this.saveAsDisabled = this.saveAsDisabled;
    this.saveWidgetAs = this.saveWidgetAs;
    this.toggleFullscreen = this.toggleFullscreen;
    this.isReadOnly = this.isReadOnly;
    this.destroyRef.onDestroy(() => {
        this.eventDeregistrations.forEach((deregister) => deregister());
    });
    this.listenToPreviewFrame();
    this.initWidgetEditor();
  }

  /**
   * The preview iframe's dashboard reports `widgetEditModeInited`, `widgetEditUpdated` and `widgetException`
   * as a `WIDGET_EDITOR_EVENT` on its iframe element (see widget-editor-frame.ts); they are broadcast here on
   * the RootState, as the legacy dashboard broadcast them on this page's root scope. The event does not
   * bubble, so it is caught on the way down (capture) at this component's element.
   */
  private listenToPreviewFrame(): void {
    const host: HTMLElement = this.element.nativeElement;
    const listener = (event: Event): void => {
      if (event.target instanceof HTMLIFrameElement) {
        const detail: { name: string; args?: any[] } = (event as CustomEvent).detail;
        this.rootScope.$broadcast(detail.name, ...(detail.args ?? []));
      }
    };
    host.addEventListener(WIDGET_EDITOR_EVENT, listener, true);
    this.eventDeregistrations.push(() => host.removeEventListener(WIDGET_EDITOR_EVENT, listener, true));
  }

  private removeAceEditor(editor: any): void {
    const index: number = this.ace_editors.indexOf(editor);
    if (index > -1) {
        this.ace_editors.splice(index, 1);
    }
  }

  /** The legacy digest's watchers: the deep widget watch, the widget-type watch and the width watch. */
  ngDoCheck(): void {
    if (this.widgetTypeWatchInited && this.widget) {
        const type: any = this.widget.type;
        if (type !== this.lastWidgetType) {
            this.lastWidgetType = type;
            this.onWidgetTypeChanged();
        }
    }
    if (this.widgetWatchSnapshot !== undefined) {
        const current: string = JSON.stringify(this.widget);
        if (current !== this.widgetWatchSnapshot) {
            this.widgetWatchSnapshot = current;
            this.isDirty = true;
        }
    }
    if (this.splitWidthWatchPending) {
        const newSize: any = this.elem[0].offsetWidth || parseInt(this.elem.css('width'), 10);
        if (newSize > 0) {
            this.splitWidthWatchPending = false;
            this.initSplitLayout();
        }
    }
  }

  initWidgetEditor(...rest: any[]): any {

    this.rootScope.loading = true;

    this.widgetService.getWidgetsBundle(this.widgetsBundleId).then(
        (widgetsBundle?: any) => {
            this.widgetsBundle = widgetsBundle;
            if (this.route.snapshot.params['widgetTypeId']) {
                this.widgetService.getWidgetTypeById(this.route.snapshot.params['widgetTypeId']).then(
                    (widgetType?: any) => {
                        this.setWidgetType(widgetType)
                        this.widgetTypeLoaded();
                    },
                    () => {
                        this.toast.showError(this.translate.instant('widget.widget-type-load-failed-error'));
                        this.widgetTypeLoaded();
                    }
                );
            } else {
                var type: any = this.route.snapshot.params['widgetType'];
                if (!type) {
                    type = types.widgetType.timeseries.value;
                }
                this.widgetService.getWidgetTemplate(type).then(
                    (widgetTemplate?: any) => {
                        this.widget = structuredClone(widgetTemplate);
                        this.widget.widgetName = null;
                        this.origWidget = structuredClone(this.widget);
                        this.isDirty = true;
                        this.widgetTypeLoaded();
                    },
                    () => {
                        this.toast.showError(this.translate.instant('widget.widget-template-load-failed-error'));
                        this.widgetTypeLoaded();
                    }
                );
            }
        },
        () => {
            this.toast.showError(this.translate.instant('widget.widget-type-load-failed-error'));
            this.widgetTypeLoaded();
        }
    );

  }

  setWidgetType(widgetType?: any, ...rest: any[]): any {
    this.widgetType = widgetType;
    this.widget = this.widgetService.toWidgetInfo(this.widgetType);
    var config: any = JSON.parse(this.widget.defaultConfig);
    this.widget.defaultConfig = JSON.stringify(config)
    this.origWidget = structuredClone(this.widget);
    this.isDirty = false;
  }

  widgetTypeLoaded(...rest: any[]): any {
    this.initHotKeys();

    this.initWatchers();

    $(this.document).ready(() => {
        var w: any = this.elem.width();
        if (w > 0) {
            this.initSplitLayout();
        } else {
            this.splitWidthWatchPending = true;
        }
    });

    this.iframe.attr('data-widget', JSON.stringify(this.widget));
    this.iframe.attr('src', '/widget-editor');
  }

  undoDisabled = (...rest: any[]): any => {
    return this.loading
            || !this.isDirty
            || !this.iframeWidgetEditModeInited
            || this.saveWidgetPending
            || this.saveWidgetAsPending;
  };

  saveDisabled = (...rest: any[]): any => {
    return this.isReadOnly()
            || this.loading
            || !this.isDirty
            || !this.iframeWidgetEditModeInited
            || this.saveWidgetPending
            || this.saveWidgetAsPending;
  };

  saveAsDisabled = (...rest: any[]): any => {
    return this.loading
        || !this.iframeWidgetEditModeInited
        || this.saveWidgetPending
        || this.saveWidgetAsPending;
  };

  initHotKeys(...rest: any[]): any {
    this.hotkeysBound = true;
  }

  /** The hotkeys of `initHotKeys` (allowed in INPUT, SELECT and TEXTAREA, as the legacy bindings were). */
  @HostListener('document:keydown', ['$event'])
  onHotKey(event: KeyboardEvent): void {
    if (!this.hotkeysBound || !event.ctrlKey || event.altKey || event.metaKey) {
        return;
    }
    const key: string = event.key.toLowerCase();
    if (!event.shiftKey && key === 'q') {
        if (!this.undoDisabled()) {
            event.preventDefault();
            this.undoWidget();
        }
    } else if (!event.shiftKey && key === 's') {
        if (!this.saveDisabled()) {
            event.preventDefault();
            this.saveWidget();
        }
    } else if (event.shiftKey && key === 's') {
        if (!this.saveAsDisabled()) {
            event.preventDefault();
            this.saveWidgetAs();
        }
    } else if (event.shiftKey && key === 'f') {
        event.preventDefault();
        this.toggleFullscreen();
    } else if (!event.shiftKey && key === 'enter') {
        event.preventDefault();
        this.applyWidgetScript();
    }
  }

  initWatchWidget(...rest: any[]): any {
    this.widgetWatchSnapshot = JSON.stringify(this.widget);
    this.widgetWatcher = () => {
        this.widgetWatchSnapshot = undefined;
    };
  }

  initWatchers(...rest: any[]): any {
    this.initWatchWidget();

    this.lastWidgetType = this.widget ? this.widget.type : undefined;
    this.widgetTypeWatchInited = true;

    this.eventDeregistrations.push(this.rootScope.$on('widgetEditModeInited', () => {
        this.iframeWidgetEditModeInited = true;
        if (this.saveWidgetPending || this.saveWidgetAsPending) {
            if (!this.saveWidgetTimeout) {
                this.saveWidgetTimeout = setTimeout(() => {
                    if (!this.gotError) {
                        if (this.saveWidgetPending) {
                            this.commitSaveWidget();
                        } else if (this.saveWidgetAsPending) {
                            this.commitSaveWidgetAs();
                        }
                    } else {
                        this.toast.showError(this.translate.instant('widget.unable-to-save-widget-error'));
                        this.saveWidgetPending = false;
                        this.saveWidgetAsPending = false;
                        this.initWatchWidget();
                    }
                    this.saveWidgetTimeout = undefined;
                }, 1500);
            }
        }
    }));

    this.eventDeregistrations.push(this.rootScope.$on('widgetEditUpdated', (event?: any, widget?: any) => {
        this.widget.sizeX = widget.sizeX / 2;
        this.widget.sizeY = widget.sizeY / 2;
        this.widget.defaultConfig = JSON.stringify(widget.config);
        this.iframe.attr('data-widget', JSON.stringify(this.widget));
    }));

    this.eventDeregistrations.push(this.rootScope.$on('widgetException', (event?: any, details?: any) => {
        if (!this.gotError) {
            this.gotError = true;
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
            if (!this.saveWidgetPending && !this.saveWidgetAsPending) {
                this.toast.showError(errorInfo, $('#javascript_panel', $(this.element.nativeElement))[0]);
            }
            if (this.js_editor && details.lineNumber) {
                var line: any = details.lineNumber - 1;
                var column: any = 0;
                if (details.columnNumber) {
                    column = details.columnNumber;
                }

                var errorMarkerId: any = this.js_editor.session.addMarker(new this.Range(line, 0, line, Infinity), "ace_active-line", "screenLine");
                this.errorMarkers.push(errorMarkerId);
                var annotations: any = this.js_editor.session.getAnnotations();
                var errorAnnotation: any = {
                    row: line,
                    column: column,
                    text: details.message,
                    type: "error"
                };
                this.errorAnnotationId = annotations.push(errorAnnotation) - 1;
                this.js_editor.session.setAnnotations(annotations);
            }
        }
    }));
  }

  /** The `$scope.$watch('vm.widget.type')` listener: reshapes the default config for the new type. */
  private onWidgetTypeChanged(): void {
    var config: any = JSON.parse(this.widget.defaultConfig);
    if (this.widget.type !== types.widgetType.rpc.value
        && this.widget.type !== types.widgetType.alarm.value) {
        if (config.targetDeviceAliases) {
            delete config.targetDeviceAliases;
        }
        if (config.alarmSource) {
            delete config.alarmSource;
        }
        if (!config.datasources) {
            config.datasources = [];
        }
        if (!config.timewindow) {
            config.timewindow = {
                realtime: {
                    timewindowMs: 60000
                }
            };
        }
        for (var i: any = 0; i < config.datasources.length; i++) {
            var datasource: any = config.datasources[i];
            datasource.type = this.widget.type;
        }
    } else if (this.widget.type == types.widgetType.rpc.value) {
        if (config.datasources) {
            delete config.datasources;
        }
        if (config.alarmSource) {
            delete config.alarmSource;
        }
        if (config.timewindow) {
            delete config.timewindow;
        }
        if (!config.targetDeviceAliases) {
            config.targetDeviceAliases = [];
        }
    } else { // alarm
        if (config.datasources) {
            delete config.datasources;
        }
        if (config.targetDeviceAliases) {
            delete config.targetDeviceAliases;
        }
        if (!config.alarmSource) {
            config.alarmSource = {};
            config.alarmSource.type = this.widget.type
        }
        if (!config.timewindow) {
            config.timewindow = {
                realtime: {
                    timewindowMs: 24 * 60 * 60 * 1000
                }
            };
        }
    }
    this.widget.defaultConfig = JSON.stringify(config);
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

  onDividerDrag(...rest: any[]): any {
    for (var i: any = 0; i < this.ace_editors.length; i++) {
        var ace: any = this.ace_editors[i];
        ace.resize();
        ace.renderer.updateFull();
    }
  }

  initSplitLayout(...rest: any[]): any {
    if (!this.layoutInited) {
        Split([$('#top_panel', $(this.element.nativeElement))[0], $('#bottom_panel', $(this.element.nativeElement))[0]], {
            sizes: [35, 65],
            gutterSize: 8,
            cursor: 'row-resize',
            direction: 'vertical',
            onDrag: (...rest: any[]) => {
                this.onDividerDrag()
            }
        });

        Split([$('#top_left_panel', $(this.element.nativeElement))[0], $('#top_right_panel', $(this.element.nativeElement))[0]], {
            sizes: [50, 50],
            gutterSize: 8,
            cursor: 'col-resize',
            onDrag: (...rest: any[]) => {
                this.onDividerDrag()
            }
        });

        Split([$('#javascript_panel', $(this.element.nativeElement))[0], $('#frame_panel', $(this.element.nativeElement))[0]], {
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
            this.rootScope.loading = false;
            var w: any = $(window);
            setTimeout(function () {
                w.triggerHandler('resize')
            });
        });

    }
  }

  removeResource = (index?: any, ...rest: any[]): any => {
    if (index > -1) {
        this.widget.resources.splice(index, 1);
    }
  };

  addResource = (...rest: any[]): any => {
    this.widget.resources.push({url: ''});
  };

  applyWidgetScript = (...rest: any[]): any => {
    this.cleanupJsErrors();
    this.gotError = false;
    this.iframeWidgetEditModeInited = false;
    var config: any = JSON.parse(this.widget.defaultConfig);
    config.title = this.widget.widgetName;
    this.widget.defaultConfig = JSON.stringify(config);
    this.iframe.attr('data-widget', JSON.stringify(this.widget));
    this.iframe[0].contentWindow.location.reload(true);
  };

  /** The per-panel `tb-expand-fullscreen` button: expands or restores that panel. */
  toggleExpandedPanel(panel: string, $event?: Event): void {
    if ($event) {
        $event.stopPropagation();
    }
    this.expandedPanel = this.expandedPanel === panel ? null : panel;
  }

  toggleFullscreen = (...rest: any[]): any => {
    this.fullscreen = !this.fullscreen;
  };

  isReadOnly = (...rest: any[]): any => {
    if (this.userService.getAuthority() === 'TENANT_ADMIN') {
        return !this.widgetsBundle || this.widgetsBundle.tenantId.id === types.id.nullUid;
    } else {
        return this.userService.getAuthority() != 'SYS_ADMIN';
    }
    return undefined;
  };

  undoWidget = (...rest: any[]): any => {
    if (this.widgetWatcher) {
        this.widgetWatcher();
    }
    this.widget = structuredClone(this.origWidget);
    this.isDirty = false;
    this.initWatchWidget();
    this.applyWidgetScript();
  };

  saveWidget = (...rest: any[]): any => {
    if (!this.widget.widgetName) {
        this.toast.showError(this.translate.instant('widget.missing-widget-title-error'));
    } else {
        this.widgetWatcher();
        this.saveWidgetPending = true;
        this.applyWidgetScript();
    }
  };

  saveWidgetAs = ($event?: any, ...rest: any[]): any => {
    this.widgetWatcher();
    this.saveWidgetAsPending = true;
    this.saveWidgetAsEvent = $event;
    this.applyWidgetScript();
  };

  commitSaveWidget(...rest: any[]): any {
    var id: any = (this.widgetType && this.widgetType.id) ? this.widgetType.id : undefined;
    this.widgetService.saveWidgetType(this.widget, id, this.widgetsBundle.alias).then(
        (widgetType?: any) => {
            this.setWidgetType(widgetType)
            this.saveWidgetPending = false;
            this.initWatchWidget();
            this.toast.showSuccess(this.translate.instant('widget.widget-saved'), 500);
        }, () => {
            this.saveWidgetPending = false;
            this.initWatchWidget();
        }
    );
  }

  commitSaveWidgetAs(...rest: any[]): any {
    firstValueFrom(this.dialog.open(SaveWidgetTypeAsComponent, {
        panelClass: 'tb-fullscreen-dialog'
    }).afterClosed()).then((saveWidgetAsData?: any) => {
        if (!saveWidgetAsData) {
            this.saveWidgetAsPending = false;
            this.initWatchWidget();
            return;
        }
        this.widget.widgetName = saveWidgetAsData.widgetName;
        this.widget.alias = undefined;
        var config: any = JSON.parse(this.widget.defaultConfig);
        config.title = this.widget.widgetName;
        this.widget.defaultConfig = JSON.stringify(config);

        this.saveWidgetAsPending = false;
        this.isDirty = false;
        this.initWatchWidget();
        this.widgetService.saveWidgetType(this.widget, undefined, saveWidgetAsData.bundleAlias).then(
            (widgetType?: any) => {
                goState(this.router, 'home.widgets-bundles.widget-types.widget-type',
                    {widgetsBundleId: saveWidgetAsData.bundleId, widgetTypeId: widgetType.id.id});
            },
            () => {
                this.saveWidgetAsPending = false;
                this.initWatchWidget();
            }
        );
    }, () => {
        this.saveWidgetAsPending = false;
        this.initWatchWidget();
    });
  }

  beautifyJs = (...rest: any[]): any => {
    var res: any = js_beautify(this.widget.controllerScript, {indent_size: 4, wrap_line_length: 60});
    this.widget.controllerScript = res;
  };

  beautifyHtml = (...rest: any[]): any => {
    var res: any = html_beautify(this.widget.templateHtml, {indent_size: 4, wrap_line_length: 60});
    this.widget.templateHtml = res;
  };

  beautifyCss = (...rest: any[]): any => {
    var res: any = css_beautify(this.widget.templateCss, {indent_size: 4});
    this.widget.templateCss = res;
  };

  beautifyJson = (...rest: any[]): any => {
    var res: any = js_beautify(this.widget.settingsSchema, {indent_size: 4});
    this.widget.settingsSchema = res;
  };

  beautifyDataKeyJson = (...rest: any[]): any => {
    var res: any = js_beautify(this.widget.dataKeySettingsSchema, {indent_size: 4});
    this.widget.dataKeySettingsSchema = res;
  };
}
