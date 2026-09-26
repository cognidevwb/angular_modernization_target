import { Component, effect, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbDatetimePeriod` (module `thingsboard.directives.datetimePeriod`)
 * in src/app/components/datetime-period.directive.js:24: a fixed time window `{startTimeMs, endTimeMs}`
 * bound through `[(ngModel)]`, edited as a start and an end date-time (the legacy mdp date + time pickers).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-datetime-period',
  standalone: true,
  imports: [TranslatePipe, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './tb-datetime-period.directive.html',
  providers: ngModelProviders(TbDatetimePeriodDirective),
})
export class TbDatetimePeriodDirective extends NgModelController {
  readonly required = model<any>(undefined, { alias: 'ngRequired' });

  startDate: Date | null = null;
  endDate: Date | null = null;
  maxStartDate: Date | null = null;
  minEndDate: Date | null = null;
  maxEndDate: Date | null = null;

  constructor() {
    super();
    // `scope.$watch('required', updateView)`
    effect(() => {
      this.required();
      this.updateView();
    });
  }

  override $render(): void {
    const date = new Date();
    this.startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1);
    this.endDate = date;
    if (this.$viewValue) {
      this.startDate = new Date(this.$viewValue.startTimeMs);
      this.endDate = new Date(this.$viewValue.endTimeMs);
    }
    this.updateMinMaxDates();
  }

  /** `scope.$watch('startDate', …)` */
  setStartDate(value: string): void {
    let newDate = this.fromLocal(value);
    if (newDate) {
      if (this.maxStartDate && newDate.getTime() > this.maxStartDate.getTime()) {
        newDate = new Date(this.maxStartDate.getTime());
      }
      this.startDate = newDate;
      this.updateMinMaxDates();
    } else {
      this.startDate = null;
    }
    this.updateView();
  }

  /** `scope.$watch('endDate', …)` */
  setEndDate(value: string): void {
    let newDate = this.fromLocal(value);
    if (newDate) {
      if (this.minEndDate && newDate.getTime() < this.minEndDate.getTime()) {
        newDate = new Date(this.minEndDate.getTime());
      } else if (this.maxEndDate && newDate.getTime() > this.maxEndDate.getTime()) {
        newDate = new Date(this.maxEndDate.getTime());
      }
      this.endDate = newDate;
      this.updateMinMaxDates();
    } else {
      this.endDate = null;
    }
    this.updateView();
  }

  updateMinMaxDates(): void {
    if (this.endDate) {
      this.maxStartDate = new Date(this.endDate.getTime() - 1000);
    }
    if (this.startDate) {
      this.minEndDate = new Date(this.startDate.getTime() + 1000);
    }
    this.maxEndDate = new Date();
  }

  updateView(): void {
    let value: any = null;
    if (this.startDate && this.endDate) {
      value = { startTimeMs: this.startDate.getTime(), endTimeMs: this.endDate.getTime() };
      this.$setValidity('datetimePeriod', true);
    } else {
      this.$setValidity('datetimePeriod', !this.required());
    }
    if (this.$viewValue?.startTimeMs !== value?.startTimeMs || this.$viewValue?.endTimeMs !== value?.endTimeMs) {
      this.$setViewValue(value);
    }
  }

  /** A Date as the `datetime-local` input's value (local time, seconds precision). */
  toLocal(date: Date | null): string {
    if (!date) {
      return '';
    }
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  }

  private fromLocal(value: string): Date | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
}
