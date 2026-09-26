import { Component, ElementRef, OnInit, effect, forwardRef, inject, model, untracked, viewChild } from '@angular/core';
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
import { EventService } from '../../api/services/event.service';
import { RootState } from '../../../root-state';
import { types } from '../../common/constants/types';
import { linkAttrs } from '../../../legacy-link';
import { TbTimewindowDirective } from '../../components/tb-timewindow/tb-timewindow.directive';
import { TbEventHeaderDirective } from '../tb-event-header/tb-event-header.directive';
import { TbEventRowDirective } from '../tb-event-row/tb-event-row.directive';

/**
 * Ported from the AngularJS directive `tbEventTable` (module `thingsboard.event`) in src/app/event/index.js:23.
 * The on-demand `md-virtual-repeat` is a cdk virtual scroll over the loaded pages; the next
 * page is fetched when the scroll reaches the end of what is loaded.
 * `default-event-type`, `disabled-event-types` and `debug-event-types` stay plain host attributes.
 */
@Component({
  selector: 'tb-event-table',
  standalone: true,
  imports: [
    TranslatePipe, NgStyle, FormsModule, ScrollingModule, MatTooltipModule, MatSelectModule, MatProgressBarModule,
    MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule,
    forwardRef(() => TbTimewindowDirective), forwardRef(() => TbEventHeaderDirective), forwardRef(() => TbEventRowDirective),
  ],
  templateUrl: './tb-event-table.directive.html',
})
export class TbEventTableDirective implements OnInit {
  readonly entityType = model<any>();
  readonly entityId = model<any>();
  readonly tenantId = model<any>();

  protected readonly rootScope = inject(RootState);
  protected readonly eventService = inject(EventService);
  protected readonly element = inject(ElementRef);
  private readonly viewport = viewChild(CdkVirtualScrollViewport);

  protected readonly rowHeight = 48;
  protected pageSize: any = 20;
  protected startTime: any = 0;
  protected endTime: any = 0;

  eventType: any;
  timewindow: any = {
            history: {
                timewindowMs: 24 * 60 * 60 * 1000 // 1 day
            }
        };
  topIndex: any = 0;
  eventTypes: any = {};
  events: any = { data: [], hasNext: false, pending: false };
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
    const attrs = this.attrs;
    if (attrs.disabledEventTypes) {
        var disabledEventTypes: any = attrs.disabledEventTypes.split(',');
        this.eventTypes = {};
        for (var type in types.eventType) {
            var eventType: any = types.eventType[type];
            var enabled: any = true;
            for (var i: any = 0; i < disabledEventTypes.length; i++) {
                if (eventType.value === disabledEventTypes[i]) {
                    enabled = false;
                    break;
                }
            }
            if (enabled) {
                this.eventTypes[type] = eventType;
            }
        }
    } else {
        this.eventTypes = structuredClone(types.eventType);
    }
    if (attrs.debugEventTypes) {
        var debugEventTypes: any = attrs.debugEventTypes.split(',');
        for (i = 0; i < debugEventTypes.length; i++) {
            for (type in types.debugEventType) {
                eventType = types.debugEventType[type];
                if (eventType.value === debugEventTypes[i]) {
                    this.eventTypes[type] = eventType;
                }
            }
        }
    }
    this.eventType = attrs.defaultEventType;
    this.prevEntityId = this.entityId();
    this.initialized = true;
    this.reload();
  }

  /** The legacy `ng-repeat="type in eventTypes"` over an object: its values. */
  eventTypeList(): any[] {
    return Object.values(this.eventTypes);
  }

  /** Legacy `$watch("eventType")`. */
  onEventTypeChange(eventType: any): void {
    const prev = this.eventType;
    this.eventType = eventType;
    if (eventType && !this.equals(eventType, prev)) {
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
    if (index + this.pageSize >= this.events.data.length) {
        this.fetchMoreItems();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  resetFilter(): void {
    this.timewindow = {
        history: {
            timewindowMs: 24 * 60 * 60 * 1000 // 1 day
        }
    };
    this.eventType = this.attrs.defaultEventType;
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
    this.events = {
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

  /** Legacy `theEvents.fetchMoreItems_`: loads the next page of events. */
  fetchMoreItems(): void {
    if (this.events.hasNext && !this.events.pending) {
        if (this.entityType() && this.entityId() && this.eventType && this.tenantId()) {
            var promise: any = this.eventService.getEvents(this.entityType(), this.entityId(),
                this.eventType, this.tenantId(), this.events.nextPageLink);
            if (promise) {
                const events = this.events;
                events.pending = true;
                promise.then(
                    (page?: any) => {
                        const offset = events.data.length;
                        page.data.forEach((item: any, i: number) => {
                            if (item) {
                                item.indexNumber = offset + i + 1;
                            }
                        });
                        events.data = events.data.concat(page.data);
                        events.nextPageLink = page.nextPageLink;
                        events.hasNext = page.hasNext;
                        if (events.hasNext) {
                            events.nextPageLink.limit = this.pageSize;
                        }
                        events.pending = false;
                    },
                    () => {
                        events.hasNext = false;
                        events.pending = false;
                    });
            } else {
                this.events.hasNext = false;
            }
        } else {
            this.events.hasNext = false;
        }
    }
  }

  noData(): boolean {
    return this.events.data.length == 0 && !this.events.hasNext;
  }

  hasData(): boolean {
    return this.events.data.length > 0;
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
    if (this.initialized && entityId && !this.equals(entityId, prev)) {
        this.resetFilter();
        this.reload();
    }
  }

  /** Legacy `angular.equals` for the watched values (ids, event types, plain timewindow objects). */
  private equals(a: any, b: any): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
  }

  /** The host element's attributes (`default-event-type`, `disabled-event-types`, `debug-event-types`). */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
