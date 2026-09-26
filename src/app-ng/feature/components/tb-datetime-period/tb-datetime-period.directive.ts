import { Component, inject, model } from '@angular/core';
import { FormsModule, NgControl } from '@angular/forms';

import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbDatetimePeriod` (module `thingsboard.directives.datetimePeriod`) in src/app/components/datetime-period.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-datetime-period',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './tb-datetime-period.directive.html',
})
export class TbDatetimePeriodDirective {
  readonly required = model<any>(undefined, { alias: 'ngRequired' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly ngControl = inject(NgControl, { optional: true, self: true });
  // TODO(port): elements not resolved to a component: mdp-date-picker, mdp-time-picker

  $watch: any;
  endDate: any;
  maxEndDate: any;
  maxStartDate: any;
  minEndDate: any;
  startDate: any;
  writeValue: (value: any) => void = () => {};
  ngOnChanges: (changes: any) => void = () => {};
  onChange?: (value: any) => void;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.writeValue = (value: any) => {
            var date: any = new Date();
            this.startDate = new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() - 1);
            this.endDate = date;
            if (value) {
                this.startDate = new Date(value.startTimeMs);
                this.endDate = new Date(value.endTimeMs);
            }
        };
    this.ngOnChanges = (changes: any) => {
        if (changes['required']) {
            this.updateView();
        }
        if (changes['startDate'] && this.startDate) {
            if (this.startDate.getTime() > this.maxStartDate) {
                this.startDate = structuredClone(this.maxStartDate);
            }
            this.updateMinMaxDates();
            this.updateView();
        }
        if (changes['endDate'] && this.endDate) {
            if (this.endDate.getTime() < this.minEndDate) {
                this.endDate = structuredClone(this.minEndDate);
            } else if (this.endDate.getTime() > this.maxEndDate) {
                this.endDate = structuredClone(this.maxEndDate);
            }
            this.updateMinMaxDates();
            this.updateView();
        }
    };
  }

  updateMinMaxDates(...rest: any[]): any {
    this.maxStartDate = structuredClone(new Date(this.endDate.getTime() - 1000));
    this.minEndDate = structuredClone(new Date(this.startDate.getTime() + 1000));
    this.maxEndDate = new Date();
  }

  updateView(...rest: any[]): any {
    var value: any = null;
    if (this.startDate && this.endDate) {
        value = {
            startTimeMs: this.startDate.getTime(),
            endTimeMs: this.endDate.getTime()
        };
        this.ngControl?.control?.setErrors(null);
    } else {
        this.ngControl?.control?.setErrors(this.required() ? { datetimePeriod: true } : null);
    }
    this.onChange?.(value);
  }
}
