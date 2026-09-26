import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EventService } from '../../api/services/event.service';
import { RootState } from '../../../root-state';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbTimewindowDirective } from '../../components/tb-timewindow/tb-timewindow.directive';
import { TbEventHeaderDirective } from '../tb-event-header/tb-event-header.directive';
import { TbScopeElementDirective } from '../../components/tb-scope-element/tb-scope-element.directive';
import { TbEventRowDirective } from '../tb-event-row/tb-event-row.directive';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import eventTableTemplate from '../../../../app/event/event-table.tpl.html';
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
 * Ported from the AngularJS directive `tbEventTable` (module `thingsboard.event`) in src/app/event/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-event-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatSelectModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbTimewindowDirective), forwardRef(() => TbEventHeaderDirective), forwardRef(() => TbScopeElementDirective), forwardRef(() => TbEventRowDirective)],
  templateUrl: './tb-event-table.directive.html',
})
export class TbEventTableDirective {
  readonly entityType = model<any>();
  readonly entityId = model<any>();
  readonly tenantId = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly rootScope = inject(RootState);
  protected readonly eventService = inject(EventService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  protected template: any = $templateCache.get(eventTableTemplate);
  eventType: any;
  protected pageSize: any = 20;
  protected startTime: any = 0;
  protected endTime: any = 0;
  timewindow: any = {
            history: {
                timewindowMs: 24 * 60 * 60 * 1000 // 1 day
            }
        };
  topIndex: any = 0;
  theEvents: any;
  $watch: any;
  eventTypes: any;
  events: any;
  repeatContainer: any;
  selected: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    if (this.attrs.disabledEventTypes) {
            var disabledEventTypes: any = this.attrs.disabledEventTypes.split(',');
            this.eventTypes = {};
            for (var type in types.eventType) {
                var eventType: any = types.eventType[type];
                var enabled: any = true;
                for (var i: any=0;i<disabledEventTypes.length;i++) {
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
    if (this.attrs.debugEventTypes) {
            var debugEventTypes: any = this.attrs.debugEventTypes.split(',');
            for (i=0;i<debugEventTypes.length;i++) {
                for (type in types.debugEventType) {
                    eventType = types.debugEventType[type];
                    if (eventType.value === debugEventTypes[i]) {
                        this.eventTypes[type] = eventType;
                    }
                }
            }
        }
    this.eventType = this.attrs.defaultEventType;
    this.theEvents = {
            getItemAtIndex: (index?: any, ...rest: any[]) => {
                if (index > this.events.data.length) {
                    this.theEvents.fetchMoreItems_(index);
                    return null;
                }
                var item: any = this.events.data[index];
                if (item) {
                    item.indexNumber = index + 1;
                }
                return item;
            },

            getLength: (...rest: any[]) => {
                if (this.events.hasNext) {
                    return this.events.data.length + this.events.nextPageLink.limit;
                } else {
                    return this.events.data.length;
                }
                return undefined;
            },

            fetchMoreItems_: (...rest: any[]) => {
                if (this.events.hasNext && !this.events.pending) {
                    if (this.entityType() && this.entityId() && this.eventType && this.tenantId()) {
                        var promise: any = this.eventService.getEvents(this.entityType(), this.entityId(),
                            this.eventType, this.tenantId(), this.events.nextPageLink);
                        if (promise) {
                            this.events.pending = true;
                            promise.then(
                                (events?: any) => {
                                    this.events.data = this.events.data.concat(events.data);
                                    this.events.nextPageLink = events.nextPageLink;
                                    this.events.hasNext = events.hasNext;
                                    if (this.events.hasNext) {
                                        this.events.nextPageLink.limit = this.pageSize;
                                    }
                                    this.events.pending = false;
                                },
                                () => {
                                    this.events.hasNext = false;
                                    this.events.pending = false;
                                });
                        } else {
                            this.events.hasNext = false;
                        }
                    } else {
                        this.events.hasNext = false;
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
    this.$watch("eventType", (newVal?: any, prevVal?: any) => {
            if (newVal && !angular.equals(newVal, prevVal)) {
                this.reload();
            }
        });
    this.$watch("timewindow", (newVal?: any, prevVal?: any) => {
            if (newVal && !angular.equals(newVal, prevVal)) {
                this.reload();
            }
        }, true);
    this.reload();
    $compile($(this.element.nativeElement).contents())(this);
  }

  resetFilter(...rest: any[]): any {
    this.timewindow = {
        history: {
            timewindowMs: 24 * 60 * 60 * 1000 // 1 day
        }
    };
    this.eventType = this.attrs.defaultEventType;
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
    this.selected = [];
    this.updateTimeWindowRange();
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
    this.theEvents.getItemAtIndex(this.pageSize);
  }

  noData(...rest: any[]): any {
    return this.events.data.length == 0 && !this.events.hasNext;
  }

  hasData(...rest: any[]): any {
    return this.events.data.length > 0;
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

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
