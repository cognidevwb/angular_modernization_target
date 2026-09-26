import { Component, OnInit, effect, forwardRef, inject, model, untracked, viewChild } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { AlarmService } from '../../api/services/alarm.service';
import { RootState } from '../../../root-state';
import { types } from '../../common/constants/types';
import { TbTimewindowDirective } from '../../components/tb-timewindow/tb-timewindow.directive';
import { TbAlarmHeaderDirective } from '../tb-alarm-header/tb-alarm-header.directive';
import { TbAlarmRowDirective } from '../tb-alarm-row/tb-alarm-row.directive';

/**
 * Ported from the AngularJS directive `tbAlarmTable` (module `thingsboard.alarm`) in src/app/alarm/index.js:21.
 * The on-demand `md-virtual-repeat` is a cdk virtual scroll over the loaded pages; the next
 * page is fetched when the scroll reaches the end of what is loaded.
 */
@Component({
  selector: 'tb-alarm-table',
  standalone: true,
  imports: [
    TranslatePipe, NgStyle, FormsModule, ScrollingModule, MatTooltipModule, MatSelectModule,
    MatProgressBarModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule,
    forwardRef(() => TbTimewindowDirective), forwardRef(() => TbAlarmHeaderDirective), forwardRef(() => TbAlarmRowDirective),
  ],
  templateUrl: './tb-alarm-table.directive.html',
})
export class TbAlarmTableDirective implements OnInit {
  readonly entityType = model<any>();
  readonly entityId = model<any>();

  protected readonly rootScope = inject(RootState);
  protected readonly types: any = types;
  protected readonly alarmService = inject(AlarmService);
  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  protected readonly alarmSearchStatuses: string[] = Object.values(types.alarmSearchStatus as Record<string, string>);
  protected readonly rowHeight = 48;
  protected pageSize: any = 20;
  protected startTime: any = 0;
  protected endTime: any = 0;

  alarmSearchStatus: any = types.alarmSearchStatus.any;
  timewindow: any = {
            history: {
                timewindowMs: 24 * 60 * 60 * 1000 // 1 day
            }
        };
  topIndex: any = 0;
  alarms: any = { data: [], hasNext: false, pending: false };
  selected: any;

  private initialized = false;
  private prevEntityId: any;
  /** Snapshot of the timewindow the rows were loaded for (the legacy deep watch compares copies). */
  private timewindowJson = '';

  constructor() {
    // Legacy `$watch("entityId")`: a new entity resets the filter and reloads.
    effect(() => {
      const entityId = this.entityId();
      untracked(() => this.onEntityIdChange(entityId));
    });
  }

  ngOnInit(): void {
    this.prevEntityId = this.entityId();
    this.initialized = true;
    this.reload();
  }

  /** Legacy `$watch("alarmSearchStatus")`. */
  onAlarmSearchStatusChange(alarmSearchStatus: any): void {
    const prev = this.alarmSearchStatus;
    this.alarmSearchStatus = alarmSearchStatus;
    if (alarmSearchStatus && alarmSearchStatus !== prev) {
        this.reload();
    }
  }

  /** Legacy deep `$watch("timewindow")`. */
  onTimewindowChange(timewindow: any): void {
    const prev = this.timewindowJson;
    this.timewindow = timewindow;
    if (timewindow && JSON.stringify(timewindow) !== prev) {
        this.reload();
    }
  }

  /** The virtual scroll reached `index`: fetch the next page when the end of the loaded rows is in view. */
  onScrolledIndexChange(index: number): void {
    if (index + this.pageSize >= this.alarms.data.length) {
        this.fetchMoreItems();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  /** Legacy `resetFilter`: its watchers were paused around the reset, so the reset itself does not reload. */
  resetFilter(): void {
    this.timewindow = {
        history: {
            timewindowMs: 24 * 60 * 60 * 1000 // 1 day
        }
    };
    this.alarmSearchStatus = types.alarmSearchStatus.any;
  }

  updateTimeWindowRange(): void {
    if (this.timewindow.history.timewindowMs) {
        var currentTime: any = (new Date).getTime();
        this.startTime = currentTime - this.timewindow.history.timewindowMs;
        this.endTime = currentTime;
    } else {
        this.startTime = this.timewindow.history.fixedTimewindow.startTimeMs;
        this.endTime = this.timewindow.history.fixedTimewindow.endTimeMs;
    }
  }

  reload(): void {
    this.topIndex = 0;
    this.selected = [];
    this.updateTimeWindowRange();
    this.timewindowJson = JSON.stringify(this.timewindow);
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
    this.viewport()?.scrollToIndex(0);
    this.fetchMoreItems();
  }

  /** Legacy `theAlarms.fetchMoreItems_`: loads the next page of alarms. */
  fetchMoreItems(): void {
    if (this.alarms.hasNext && !this.alarms.pending) {
        if (this.entityType() && this.entityId() && this.alarmSearchStatus) {
            var promise: any = this.alarmService.getAlarms(this.entityType(), this.entityId(),
                this.alarms.nextPageLink, this.alarmSearchStatus, null, true, false);
            if (promise) {
                const alarms = this.alarms;
                alarms.pending = true;
                promise.then(
                    (page?: any) => {
                        const offset = alarms.data.length;
                        page.data.forEach((item: any, i: number) => {
                            if (item) {
                                item.indexNumber = offset + i + 1;
                            }
                        });
                        alarms.data = alarms.data.concat(page.data);
                        alarms.nextPageLink = page.nextPageLink;
                        alarms.hasNext = page.hasNext;
                        if (alarms.hasNext) {
                            alarms.nextPageLink.limit = this.pageSize;
                        }
                        alarms.pending = false;
                    },
                    () => {
                        alarms.hasNext = false;
                        alarms.pending = false;
                    });
            } else {
                this.alarms.hasNext = false;
            }
        } else {
            this.alarms.hasNext = false;
        }
    }
  }

  noData(): boolean {
    return this.alarms.data.length == 0 && !this.alarms.hasNext;
  }

  hasData(): boolean {
    return this.alarms.data.length > 0;
  }

  loading(): any {
    return this.rootScope.loading;
  }

  hasScroll(): boolean {
    const scrollElement = this.viewport()?.elementRef.nativeElement;
    if (scrollElement) {
        return scrollElement.scrollHeight > scrollElement.clientHeight;
    }
    return false;
  }

  private onEntityIdChange(entityId: any): void {
    const prev = this.prevEntityId;
    this.prevEntityId = entityId;
    if (this.initialized && entityId && JSON.stringify(entityId) !== JSON.stringify(prev)) {
        this.resetFilter();
        this.reload();
    }
  }
}
