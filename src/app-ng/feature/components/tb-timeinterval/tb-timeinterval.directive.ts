import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TimeService } from '../../api/services/time.service';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import timeintervalTemplate from '../../../../app/components/timeinterval.tpl.html';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbTimeinterval` (module `thingsboard.directives.timeinterval`) in src/app/components/timeinterval.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-timeinterval',
  standalone: true,
  imports: [TranslatePipe, MatSlideToggleModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, FormsModule],
  templateUrl: './tb-timeinterval.directive.html',
})
export class TbTimeintervalDirective {
  readonly required = model<any>(undefined, { alias: 'ngRequired' });
  readonly min = model<any>();
  readonly max = model<any>();
  readonly predefinedName = model<any>();
  readonly hideFlag = model<any>();
  readonly isEdit = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly timeService = inject(TimeService);
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(timeintervalTemplate);
  rendered: any = false;
  days: any = 0;
  hours: any = 0;
  mins: any = 1;
  secs: any = 0;
  advanced: any = false;
  $watch: any;
  intervalMs: any;
  intervals: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                var intervalMs: any = ngModelCtrl.$viewValue;
                if (!this.rendered) {
                    this.advanced = !this.timeService.matchesExistingInterval(this.min(), this.max(), intervalMs);
                }
                this.setIntervalMs(intervalMs);
            }
            this.rendered = true;
        }
    this.$watch('required', (newRequired?: any, prevRequired?: any) => {
            if ((newRequired !== undefined) && newRequired !== prevRequired) {
                this.updateView();
            }
        });
    this.$watch('min', (newMin?: any, prevMin?: any) => {
            if ((newMin !== undefined) && newMin !== prevMin) {
                this.updateView();
            }
        });
    this.$watch('max', (newMax?: any, prevMax?: any) => {
            if ((newMax !== undefined) && newMax !== prevMax) {
                this.updateView();
            }
        });
    this.$watch('intervalMs', (newIntervalMs?: any, prevIntervalMs?: any) => {
            if ((newIntervalMs !== undefined) && newIntervalMs !== prevIntervalMs) {
                this.updateView();
            }
        });
    this.$watch('advanced', (newAdvanced?: any, prevAdvanced?: any) => {
            if ((newAdvanced !== undefined) && newAdvanced !== prevAdvanced) {
                if (!this.advanced) {
                    this.intervalMs = this.calculateIntervalMs();
                } else {
                    var intervalMs: any = this.intervalMs;
                    if (!intervalMs || isNaN(intervalMs)) {
                        intervalMs = this.calculateIntervalMs();
                    }
                    this.setIntervalMs(intervalMs);
                }
                this.updateView();
            }
        });
    this.$watch('secs', (newSecs?: any) => {
            if ((newSecs === undefined)) {
                return;
            }
            if (newSecs < 0) {
                if ((this.days + this.hours + this.mins) > 0) {
                    this.secs = newSecs + 60;
                    this.mins--;
                } else {
                    this.secs = 0;
                }
            } else if (newSecs >= 60) {
                this.secs = newSecs - 60;
                this.mins++;
            }
            this.updateView();
        });
    this.$watch('mins', (newMins?: any) => {
            if ((newMins === undefined)) {
                return;
            }
            if (newMins < 0) {
                if ((this.days + this.hours) > 0) {
                    this.mins = newMins + 60;
                    this.hours--;
                } else {
                    this.mins = 0;
                }
            } else if (newMins >= 60) {
                this.mins = newMins - 60;
                this.hours++;
            }
            this.updateView();
        });
    this.$watch('hours', (newHours?: any) => {
            if ((newHours === undefined)) {
                return;
            }
            if (newHours < 0) {
                if (this.days > 0) {
                    this.hours = newHours + 24;
                    this.days--;
                } else {
                    this.hours = 0;
                }
            } else if (newHours >= 24) {
                this.hours = newHours - 24;
                this.days++;
            }
            this.updateView();
        });
    this.$watch('days', (newDays?: any) => {
            if ((newDays === undefined)) {
                return;
            }
            if (newDays < 0) {
                this.days = 0;
            }
            this.updateView();
        });
    this.boundInterval();
    $compile($(this.element.nativeElement).contents())(this);
  }

  boundInterval(...rest: any[]): any {
    var min: any = this.timeService.boundMinInterval(this.min());
    var max: any = this.timeService.boundMaxInterval(this.max());
    this.intervals = this.timeService.getIntervals(this.min(), this.max());
    if (this.rendered) {
        var newIntervalMs: any = ngModelCtrl.$viewValue;
        if (newIntervalMs < min) {
            newIntervalMs = min;
        } else if (newIntervalMs > max) {
            newIntervalMs = max;
        }
        if (!this.advanced) {
            newIntervalMs = this.timeService.boundToPredefinedInterval(min, max, newIntervalMs);
        }
        if (newIntervalMs !== ngModelCtrl.$viewValue) {
            this.setIntervalMs(newIntervalMs);
            this.updateView();
        }
    }
  }

  setIntervalMs(intervalMs?: any, ...rest: any[]): any {
    if (!this.advanced) {
        this.intervalMs = intervalMs;
    }
    var intervalSeconds: any = Math.floor(intervalMs / 1000);
    this.days = Math.floor(intervalSeconds / 86400);
    this.hours = Math.floor((intervalSeconds % 86400) / 3600);
    this.mins = Math.floor(((intervalSeconds % 86400) % 3600) / 60);
    this.secs = intervalSeconds % 60;
  }

  calculateIntervalMs(...rest: any[]): any {
    return (this.days * 86400 +
        this.hours * 3600 +
        this.mins * 60 +
        this.secs) * 1000;
  }

  updateView(...rest: any[]): any {
    if (!this.rendered) {
        return;
    }
    var value: any = null;
    var intervalMs: any;
    if (!this.advanced) {
        intervalMs = this.intervalMs;
        if (!intervalMs || isNaN(intervalMs)) {
            intervalMs = this.calculateIntervalMs();
        }
    } else {
        intervalMs = this.calculateIntervalMs();
    }
    if (!isNaN(intervalMs) && intervalMs > 0) {
        value = intervalMs;
        ngModelCtrl.$setValidity('tb-timeinterval', true);
    } else {
        ngModelCtrl.$setValidity('tb-timeinterval', !this.required());
    }
    ngModelCtrl.$setViewValue(value);
    this.boundInterval();
  }
}
