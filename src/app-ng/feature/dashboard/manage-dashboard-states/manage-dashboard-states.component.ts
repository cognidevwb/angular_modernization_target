import { Component, inject, DoCheck } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { isEqual, orderBy } from 'lodash-es';

import { DashboardStateDialogComponent } from './dashboard-state-dialog/dashboard-state-dialog.component';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ManageDashboardStatesController` (module `thingsboard.dashboard.states`) in src/app/dashboard/states/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'manage-dashboard-states',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './manage-dashboard-states.component.html',
})
export class ManageDashboardStatesComponent implements DoCheck {
  protected readonly rootScope = injectRoot(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place

  allStates: any = [];
  states: any = [];
  statesCount: any = 0;
  protected readonly displayedColumns = ['name', 'id', 'root', 'actions'];
  query: any = {
        order: 'name',
        limit: 5,
        page: 1,
        search: null
    };
  theForm: any;
  state: any;
  private prevQuerySearch: any = undefined;

  ngDoCheck(): void {
    if (!isEqual(this.query.search, this.prevQuerySearch) && this.query.search != null) {
      this.updateStates();
    }
    this.prevQuerySearch = this.query.search;
  }

  constructor() {
    let vm = this;
    for (var id in this.dialogData.states) {
        var state: any = this.dialogData.states[id];
        state.id = id;
        this.allStates.push(state);
    }
    this.enterFilterMode = this.enterFilterMode;
    this.exitFilterMode = this.exitFilterMode;
    this.onReorder = this.onReorder;
    this.onPaginate = this.onPaginate;
    this.addState = this.addState;
    this.editState = this.editState;
    this.deleteState = this.deleteState;
    this.cancel = this.cancel;
    this.save = this.save;
    this.updateStates ();
  }

  updateStates(...rest: any[]): any {
    var result: any = this.orderByFilter(this.allStates, this.query.order);
    if (this.query.search != null) {
        result = this.searchFilter(result, this.query.search);
    }
    this.statesCount = result.length;
    var startIndex: any = this.query.limit * (this.query.page - 1);
    this.states = result.slice(startIndex, startIndex + this.query.limit);
  }

  private orderByFilter(collection: any[], expression: any): any[] {
    if (!expression) {
      return collection.slice();
    }
    const desc = typeof expression === 'string' && expression.startsWith('-');
    const field = desc ? expression.substring(1) : expression;
    return orderBy(collection, [field], [desc ? 'desc' : 'asc']);
  }

  private searchFilter(collection: any[], search: any): any[] {
    const text = String(search).toLowerCase();
    return collection.filter((item: any) => Object.values(item).some((val: any) => val !== null && val !== undefined && String(val).toLowerCase().includes(text)));
  }

  enterFilterMode = (...rest: any[]): any => {
    this.query.search = '';
  };

  exitFilterMode = (...rest: any[]): any => {
    this.query.search = null;
    this.updateStates();
  };

  onReorder = (...rest: any[]): any => {
    this.updateStates();
  };

  onPaginate = (...rest: any[]): any => {
    this.updateStates();
  };

  addState = ($event?: any, ...rest: any[]): any => {
    this.openStateDialog($event, null, true);
  };

  editState = ($event?: any, alertRule?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    this.openStateDialog($event, alertRule, false);
  };

  openStateDialog($event?: any, state?: any, isAdd?: any, ...rest: any[]): any {
    var prevStateId: any = null;
    if (!isAdd) {
        prevStateId = state.id;
    }
    firstValueFrom(this.dialog.open(DashboardStateDialogComponent, {
        data: {isAdd: isAdd, allStates: this.allStates, state: structuredClone(state)},
        panelClass: 'tb-dialog'
    }).afterClosed()).then((result?: any) => {
        if (result !== undefined) {
            this.saveState(result, prevStateId);
            this.updateStates();
        }
    });
  }

  getStateIndex(id?: any, ...rest: any[]): any {
    var result: any = this.allStates.filter((item: any) => item.id === id);
    if (result && result.length) {
        return this.allStates.indexOf(result[0]);
    }
    return -1;
  }

  saveState(state?: any, prevStateId?: any, ...rest: any[]): any {
    if (prevStateId) {
        var index: any = this.getStateIndex(prevStateId);
        if (index > -1) {
            this.allStates[index] = state;
        }
    } else {
        this.allStates.push(state);
    }
    if (state.root) {
        for (var i: any=0; i < this.allStates.length; i++) {
            var otherState: any = this.allStates[i];
            if (otherState.id !== state.id) {
                otherState.root = false;
            }
        }
    }
    this.theForm.$setDirty();
  }

  deleteState = ($event?: any, state?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    if (state) {
        var title: any = this.translate.instant('dashboard.delete-state-title');
        var content: any = this.translate.instant('dashboard.delete-state-text', {stateName: state.name});
        var confirm: any = (this.dialog as any).confirm()
            .targetEvent($event)
            .title(title)
            .htmlContent(content)
            .ariaLabel(title)
            .cancel(this.translate.instant('action.no'))
            .ok(this.translate.instant('action.yes'));

        confirm._options.multiple = true;
        confirm._options.fullscreen = true;

        (this.dialog as any).show(confirm).then(() => {
            var index: any = this.getStateIndex(state.id);
            if (index > -1) {
                this.allStates.splice(index, 1);
            }
            this.theForm.$setDirty();
            this.updateStates();
        });
    }
  };

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  save = (...rest: any[]): any => {
    this.theForm.$setPristine();
    var savedStates: any = {};
    for (var i: any=0;i<this.allStates.length;i++) {
        var state: any = this.allStates[i];
        var id: any = state.id;
        delete state.id;
        savedStates[id] = state;
    }
    (this.dialog as any).hide(savedStates);
  };
}
