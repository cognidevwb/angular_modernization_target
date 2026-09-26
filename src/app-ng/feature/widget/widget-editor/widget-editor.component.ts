import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbConfirmOnExitDirective } from '../../components/tb-confirm-on-exit/tb-confirm-on-exit.directive';
import { TbExpandFullscreenDirective } from '../../components/tb-expand-fullscreen/tb-expand-fullscreen.directive';
import { TbCircularProgressDirective } from '../../components/tb-circular-progress/tb-circular-progress.directive';
import $ from 'jquery';
import ace from 'brace';
import saveWidgetTypeAsTemplate from '../../../../app/widget/save-widget-type-as.tpl.html';
import Split from 'split.js';
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

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $scope: any;
declare let $window: any;
declare let hotkeys: any;

// Helpers at the legacy file's top level, beside the registration (as written).
const js_beautify: any = beautify.js;

const html_beautify: any = beautify.html;

const css_beautify: any = beautify.css;

/**
 * Ported from the AngularJS controller `WidgetEditorController` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 6 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'widget-editor',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatTabsModule, MatSelectModule, MatProgressSpinnerModule, MatMenuModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, forwardRef(() => TbConfirmOnExitDirective), forwardRef(() => TbExpandFullscreenDirective), forwardRef(() => TbCircularProgressDirective)],
  templateUrl: './widget-editor.component.html',
})
export class WidgetEditorComponent {
  protected readonly widgetService = inject(WidgetService);
  protected readonly userService = inject(UserService);
  protected readonly toast = inject(ToastService);
  // TODO(port): 'hotkeys' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  protected readonly dialog = inject(MatDialog);

  protected Range: any = ace.acequire("ace/range").Range;
  protected ace_editors: any = [];
  protected js_editor: any;
  protected iframe: any;
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

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    this.iframe = $('iframe', $(this.element.nativeElement));
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
    this.initWidgetEditor();
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
            $scope.$watch(
                () => {
                    return this.elem[0].offsetWidth || parseInt(this.elem.css('width'), 10);
                },
                (newSize?: any) => {
                    if (newSize > 0) {
                        this.initSplitLayout();
                    }
                }
            );
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
    let ctrl = this;
    this.translate(['widget.undo', 'widget.save', 'widget.saveAs', 'widget.toggle-fullscreen', 'widget.run']).then((translations?: any) => {
        hotkeys.bindTo(this)
            .add({
                combo: 'ctrl+q',
                description: translations['widget.undo'],
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: (event?: any, ...rest: any[]) => {
                    if (!this.undoDisabled()) {
                        event.preventDefault();
                        this.undoWidget();
                    }
                }
            })
            .add({
                combo: 'ctrl+s',
                description: translations['widget.save'],
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: (event?: any, ...rest: any[]) => {
                    if (!this.saveDisabled()) {
                        event.preventDefault();
                        this.saveWidget();
                    }
                }
            })
            .add({
                combo: 'shift+ctrl+s',
                description: translations['widget.saveAs'],
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: (event?: any, ...rest: any[]) => {
                    if (!this.saveAsDisabled()) {
                        event.preventDefault();
                        this.saveWidgetAs();
                    }
                }
            })
            .add({
                combo: 'shift+ctrl+f',
                description: translations['widget.toggle-fullscreen'],
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: (event?: any, ...rest: any[]) => {
                    event.preventDefault();
                    this.toggleFullscreen();
                }
            })
            .add({
                combo: 'ctrl+enter',
                description: translations['widget.run'],
                allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
                callback: (event?: any, ...rest: any[]) => {
                    event.preventDefault();
                    this.applyWidgetScript();
                }
        });
    });
  }

  initWatchWidget(...rest: any[]): any {
    let vm = this;
    this.widgetWatcher = $scope.$watch('vm.widget', (newVal?: any, oldVal?: any) => {
        if (!angular.equals(newVal, oldVal)) {
            this.isDirty = true;
        }
    }, true);
  }

  initWatchers(...rest: any[]): any {
    let vm = this;
    this.initWatchWidget();

    $scope.$watch('vm.widget.type', (newVal?: any, oldVal?: any) => {
        if (!angular.equals(newVal, oldVal)) {
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
    });

    $scope.$on('widgetEditModeInited', () => {
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
    });

    $scope.$on('widgetEditUpdated', (event?: any, widget?: any) => {
        this.widget.sizeX = widget.sizeX / 2;
        this.widget.sizeY = widget.sizeY / 2;
        this.widget.defaultConfig = JSON.stringify(widget.config);
        this.iframe.attr('data-widget', JSON.stringify(this.widget));
    });

    $scope.$on('widgetException', (event?: any, details?: any) => {
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
    });
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
            var w: any = $($window);
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
    let vm = this;
    this.dialog.show({
        controller: 'SaveWidgetTypeAsController',
        controllerAs: 'vm',
        templateUrl: saveWidgetTypeAsTemplate,
        parent: $(this.document.body),
        fullscreen: true,
        targetEvent: this.saveWidgetAsEvent
    }).then((saveWidgetAsData?: any) => {
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
                this.router.go('home.widgets-bundles.widget-types.widget-type',
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
