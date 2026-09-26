import { Component, forwardRef, inject, model } from '@angular/core';
import { AlarmService } from '../../api/services/alarm.service';
import { ElementRef } from '@angular/core';
import { RootState } from '../../../root-state';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbTimewindowDirective } from '../../components/tb-timewindow/tb-timewindow.directive';
import { TbAlarmHeaderDirective } from '../tb-alarm-header/tb-alarm-header.directive';
import { TbScopeElementDirective } from '../../components/tb-scope-element/tb-scope-element.directive';
import { TbAlarmRowDirective } from '../tb-alarm-row/tb-alarm-row.directive';

import $ from 'jquery';
import alarmTableTemplate from '../../../../app/alarm/alarm-table.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAlarmTable` (module `thingsboard.alarm`) in src/app/alarm/index.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-alarm-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatSelectModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbTimewindowDirective), forwardRef(() => TbAlarmHeaderDirective), forwardRef(() => TbScopeElementDirective), forwardRef(() => TbAlarmRowDirective)],
  templateUrl: './tb-alarm-table.directive.html',
})
export class TbAlarmTableDirective {
  readonly entityType = model<any>();
  readonly entityId = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly rootScope = inject(RootState);
  protected readonly typesRef: any = types;
  protected readonly alarmService = inject(AlarmService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  protected template: any = $templateCache.get(alarmTableTemplate);
  types: any;
  alarmSearchStatus: any;
  protected pageSize: any = 20;
  protected startTime: any = 0;
  protected endTime: any = 0;
  timewindow: any = {
            history: {
                timewindowMs: 24 * 60 * 60 * 1000 // 1 day
            }
        };
  topIndex: any = 0;
  theAlarms: any;
  $watch: any;
  alarmSearchStatusWatchHandle: any;
  alarms: any;
  repeatContainer: any;
  selected: any;
  timewindowWatchHandle: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.alarmSearchStatus = this.typesRef.alarmSearchStatus.any;
    this.theAlarms = {
            getItemAtIndex: (index?: any, ...rest: any[]) => {
                if (index > this.alarms.data.length) {
                    this.theAlarms.fetchMoreItems_(index);
                    return null;
                }
                var item: any = this.alarms.data[index];
                if (item) {
                    item.indexNumber = index + 1;
                }
                return item;
            },

            getLength: (...rest: any[]) => {
                if (this.alarms.hasNext) {
                    return this.alarms.data.length + this.alarms.nextPageLink.limit;
                } else {
                    return this.alarms.data.length;
                }
                return undefined;
            },

            fetchMoreItems_: (...rest: any[]) => {
                if (this.alarms.hasNext && !this.alarms.pending) {
                    if (this.entityType() && this.entityId() && this.alarmSearchStatus) {
                        var promise: any = this.alarmService.getAlarms(this.entityType(), this.entityId(),
                            this.alarms.nextPageLink, this.alarmSearchStatus, null, true, false);
                        if (promise) {
                            this.alarms.pending = true;
                            promise.then(
                                (alarms?: any) => {
                                    this.alarms.data = this.alarms.data.concat(alarms.data);
                                    this.alarms.nextPageLink = alarms.nextPageLink;
                                    this.alarms.hasNext = alarms.hasNext;
                                    if (this.alarms.hasNext) {
                                        this.alarms.nextPageLink.limit = this.pageSize;
                                    }
                                    this.alarms.pending = false;
                                },
                                () => {
                                    this.alarms.hasNext = false;
                                    this.alarms.pending = false;
                                });
                        } else {
                            this.alarms.hasNext = false;
                        }
                    } else {
                        this.alarms.hasNext = false;
                    }
                }
            }
        };
    this.reload = this.reload;
    this.$watch("entityId", (newVal?: any, prevVal?: any) => {
            if (newVal && !angular.equals(newVal, prevVal)) {
                this.resetFilter();
                this.reload();
            }
        });
    this.reload();
    this.initWatchers();
    $compile($(this.element.nativeElement).contents())(this);
  }

  destroyWatchers(...rest: any[]): any {
    if (this.alarmSearchStatusWatchHandle) {
        this.alarmSearchStatusWatchHandle();
        this.alarmSearchStatusWatchHandle = null;
    }
    if (this.timewindowWatchHandle) {
        this.timewindowWatchHandle();
        this.timewindowWatchHandle = null;
    }
  }

  initWatchers(...rest: any[]): any {
    this.alarmSearchStatusWatchHandle = this.$watch("alarmSearchStatus", (newVal?: any, prevVal?: any) => {
        if (newVal && !angular.equals(newVal, prevVal)) {
            this.reload();
        }
    });
    this.timewindowWatchHandle = this.$watch("timewindow", (newVal?: any, prevVal?: any) => {
        if (newVal && !angular.equals(newVal, prevVal)) {
            this.reload();
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
    this.alarmSearchStatus = this.typesRef.alarmSearchStatus.any;
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

  reload = (...rest: any[]): any => {
    this.topIndex = 0;
    this.selected = [];
    this.updateTimeWindowRange();
    this.alarms = {
        data: [],
        nextPageLink: {
            limit: this.pageSize,
            startTime: this.startTime,
            endTime: this.endTime
        },
        hasNext: true,
        pending: false
    };
    this.theAlarms.getItemAtIndex(this.pageSize);
  };

  noData(...rest: any[]): any {
    return this.alarms.data.length == 0 && !this.alarms.hasNext;
  }

  hasData(...rest: any[]): any {
    return this.alarms.data.length > 0;
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
