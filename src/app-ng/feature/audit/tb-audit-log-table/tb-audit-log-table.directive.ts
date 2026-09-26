import { Component, forwardRef, inject, input, model } from '@angular/core';
import { AuditLogService } from '../../api/services/audit-log.service';
import { ElementRef } from '@angular/core';
import { RootState } from '../../../root-state';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbTimewindowDirective } from '../../components/tb-timewindow/tb-timewindow.directive';
import { TbAuditLogHeaderDirective } from '../tb-audit-log-header/tb-audit-log-header.directive';
import { TbScopeElementDirective } from '../../components/tb-scope-element/tb-scope-element.directive';
import { TbAuditLogRowDirective } from '../tb-audit-log-row/tb-audit-log-row.directive';

import $ from 'jquery';
import auditLogTableTemplate from '../../../../app/audit/audit-log-table.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAuditLogTable` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-audit-log-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbTimewindowDirective), forwardRef(() => TbAuditLogHeaderDirective), forwardRef(() => TbScopeElementDirective), forwardRef(() => TbAuditLogRowDirective)],
  templateUrl: './tb-audit-log-table.directive.html',
})
export class TbAuditLogTableDirective {
  readonly entityType = model<any>();
  readonly entityId = model<any>();
  readonly userId = model<any>();
  readonly customerId = model<any>();
  readonly auditLogMode = input<any>();
  readonly pageMode = input<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly rootScope = inject(RootState);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly auditLogService = inject(AuditLogService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  protected template: any = $templateCache.get(auditLogTableTemplate);
  types: any;
  protected pageSize: any = 20;
  protected startTime: any = 0;
  protected endTime: any = 0;
  timewindow: any = {
            history: {
                timewindowMs: 24 * 60 * 60 * 1000 // 1 day
            }
        };
  topIndex: any = 0;
  searchText: any = '';
  theAuditLogs: any;
  $watch: any;
  auditLogs: any;
  repeatContainer: any;
  searchTextWatchHandle: any;
  timewindowWatchHandle: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
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
                                this.auditLogs.filtered = $filter('filter')(this.auditLogs.data, {$: this.searchText});
                                this.auditLogs.nextPageLink = auditLogs.nextPageLink;
                                this.auditLogs.hasNext = auditLogs.hasNext;
                                if (this.auditLogs.hasNext) {
                                    this.auditLogs.nextPageLink.limit = this.pageSize;
                                }
                                this.auditLogs.pending = false;
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
    this.$watch("entityId", (newVal?: any, prevVal?: any) => {
            if (newVal && !angular.equals(newVal, prevVal)) {
                this.resetFilter();
                this.reload();
            }
        });
    this.$watch("userId", (newVal?: any, prevVal?: any) => {
            if (newVal && !angular.equals(newVal, prevVal)) {
                this.resetFilter();
                this.reload();
            }
        });
    this.$watch("customerId", (newVal?: any, prevVal?: any) => {
            if (newVal && !angular.equals(newVal, prevVal)) {
                this.resetFilter();
                this.reload();
            }
        });
    this.reload();
    this.initWatchers();
    $compile($(this.element.nativeElement).contents())(this);
  }

  prepareAuditLogsData(data?: any, ...rest: any[]): any {
    data.forEach(
        (auditLog?: any) => {
            auditLog.entityTypeText = this.translate.instant(this.typesRef.entityTypeTranslations[auditLog.entityId.entityType].type);
            auditLog.actionTypeText = this.translate.instant(this.typesRef.auditLogActionType[auditLog.actionType].name);
            auditLog.actionStatusText = this.translate.instant(this.typesRef.auditLogActionStatus[auditLog.actionStatus].name);
            auditLog.actionDataText = auditLog.actionData ? JSON.stringify(auditLog.actionData, true) : '';
        }
    );
    return data;
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
    if (this.timewindowWatchHandle) {
        this.timewindowWatchHandle();
        this.timewindowWatchHandle = null;
    }
    if (this.searchTextWatchHandle) {
        this.searchTextWatchHandle();
        this.searchTextWatchHandle = null;
    }
  }

  initWatchers(...rest: any[]): any {
    this.timewindowWatchHandle = this.$watch("timewindow", (newVal?: any, prevVal?: any) => {
        if (newVal && !angular.equals(newVal, prevVal)) {
            this.reload();
        }
    }, true);

    this.searchTextWatchHandle = this.$watch("searchText", (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal)) {
            this.searchTextUpdated();
        }
    }, true);
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
    this.auditLogs.filtered = $filter('filter')(this.auditLogs.data, {$: this.searchText});
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

  hasScroll(...rest: any[]): any {
    var repeatContainer: any = this.repeatContainer[0];
    if (repeatContainer) {
        var scrollElement: any = repeatContainer.children[0];
        if (scrollElement) {
            return scrollElement.scrollHeight > scrollElement.clientHeight;
        }
    }
    return false;
  }
}
