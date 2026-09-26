import { Component, effect, inject, input, model, ChangeDetectionStrategy } from '@angular/core';
import { FetchDashboardStatesFn } from '../tb-datasource/datasource-callbacks';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { isEqual, orderBy } from 'lodash-es';

/**
 * Ported from the AngularJS directive `tbManageWidgetActions` (module `thingsboard.directives.widgetActions`) in src/app/components/widget/action/manage-widget-actions.directive.js:49.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-manage-widget-actions',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './tb-manage-widget-actions.directive.html',
})
export class TbManageWidgetActionsDirective {
  readonly actionSources = model<any>();
  readonly widgetActions = model<any>();
  readonly fetchDashboardStates = input<FetchDashboardStatesFn | undefined>();

  // TODO(port): opening the add/edit widget action dialog (WidgetActionDialogController) is not yet ported to a standalone dialog component

  private readonly translate = inject(TranslateService);

  protected displayedColumns = ['actionSourceName', 'name', 'icon', 'typeName', 'actions'];

  protected allActions: any[] = [];
  protected actions: any[] = [];
  protected actionsCount = 0;

  protected query: { order: string; limit: number; page: number; search: string | null } = {
    order: 'actionSourceName',
    limit: 10,
    page: 1,
    search: null
  };

  private prevSearchVal: any = null;

  constructor() {
    effect(() => {
      if (this.widgetActions()) {
        this.reloadActions();
      }
    });

    effect(() => {
      const newVal = this.query.search;
      if (!isEqual(newVal, this.prevSearchVal) && this.query.search != null) {
        this.updateActions();
      }
      this.prevSearchVal = newVal;
    });
  }

  protected enterFilterMode(event?: Event): void {
    const target = event?.currentTarget as HTMLElement;
    const toolbarsContainer = target?.closest('.toolbarsContainer');

    this.query.search = '';

    setTimeout(() => {
      (toolbarsContainer?.querySelector('.searchInput') as HTMLInputElement)?.focus();
    });
  }

  protected exitFilterMode(): void {
    this.query.search = null;
    this.updateActions();
  }

  protected onSortChange(sort: Sort): void {
    this.query.order = sort.direction ? (sort.direction === 'desc' ? '-' : '') + sort.active : 'actionSourceName';
    this.updateActions();
  }

  protected onPaginate(event: PageEvent): void {
    this.query.page = event.pageIndex + 1;
    this.query.limit = event.pageSize;
    this.updateActions();
  }

  protected addAction(event?: Event): void {
    event?.stopPropagation();
    this.openWidgetActionDialog(event, null, true);
  }

  protected editAction(event?: Event, action?: any): void {
    event?.stopPropagation();
    this.openWidgetActionDialog(event, action, false);
  }

  protected deleteAction(event?: Event, action?: any): void {
    event?.stopPropagation();
    if (action) {
      const title = this.translate.instant('widget-config.delete-action-title');
      const content = this.translate.instant('widget-config.delete-action-text', { actionName: action.name });
      if (window.confirm(`${title}\n${content}`)) {
        let index = this.getActionIndex(action.id, this.allActions);
        if (index > -1) {
          this.allActions.splice(index, 1);
        }
        const widgetActions = this.widgetActions();
        const targetActions = widgetActions ? widgetActions[action.actionSourceId] : null;
        index = this.getActionIndex(action.id, targetActions);
        if (index > -1) {
          targetActions.splice(index, 1);
        }
        this.updateActions();
      }
    }
  }

  private openWidgetActionDialog(_event: Event | undefined, _action: any, _isAdd: boolean): void {
    // TODO(port): opens the add/edit widget action dialog; not yet ported to a standalone dialog component
  }

  private getActionIndex(id: any, actions: any[]): number {
    if (!actions) {
      return -1;
    }
    const result = this.filterFilter(actions, { id }, true);
    if (result && result.length) {
      return actions.indexOf(result[0]);
    }
    return -1;
  }

  private reloadActions(): void {
    this.allActions = [];
    this.actions = [];
    this.actionsCount = 0;

    const widgetActions = this.widgetActions() || {};
    const actionSources = this.actionSources() || {};
    for (const actionSourceId of Object.keys(widgetActions)) {
      const actionSource = actionSources[actionSourceId];
      const actionSourceActions = widgetActions[actionSourceId];
      for (const actionSourceAction of actionSourceActions) {
        const action = structuredClone(actionSourceAction);
        action.actionSourceId = actionSourceId;
        action.actionSourceName = actionSource ? actionSource.name : actionSourceId;
        action.typeName = action.type;
        this.allActions.push(action);
      }
    }

    this.updateActions();
  }

  private updateActions(): void {
    const order = this.query.order || '';
    const desc = order.startsWith('-');
    const field = desc ? order.substring(1) : order;
    let result: any[] = orderBy(this.allActions, [field], [desc ? 'desc' : 'asc']);
    if (this.query.search != null) {
      result = this.filterFilter(result, { $: this.query.search });
    }
    this.actionsCount = result.length;
    const startIndex = this.query.limit * (this.query.page - 1);
    this.actions = result.slice(startIndex, startIndex + this.query.limit);
  }

  private filterFilter(items: any[], criteria: any, exact = false): any[] {
    if (!items) {
      return items;
    }
    const keys = Object.keys(criteria);
    return items.filter(item => keys.every(key => {
      const critVal = (criteria as any)[key];
      if (key === '$') {
        return Object.values(item).some(val =>
          String(val).toLowerCase().includes(String(critVal).toLowerCase())
        );
      }
      const itemVal = (item as any)[key];
      if (exact) {
        return itemVal === critVal;
      }
      return String(itemVal).toLowerCase().includes(String(critVal).toLowerCase());
    }));
  }
}
