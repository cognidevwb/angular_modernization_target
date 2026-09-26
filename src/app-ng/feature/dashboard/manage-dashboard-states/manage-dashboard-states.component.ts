import { Component, inject, DoCheck, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule, NgForm } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { isEqual, orderBy } from 'lodash-es';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

import { DashboardStateDialogComponent } from '../dashboard-state-dialog/dashboard-state-dialog.component';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { legacyCopy } from '../../components/widget/legacy-helpers';
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
 * The dialog that lists, adds, edits and deletes the dashboard states; closes with the states by id.
 */
@Component({
  selector: 'manage-dashboard-states',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './manage-dashboard-states.component.html',
})
export class ManageDashboardStatesComponent implements DoCheck {
  protected readonly rootScope = inject(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogRef = inject(MatDialogRef<ManageDashboardStatesComponent>);
  protected readonly translate = inject(TranslateService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

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
  /** The legacy `theForm`: dirty once a state was added, edited or deleted. */
  readonly theForm = {
    dirty: false,
    ngForm: null as NgForm | null,
    get $dirty(): boolean {
      return this.dirty;
    },
    get $valid(): boolean {
      return !this.ngForm?.invalid;
    },
    $setDirty(): void {
      this.dirty = true;
    },
    $setPristine(): void {
      this.dirty = false;
    },
  };
  state: any;

  @ViewChild('theFormRef')
  set theFormRef(form: NgForm | undefined) {
    this.theForm.ngForm = form ?? null;
  }
  private prevQuerySearch: any = undefined;

  ngDoCheck(): void {
    if (!isEqual(this.query.search, this.prevQuerySearch) && this.query.search != null) {
      this.updateStates();
    }
    this.prevQuerySearch = this.query.search;
  }

  constructor() {
    for (var id in this.dialogData.states) {
        var state: any = this.dialogData.states[id];
        state.id = id;
        this.allStates.push(state);
    }
    this.updateStates();
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

  /** md-order: the column header clicked (matSort) sets the order, `-` for descending. */
  onReorder = (sort?: Sort): any => {
    if (sort) {
        this.query.order = sort.direction ? (sort.direction === 'desc' ? '-' : '') + sort.active : 'name';
    }
    this.updateStates();
  };

  /** md-table-pagination's page and limit. */
  onPaginate = (event?: PageEvent): any => {
    if (event) {
        this.query.limit = event.pageSize;
        this.query.page = event.pageIndex + 1;
    }
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
        data: {isAdd: isAdd, allStates: this.allStates, state: legacyCopy(state)},
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
        showConfirm(this.dialog, {
            title: title,
            htmlContent: content,
            cancel: this.translate.instant('action.no'),
            ok: this.translate.instant('action.yes')
        }).then(() => {
            var index: any = this.getStateIndex(state.id);
            if (index > -1) {
                this.allStates.splice(index, 1);
            }
            this.theForm.$setDirty();
            this.updateStates();
        }, () => {});
    }
  };

  cancel = (...rest: any[]): any => {
    this.dialogRef.close();
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
    this.dialogRef.close(savedStates);
  };
}
