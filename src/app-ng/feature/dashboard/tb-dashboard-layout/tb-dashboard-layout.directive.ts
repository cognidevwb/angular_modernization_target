import { Component, effect, forwardRef, HostListener, inject, model, untracked, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { ItembufferService } from '../../services/itembuffer.service';
import { RootState } from '../../../root-state';
import {
  ContextMenuRequest,
  LoadWidgetsRequest,
  TbDashboardDirective,
} from '../../components/tb-dashboard/tb-dashboard.directive';
import { notifyWidgetEditor } from '../widget-editor-frame';

/**
 * Ported from the AngularJS directive `tbDashboardLayout` (src/app/dashboard/layouts/dashboard-layout.directive.js):
 * one layout (main or right) of a dashboard state — the grid of its widgets, the "no widgets" prompt,
 * and the edit hot keys. It registers itself as `layoutCtx.ctrl`, which the dashboard page calls
 * (reload, highlight, select …), and forwards the grid's events to the page's `dashboardCtx` callbacks.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
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

  protected readonly rootScope = inject(RootState);
  protected readonly itembuffer = inject(ItembufferService);

  dashboardInitComplete = false;
  dashboardContainer: TbDashboardDirective | null = null;
  isEditingWidget: any;

  constructor() {
    // `$scope.$watch('vm.layoutCtx', …)`: the page reaches this layout through its context
    effect(() => {
      const layoutCtx = this.layoutCtx();
      untracked(() => {
        if (layoutCtx) {
          layoutCtx.ctrl = this;
        }
      });
    });
  }

  reload(): void {
    if (this.dashboardContainer) {
      this.dashboardContainer.reload();
    }
  }

  setResizing(resizing?: any): void {
    if (this.dashboardContainer) {
      this.dashboardContainer.isResizing = resizing;
    }
  }

  resetHighlight(): void {
    if (this.dashboardContainer) {
      this.dashboardContainer.resetHighlight();
    }
  }

  highlightWidget(widget?: any, delay?: any): void {
    if (this.dashboardContainer) {
      this.dashboardContainer.highlightWidget(widget, delay);
    }
    this.dashboardInitComplete = true;
  }

  selectWidget(widget?: any, delay?: any): void {
    if (this.dashboardContainer) {
      this.dashboardContainer.selectWidget(widget, delay);
    }
  }

  noData(): boolean {
    const layoutCtx = this.layoutCtx();
    return this.dashboardInitComplete && layoutCtx && layoutCtx.widgets && layoutCtx.widgets.length == 0;
  }

  addWidget($event?: any): void {
    if (this.dashboardCtx().onAddWidget) {
      this.dashboardCtx().onAddWidget($event, this.layoutCtx());
    }
  }

  editWidget($event?: any, widget?: any): void {
    if (this.dashboardCtx().onEditWidget) {
      this.dashboardCtx().onEditWidget($event, this.layoutCtx(), widget);
    }
  }

  exportWidget($event?: any, widget?: any): void {
    if (this.dashboardCtx().onExportWidget) {
      this.dashboardCtx().onExportWidget($event, this.layoutCtx(), widget);
    }
  }

  widgetMouseDown($event?: any, widget?: any): void {
    if (this.dashboardCtx().onWidgetMouseDown) {
      this.dashboardCtx().onWidgetMouseDown($event, this.layoutCtx(), widget);
    }
  }

  widgetClicked($event?: any, widget?: any): void {
    if (this.dashboardCtx().onWidgetClicked) {
      this.dashboardCtx().onWidgetClicked($event, this.layoutCtx(), widget);
    }
  }

  /** The grid asks for its background menu: the page's menu items for this layout. */
  prepareDashboardContextMenu(request: ContextMenuRequest): void {
    if (this.dashboardCtx().prepareDashboardContextMenu) {
      request.items = this.dashboardCtx().prepareDashboardContextMenu(this.layoutCtx());
    }
  }

  /** The grid asks for a widget's menu: the page's menu items for that widget in this layout. */
  prepareWidgetContextMenu(request: ContextMenuRequest): void {
    if (this.dashboardCtx().prepareWidgetContextMenu) {
      request.items = this.dashboardCtx().prepareWidgetContextMenu(this.layoutCtx(), request.widget);
    }
  }

  /** The legacy layout bound no `load-widgets`: its widgets are already in `layoutCtx`. */
  loadWidgets(_request: LoadWidgetsRequest): void {
    // nothing to load asynchronously
  }

  removeWidget($event?: any, widget?: any): void {
    if (this.dashboardCtx().onRemoveWidget) {
      this.dashboardCtx().onRemoveWidget($event, this.layoutCtx(), widget);
    }
  }

  dashboardInitFailed(): void {
    notifyWidgetEditor('widgetEditModeInited');
    this.dashboardInitComplete = true;
  }

  dashboardInited(dashboardContainer?: any): void {
    this.dashboardContainer = dashboardContainer;
    this.dashboardInitComplete = true;
  }

  /** hotkeys ignored keys typed into a form field; the dashboard's own elements take them. */
  private isHotKeyAllowed(event: KeyboardEvent): boolean {
    const target: any = event.target || event.srcElement;
    if (!target || !target.tagName) {
      return true;
    }
    const tag = target.tagName.toLowerCase();
    return !(tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable);
  }

  private hotKeysEnabled(event: KeyboardEvent): boolean {
    return this.isHotKeyAllowed(event) && this.isEdit() && !this.isEditingWidget && !this.widgetEditMode() && !!this.dashboardContainer;
  }

  /** The `hotkeys` bindings: ctrl+c copy, ctrl+r copy reference, ctrl+v paste, ctrl+i paste reference, ctrl+x delete. */
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!event.ctrlKey || event.altKey || event.shiftKey || event.metaKey || !this.hotKeysEnabled(event)) {
      return;
    }
    const key = event.key.toLowerCase();
    const container = this.dashboardContainer as TbDashboardDirective;
    switch (key) {
      case 'c': {
        const widget = container.getSelectedWidget();
        if (widget) {
          event.preventDefault();
          this.copyWidget(event, widget);
        }
        break;
      }
      case 'r': {
        const widget = container.getSelectedWidget();
        if (widget) {
          event.preventDefault();
          this.copyWidgetReference(event, widget);
        }
        break;
      }
      case 'v':
        if (this.itembuffer.hasWidget()) {
          event.preventDefault();
          this.pasteWidget(event);
        }
        break;
      case 'i':
        if (this.itembuffer.canPasteWidgetReference(this.dashboardCtx().dashboard, this.dashboardCtx().state, this.layoutCtx().id)) {
          event.preventDefault();
          this.pasteWidgetReference(event);
        }
        break;
      case 'x': {
        const widget = container.getSelectedWidget();
        if (widget) {
          event.preventDefault();
          this.dashboardCtx().onRemoveWidget(event, this.layoutCtx(), widget);
        }
        break;
      }
    }
  }

  copyWidget($event?: any, widget?: any): void {
    if (this.dashboardCtx().copyWidget) {
      this.dashboardCtx().copyWidget($event, this.layoutCtx(), widget);
    }
  }

  copyWidgetReference($event?: any, widget?: any): void {
    if (this.dashboardCtx().copyWidgetReference) {
      this.dashboardCtx().copyWidgetReference($event, this.layoutCtx(), widget);
    }
  }

  /** Where the pasted widget goes: under the mouse (the context menu) or the grid's top left (a key). */
  private eventGridPosition($event: any): any {
    if (this.dashboardContainer && $event && typeof $event.clientX === 'number') {
      return this.dashboardContainer.getEventGridPosition($event);
    }
    return { row: 0, column: 0 };
  }

  pasteWidget($event?: any): void {
    const pos: any = this.eventGridPosition($event);
    if (this.dashboardCtx().pasteWidget) {
      this.dashboardCtx().pasteWidget($event, this.layoutCtx(), pos);
    }
  }

  pasteWidgetReference($event?: any): void {
    const pos: any = this.eventGridPosition($event);
    if (this.dashboardCtx().pasteWidgetReference) {
      this.dashboardCtx().pasteWidgetReference($event, this.layoutCtx(), pos);
    }
  }
}
