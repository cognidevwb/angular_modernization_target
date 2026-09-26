import { Component, forwardRef, inject, model } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { ItembufferService } from '../../services/itembuffer.service';
import { RootState } from '../../../root-state';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { TbDashboardDirective } from '../../components/tb-dashboard/tb-dashboard.directive';

import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;
declare let $window: any;
declare let hotkeys: any;
declare let scope: any;
declare let itembuffer: any;

/**
 * Ported from the AngularJS directive `tbDashboardLayout` (module `thingsboard.dashboard.layouts`) in src/app/dashboard/layouts/index.js:20.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-dashboard-layout',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatButtonModule, CommonModule, forwardRef(() => TbDashboardDirective)],
  templateUrl: './tb-dashboard-layout.directive.html',
})
export class TbDashboardLayoutDirective {
  readonly layoutCtx = model<any>();
  readonly dashboardCtx = model<any>();
  readonly isEdit = model<any>();
  readonly isMobile = model<any>();
  readonly widgetEditMode = model<any>();

  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly rootScope = inject(RootState);
  protected readonly translate = inject(TranslateService);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  // TODO(port): 'hotkeys' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  protected readonly itembuffer = inject(ItembufferService);
  protected readonly destroyRef = inject(DestroyRef);

  dashboardInitComplete: any = false;
  dashboardContainer: any;
  isEditingWidget: any;

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
    let ctrl = this;
    this.noData = this.noData;
    this.addWidget = this.addWidget;
    this.editWidget = this.editWidget;
    this.exportWidget = this.exportWidget;
    this.widgetMouseDown = this.widgetMouseDown;
    this.widgetClicked = this.widgetClicked;
    this.prepareDashboardContextMenu = this.prepareDashboardContextMenu;
    this.prepareWidgetContextMenu = this.prepareWidgetContextMenu;
    this.removeWidget = this.removeWidget;
    this.pasteWidget = this.pasteWidget;
    this.pasteWidgetReference = this.pasteWidgetReference;
    this.dashboardInited = this.dashboardInited;
    this.dashboardInitFailed = this.dashboardInitFailed;
    this.initHotKeys();
    this.destroyRef.onDestroy(() => {
        this.dashboardContainer = null;
    });
    $scope.$watch('vm.layoutCtx', () => {
        if (this.layoutCtx()) {
            this.layoutCtx().ctrl = this;
        }
    });
  }

  reload(...rest: any[]): any {
    if (this.dashboardContainer) {
        this.dashboardContainer.reload();
    }
  }

  setResizing(resizing?: any, ...rest: any[]): any {
    if (this.dashboardContainer) {
        this.dashboardContainer.isResizing = resizing;
    }
  }

  resetHighlight(...rest: any[]): any {
    if (this.dashboardContainer) {
        this.dashboardContainer.resetHighlight();
    }
  }

  highlightWidget(widget?: any, delay?: any, ...rest: any[]): any {
    if (this.dashboardContainer) {
        this.dashboardContainer.highlightWidget(widget, delay);
    }
  }

  selectWidget(widget?: any, delay?: any, ...rest: any[]): any {
    if (this.dashboardContainer) {
        this.dashboardContainer.selectWidget(widget, delay);
    }
  }

  noData = (...rest: any[]): any => {
    return this.dashboardInitComplete && this.layoutCtx() &&
        this.layoutCtx().widgets && this.layoutCtx().widgets.length == 0;
  };

  addWidget = ($event?: any, ...rest: any[]): any => {
    if (this.dashboardCtx().onAddWidget) {
        this.dashboardCtx().onAddWidget($event, this.layoutCtx());
    }
  };

  editWidget = ($event?: any, widget?: any, ...rest: any[]): any => {
    if (this.dashboardCtx().onEditWidget) {
        this.dashboardCtx().onEditWidget($event, this.layoutCtx(), widget);
    }
  };

  exportWidget = ($event?: any, widget?: any, ...rest: any[]): any => {
    if (this.dashboardCtx().onExportWidget) {
        this.dashboardCtx().onExportWidget($event, this.layoutCtx(), widget);
    }
  };

  widgetMouseDown = ($event?: any, widget?: any, ...rest: any[]): any => {
    if (this.dashboardCtx().onWidgetMouseDown) {
        this.dashboardCtx().onWidgetMouseDown($event, this.layoutCtx(), widget);
    }
  };

  widgetClicked = ($event?: any, widget?: any, ...rest: any[]): any => {
    if (this.dashboardCtx().onWidgetClicked) {
        this.dashboardCtx().onWidgetClicked($event, this.layoutCtx(), widget);
    }
  };

  prepareDashboardContextMenu = (...rest: any[]): any => {
    if (this.dashboardCtx().prepareDashboardContextMenu) {
        return this.dashboardCtx().prepareDashboardContextMenu(this.layoutCtx());
    }
    return undefined;
  };

  prepareWidgetContextMenu = (widget?: any, ...rest: any[]): any => {
    if (this.dashboardCtx().prepareWidgetContextMenu) {
        return this.dashboardCtx().prepareWidgetContextMenu(this.layoutCtx(), widget);
    }
    return undefined;
  };

  removeWidget = ($event?: any, widget?: any, ...rest: any[]): any => {
    if (this.dashboardCtx().onRemoveWidget) {
        this.dashboardCtx().onRemoveWidget($event, this.layoutCtx(), widget);
    }
  };

  dashboardInitFailed = (...rest: any[]): any => {
    var parentScope: any = $window.parent.angular.element($window.frameElement).scope();
    parentScope.$emit('widgetEditModeInited');
    parentScope.$apply();
    this.dashboardInitComplete = true;
  };

  dashboardInited = (dashboardContainer?: any, ...rest: any[]): any => {
    this.dashboardContainer = dashboardContainer;
    this.dashboardInitComplete = true;
  };

  isHotKeyAllowed(event?: any, ...rest: any[]): any {
    var target: any = event.target || event.srcElement;
    var scope: any = $(target).scope();
    return scope && scope.$parent !== this.rootScope;
  }

  initHotKeys(...rest: any[]): any {
    let ctrl = this;
    this.translate(['action.copy', 'action.paste', 'action.delete']).then((translations?: any) => {
        hotkeys.bindTo(this)
            .add({
                combo: 'ctrl+c',
                description: translations['action.copy'],
                callback: (event?: any, ...rest: any[]) => {
                    if (this.isHotKeyAllowed(event) &&
                        this.isEdit() && !this.isEditingWidget && !this.widgetEditMode()) {
                        var widget: any = this.dashboardContainer.getSelectedWidget();
                        if (widget) {
                            event.preventDefault();
                            this.copyWidget(event, widget);
                        }
                    }
                }
            })
            .add({
                combo: 'ctrl+r',
                description: translations['action.copy-reference'],
                callback: (event?: any, ...rest: any[]) => {
                    if (this.isHotKeyAllowed(event) &&
                        this.isEdit() && !this.isEditingWidget && !this.widgetEditMode()) {
                        var widget: any = this.dashboardContainer.getSelectedWidget();
                        if (widget) {
                            event.preventDefault();
                            this.copyWidgetReference(event, widget);
                        }
                    }
                }
            })
            .add({
                combo: 'ctrl+v',
                description: translations['action.paste'],
                callback: (event?: any, ...rest: any[]) => {
                    if (this.isHotKeyAllowed(event) &&
                        this.isEdit() && !this.isEditingWidget && !this.widgetEditMode()) {
                        if (this.itembuffer.hasWidget()) {
                            event.preventDefault();
                            this.pasteWidget(event);
                        }
                    }
                }
            })
            .add({
                combo: 'ctrl+i',
                description: translations['action.paste-reference'],
                callback: (event?: any, ...rest: any[]) => {
                    if (this.isHotKeyAllowed(event) &&
                        this.isEdit() && !this.isEditingWidget && !this.widgetEditMode()) {
                        if (this.itembuffer.canPasteWidgetReference(this.dashboardCtx().dashboard,
                                this.dashboardCtx().state, this.layoutCtx().id)) {
                            event.preventDefault();
                            this.pasteWidgetReference(event);
                        }
                    }
                }
            })

            .add({
                combo: 'ctrl+x',
                description: translations['action.delete'],
                callback: (event?: any, ...rest: any[]) => {
                    if (this.isHotKeyAllowed(event) &&
                        this.isEdit() && !this.isEditingWidget && !this.widgetEditMode()) {
                        var widget: any = this.dashboardContainer.getSelectedWidget();
                        if (widget) {
                            event.preventDefault();
                            this.dashboardCtx().onRemoveWidget(event, this.layoutCtx(), widget);
                        }
                    }
                }
            });
    });
  }

  copyWidget($event?: any, widget?: any, ...rest: any[]): any {
    if (this.dashboardCtx().copyWidget) {
        this.dashboardCtx().copyWidget($event, this.layoutCtx(), widget);
    }
  }

  copyWidgetReference($event?: any, widget?: any, ...rest: any[]): any {
    if (this.dashboardCtx().copyWidgetReference) {
        this.dashboardCtx().copyWidgetReference($event, this.layoutCtx(), widget);
    }
  }

  pasteWidget = ($event?: any, ...rest: any[]): any => {
    var pos: any = this.dashboardContainer.getEventGridPosition($event);
    if (this.dashboardCtx().pasteWidget) {
        this.dashboardCtx().pasteWidget($event, this.layoutCtx(), pos);
    }
  };

  pasteWidgetReference = ($event?: any, ...rest: any[]): any => {
    var pos: any = this.dashboardContainer.getEventGridPosition($event);
    if (this.dashboardCtx().pasteWidgetReference) {
        this.dashboardCtx().pasteWidgetReference($event, this.layoutCtx(), pos);
    }
  };
}
