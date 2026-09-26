import { Component, ElementRef, effect, inject, input, model, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { AuditLogService } from '../../api/services/audit-log.service';
import { RootState } from '../../../root-state';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbTimewindowDirective } from '../../components/tb-timewindow/tb-timewindow.directive';
import { TbAuditLogHeaderDirective } from '../tb-audit-log-header/tb-audit-log-header.directive';
import { TbAuditLogRowDirective } from '../tb-audit-log-row/tb-audit-log-row.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { isEqual } from 'lodash-es';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-audit-log-table',
  standalone: true,
  templateUrl: './tb-audit-log-table.directive.html',
  imports: [
    CommonModule,
    FormsModule,
    TbTimewindowDirective,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatProgressBarModule,
    MatDividerModule,
    MatTooltipModule,
    TranslatePipe,
    TbAuditLogHeaderDirective,
    TbAuditLogRowDirective
  ],
  styles: [`
    .tb-audit-log-repeat-container {
      min-height: 0;
      overflow-y: auto;
      overflow-x: hidden;
    }
  `],
})
/**
 * Ported from the AngularJS directive `tbAuditLogTable` (src/app/audit/audit-log-table.directive.js) with its template:
 * the audit logs of the tenant, an entity, a user or a customer (`auditLogMode`) in the chosen time window, loaded a
 * page at a time as the list scrolls (the md-virtual-repeat `md-on-demand` data source `theAuditLogs`), filtered by
 * the search text.
 */
export class TbAuditLogTableDirective {
  readonly entityType = model<any>();
  readonly entityId = model<any>();
  readonly userId = model<any>();
  readonly customerId = model<any>();
  readonly auditLogMode = input<any>();
  readonly pageMode = input<any>();

  protected readonly rootScope = inject(RootState);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly auditLogService = inject(AuditLogService);
  protected readonly element = inject(ElementRef);
  private readonly repeatContainer = viewChild<ElementRef<HTMLElement>>('repeatContainer');

  types: any;
  protected pageSize: any = 20;
  protected startTime: any = 0;
  protected endTime: any = 0;
  private _timewindow: any = {
            history: {
                timewindowMs: 24 * 60 * 60 * 1000 // 1 day
            }
        };
  private watchTimewindow = true;

  get timewindow(): any {
    return this._timewindow;
  }

  set timewindow(newVal: any) {
    const prevVal = this._timewindow;
    this._timewindow = newVal;
    if (this.watchTimewindow && newVal && !isEqual(newVal, prevVal)) {
        this.reload();
    }
  }
  topIndex: any = 0;
  private _searchText: any = '';
  private watchSearchText = true;

  get searchText(): any {
    return this._searchText;
  }

  set searchText(newVal: any) {
    const prevVal = this._searchText;
    this._searchText = newVal;
    if (this.watchSearchText && !isEqual(newVal, prevVal)) {
        this.searchTextUpdated();
    }
  }
  theAuditLogs: any;
  auditLogs: any;


  constructor() {
    this.types = this.typesRef;
    this.theAuditLogs = {
            getItemAtIndex: (index?: any, ...rest: any[]) => {
                if (index > this.auditLogs.filtered.length) {
                    this.theAuditLogs.fetchMoreItems_(index);
                    return null;
                }
                return this.auditLogs.filtered[index];
            },

            getLength: (...rest: any[]) => {
                if (this.auditLogs.hasNext) {
                    return this.auditLogs.filtered.length + this.auditLogs.nextPageLink.limit;
                } else {
                    return this.auditLogs.filtered.length;
                }
                return undefined;
            },

            fetchMoreItems_: (...rest: any[]) => {
                if (this.auditLogs.hasNext && !this.auditLogs.pending) {
                    var promise: any = this.getAuditLogsPromise(this.auditLogs.nextPageLink);
                    if (promise) {
                        this.auditLogs.pending = true;
                        promise.then(
                            (auditLogs?: any) => {
                                this.auditLogs.data = this.auditLogs.data.concat(this.prepareAuditLogsData(auditLogs.data));
                                this.auditLogs.filtered = this.filterAuditLogs(this.auditLogs.data, this.searchText);
                                this.auditLogs.nextPageLink = auditLogs.nextPageLink;
                                this.auditLogs.hasNext = auditLogs.hasNext;
                                if (this.auditLogs.hasNext) {
                                    this.auditLogs.nextPageLink.limit = this.pageSize;
                                }
                                this.auditLogs.pending = false;
                                setTimeout(() => this.onScroll());
                            },
                            () => {
                                this.auditLogs.hasNext = false;
                                this.auditLogs.pending = false;
                            });
                    } else {
                        this.auditLogs.hasNext = false;
                    }
                }
            }
        };
    // A $watch's first call only records the value (newVal === oldVal); these effects do the same.
    const UNSET = {};
    let prevEntityId: any = UNSET;
    let prevUserId: any = UNSET;
    let prevCustomerId: any = UNSET;
    effect(() => {
        const newVal = this.entityId();
        if (prevEntityId !== UNSET && newVal && !isEqual(newVal, prevEntityId)) {
            this.resetFilter();
            this.reload();
        }
        prevEntityId = newVal;
    });
    effect(() => {
        const newVal = this.userId();
        if (prevUserId !== UNSET && newVal && !isEqual(newVal, prevUserId)) {
            this.resetFilter();
            this.reload();
        }
        prevUserId = newVal;
    });
    effect(() => {
        const newVal = this.customerId();
        if (prevCustomerId !== UNSET && newVal && !isEqual(newVal, prevCustomerId)) {
            this.resetFilter();
            this.reload();
        }
        prevCustomerId = newVal;
    });
  }

  ngOnInit(): void {
    // Reads its inputs (entityId, userId, customerId, auditLogMode): they are set after the constructor.
    this.reload();
    this.initWatchers();
  }

  prepareAuditLogsData(data?: any, ...rest: any[]): any {
    data.forEach(
        (auditLog?: any) => {
            auditLog.entityTypeText = this.translate.instant(this.typesRef.entityTypeTranslations[auditLog.entityId.entityType].type);
            auditLog.actionTypeText = this.translate.instant(this.typesRef.auditLogActionType[auditLog.actionType].name);
            auditLog.actionStatusText = this.translate.instant(this.typesRef.auditLogActionStatus[auditLog.actionStatus].name);
            auditLog.actionDataText = auditLog.actionData ? JSON.stringify(auditLog.actionData, null, 2) : '';
        }
    );
    return data;
  }

  private filterAuditLogs(data: any[], searchText: any): any[] {
    if (searchText === undefined || searchText === null || searchText === '') {
      return data;
    }
    const lowerSearchText = String(searchText).toLowerCase();
    return data.filter((item: any) => JSON.stringify(item).toLowerCase().includes(lowerSearchText));
  }

  getAuditLogsPromise(pageLink?: any, ...rest: any[]): any {
    switch(this.auditLogMode()) {
        case this.typesRef.auditLogMode.tenant:
            return this.auditLogService.getAuditLogs(pageLink);
        case this.typesRef.auditLogMode.entity:
            if (this.entityType() && this.entityId()) {
                return this.auditLogService.getAuditLogsByEntityId(this.entityType(), this.entityId(),
                    pageLink);
            } else {
                return null;
            }
        case this.typesRef.auditLogMode.user:
            if (this.userId()) {
                return this.auditLogService.getAuditLogsByUserId(this.userId(), pageLink);
            } else {
                return null;
            }
        case this.typesRef.auditLogMode.customer:
            if (this.customerId()) {
                return this.auditLogService.getAuditLogsByCustomerId(this.customerId(), pageLink);
            } else {
                return null;
            }
    }
    return undefined;
  }

  destroyWatchers(...rest: any[]): any {
    this.watchTimewindow = false;
    this.watchSearchText = false;
  }

  initWatchers(...rest: any[]): any {
    this.watchTimewindow = true;
    this.watchSearchText = true;
  }

  resetFilter(...rest: any[]): any {
    this.destroyWatchers();
    this.timewindow = {
        history: {
            timewindowMs: 24 * 60 * 60 * 1000 // 1 day
        }
    };
    this.searchText = '';
    this.initWatchers();
  }

  updateTimeWindowRange(...rest: any[]): any {
    if (this.timewindow.history.timewindowMs) {
        var currentTime: any = (new Date).getTime();
        this.startTime = currentTime - this.timewindow.history.timewindowMs;
        this.endTime = currentTime;
    } else {
        this.startTime = this.timewindow.history.fixedTimewindow.startTimeMs;
        this.endTime = this.timewindow.history.fixedTimewindow.endTimeMs;
    }
  }

  reload(...rest: any[]): any {
    this.topIndex = 0;
    this.updateTimeWindowRange();
    this.auditLogs = {
        data: [],
        filtered: [],
        nextPageLink: {
            limit: this.pageSize,
            startTime: this.startTime,
            endTime: this.endTime
        },
        hasNext: true,
        pending: false
    };
    this.theAuditLogs.getItemAtIndex(this.pageSize);
  }

  searchTextUpdated(...rest: any[]): any {
    this.auditLogs.filtered = this.filterAuditLogs(this.auditLogs.data, this.searchText);
    this.theAuditLogs.getItemAtIndex(this.pageSize);
  }

  noData(...rest: any[]): any {
    return this.auditLogs.data.length == 0 && !this.auditLogs.hasNext;
  }

  hasData(...rest: any[]): any {
    return this.auditLogs.data.length > 0;
  }

  loading(...rest: any[]): any {
    return this.rootScope.loading;
  }

  /**
   * md-virtual-repeat asked its data source for the rows coming into view; when they reach past the loaded ones
   * (`getItemAtIndex` beyond `filtered.length`) the next page loads. The list asks for the row a page below its end.
   */
  onScroll(): void {
    const container = this.repeatContainer()?.nativeElement;
    if (!container || !this.auditLogs) {
      return;
    }
    const rowHeight = 49;
    const lastVisible = Math.ceil((container.scrollTop + container.clientHeight) / rowHeight);
    this.theAuditLogs.getItemAtIndex(lastVisible + this.pageSize);
  }
}
