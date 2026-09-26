import { Component, DestroyRef, Injectable, effect, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateAdapter, NativeDateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { RootState } from '../../../root-state';

const hour = 3600000;
const day = 86400000;
const week = 604800000;
const month = 2629743000;

const words: string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Ok",
  'Custom Date Range',
  'Date Range Template',
  'Today',
  'Yesterday',
  'This Week',
  'Last Week',
  'Month',
  'This Month',
  'Last Month',
  'Year',
  'This Year',
  'Last Year'
];

/** The picker's calendar, whose first day of the week follows the widget's `firstDayOfWeek` setting (md-date-range's `first-day-of-week`). */
@Injectable()
export class DateRangeNavigatorDateAdapter extends NativeDateAdapter {
  firstDayOfWeek = 0;

  override getFirstDayOfWeek(): number {
    return this.firstDayOfWeek;
  }
}

/** A `md-date-range` template (Today, Yesterday, This Week…): its name and how it computes the range. */
interface DateRangeTemplate {
  name: string;
  range: () => { start: Date; end: Date };
}

/**
 * Ported from the AngularJS directive `dateRangeNavigatorWidget` (module `thingsboard.widgets.dateRangeNavigator`) in src/app/widget/lib/date-range-navigator/date-range-navigator.js:21.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'date-range-navigator-widget',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatDatepickerModule, MatMenuModule, CommonModule, FormsModule],
  providers: [provideNativeDateAdapter(), DatePipe, { provide: DateAdapter, useClass: DateRangeNavigatorDateAdapter }],
  templateUrl: './date-range-navigator-widget.directive.html',
})
export class DateRangeNavigatorWidgetDirective {
  readonly tableId = model<any>();
  readonly ctx = model<any>();

  protected readonly translate = inject(TranslateService);
  protected readonly datePipe = inject(DatePipe);
  protected readonly rootScope = inject(RootState);
  protected readonly dateAdapter = inject(DateAdapter) as DateRangeNavigatorDateAdapter;
  protected readonly destroyRef = inject(DestroyRef);

  datesMap: any = {
    hour: {
      ts: hour,
      label: "Hour"
    },
    day: {
      ts: day,
      label: "Day"
    },
    week: {
      ts: week,
      label: "Week"
    },
    twoWeeks: {
      ts: week * 2,
      label: "2 weeks"
    },
    month: {
      ts: month,
      label: "Month"
    },
    threeMonths: {
      ts: month * 3,
      label: "3 months"
    },
    sixMonths: {
      ts: month * 6,
      label: "6 months"
    }
  };
  advancedModel: any = {};
  endRestrictionDate: any = Date.now();
  localizationMap: any = this.getLocalizationMap();
  settings: any;
  selectedDateInterval: any;
  selectedStepSize: any;
  customInterval: any;
  dashboardTimewindowChanged: any;
  /** The range being picked in the calendar before it is confirmed. */
  pickStart: Date | null = null;
  pickEnd: Date | null = null;

  private firstUpdate = true;

  readonly dateRangeTemplates: DateRangeTemplate[] = [
    { name: 'Today', range: () => ({ start: this.startOfDay(new Date()), end: this.startOfDay(new Date()) }) },
    { name: 'Yesterday', range: () => {
      const d = this.addDays(this.startOfDay(new Date()), -1);
      return { start: d, end: d };
    } },
    { name: 'This Week', range: () => {
      const start = this.startOfWeek(new Date());
      return { start, end: this.addDays(start, 6) };
    } },
    { name: 'Last Week', range: () => {
      const start = this.addDays(this.startOfWeek(new Date()), -7);
      return { start, end: this.addDays(start, 6) };
    } },
    { name: 'This Month', range: () => {
      const now = new Date();
      return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: new Date(now.getFullYear(), now.getMonth() + 1, 0) };
    } },
    { name: 'Last Month', range: () => {
      const now = new Date();
      return { start: new Date(now.getFullYear(), now.getMonth() - 1, 1), end: new Date(now.getFullYear(), now.getMonth(), 0) };
    } },
    { name: 'This Year', range: () => {
      const now = new Date();
      return { start: new Date(now.getFullYear(), 0, 1), end: new Date(now.getFullYear(), 11, 31) };
    } },
    { name: 'Last Year', range: () => {
      const now = new Date();
      return { start: new Date(now.getFullYear() - 1, 0, 1), end: new Date(now.getFullYear() - 1, 11, 31) };
    } }
  ];

  constructor() {
    effect(() => {
      const ctx: any = this.ctx();
      if (ctx && ctx.dashboard.dashboardTimewindow) {
        this.settings = ctx.widgetConfig.settings;
        this.dateAdapter.firstDayOfWeek = Number(this.settings.firstDayOfWeek) || 0;
        let selection: any;
        if (this.settings.useSessionStorage) {
          selection = this.readFromStorage('date-range');
        }
        if (selection) {
          this.advancedModel = {
            selectedTemplateName: selection.name,
            dateStart: selection.start,
            dateEnd: selection.end
          };
        } else {
          const end: any = new Date();
          end.setHours(23, 59, 59, 999);

          const formattedDate: any = this.getFormattedDate(
            (end.getTime() + 1) - this.datesMap[this.settings.initialInterval || "week"].ts,
            end.getTime()
          );
          this.advancedModel = formattedDate;
        }
        this.selectedStepSize = this.datesMap[this.settings.stepSize || "day"].ts;

        this.widgetContextTimewindowSync();
      }
    });

    const deregister = this.rootScope.$on('dashboardTimewindowChanged', () => {
      this.dashboardTimewindowChanged = true;
      this.widgetContextTimewindowSync();
    });
    this.destroyRef.onDestroy(() => deregister());
  }

  getLocalizationMap(): any {
    const result: any = {};

    words.forEach((key: string) => {
      result[key] = this.translate.instant('widgets.date-range-navigator.localizationMap.' + key);
    });

    return result;
  }

  triggerChange(): void {
    this.updateTimewindow(this.advancedModel.dateStart.getTime(), this.advancedModel.dateEnd.getTime() + day - 1);
  }

  /** The calendar opened: it shows the current selection. */
  onPickerOpened(): void {
    this.pickStart = this.advancedModel.dateStart || null;
    this.pickEnd = this.advancedModel.dateEnd || null;
  }

  /** A range was picked (md-on-select): the model takes it and the dashboard timewindow follows. */
  onRangePicked(): void {
    if (this.pickStart && this.pickEnd) {
      const end = new Date(this.pickEnd.getTime());
      this.advancedModel = {
        selectedTemplateName: this.getFormattedDate(this.pickStart.getTime(), end.getTime()).selectedTemplateName,
        dateStart: this.pickStart,
        dateEnd: end
      };
      this.triggerChange();
    }
  }

  /** A template (Today, Last Week…) was chosen (md-date-range's `show-template`). */
  selectTemplate(template: DateRangeTemplate): void {
    const range = template.range();
    this.advancedModel = {
      selectedTemplateName: this.localizationMap[template.name],
      dateStart: range.start,
      dateEnd: range.end
    };
    this.triggerChange();
  }

  widgetContextTimewindowSync(): void {
    const ctx: any = this.ctx();
    if (ctx && ctx.dashboardTimewindow && this.dashboardTimewindowChanged &&
      ctx.dashboard.dashboardTimewindow.history &&
      ctx.dashboard.dashboardTimewindow.history.fixedTimewindow) {

      if (!this.firstUpdate) {
        this.updateAdvancedModel();
      }
      this.updateDateInterval();
      if (this.settings.useSessionStorage) {
        this.updateStorageDate();
      }
      if (this.firstUpdate) {
        this.updateTimewindow(this.advancedModel.dateStart.getTime(), this.advancedModel.dateEnd.getTime());
        this.firstUpdate = false;
      }
    }
  }

  getFormattedDate(startTime?: any, endTime?: any): any {
    let template: any;

    const startDate: any = new Date(startTime);
    const endDate: any = new Date(endTime);

    if (this.getDateDiff(startDate, endDate) === 0) {
      template = this.datePipe.transform(startDate, 'dd MMM yyyy');
    } else {
      template = this.datePipe.transform(
        startDate,
        'dd' + (startDate.getMonth() !== endDate.getMonth() || startDate.getFullYear() !== endDate.getFullYear() ? ' MMM' : '') + (startDate.getFullYear() !== endDate.getFullYear() ? ' yyyy' : '')
      )
        + ' - ' +
        this.datePipe.transform(
          endDate,
          'dd MMM yyyy'
        );
    }

    return {
      selectedTemplateName: template,
      dateStart: startDate,
      dateEnd: endDate
    };
  }

  readFromStorage(itemKey?: any): any {
    if (window.sessionStorage.getItem(itemKey)) {
      const selection: any = JSON.parse(window.sessionStorage.getItem(itemKey) as string);
      selection.start = new Date(parseInt(selection.start));
      selection.end = new Date(parseInt(selection.end));
      return selection;
    }

    return undefined;
  }

  goForth(): void {
    const ctx: any = this.ctx();
    const startTime: any = ctx.dashboard.dashboardTimewindow.history ?
      ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs :
      this.advancedModel.dateStart.getTime();
    const endTime: any = ctx.dashboard.dashboardTimewindow.history ?
      ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs :
      this.advancedModel.dateEnd.getTime();
    this.updateTimewindow(startTime + this.selectedStepSize, endTime + this.selectedStepSize);
  }

  goBack(): void {
    const ctx: any = this.ctx();
    const startTime: any = ctx.dashboard.dashboardTimewindow.history ?
      ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.startTimeMs :
      this.advancedModel.dateStart.getTime();
    const endTime: any = ctx.dashboard.dashboardTimewindow.history ?
      ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs :
      this.advancedModel.dateEnd.getTime();
    this.updateTimewindow(startTime - this.selectedStepSize, endTime - this.selectedStepSize);
  }

  changeInterval(): void {
    const ctx: any = this.ctx();
    const endTime: any = ctx.dashboard.dashboardTimewindow.history ?
      ctx.dashboard.dashboardTimewindow.history.fixedTimewindow.endTimeMs :
      this.advancedModel.dateEnd.getTime();
    this.updateTimewindow(endTime - this.selectedDateInterval / 2, endTime + this.selectedDateInterval / 2);
  }

  getDateDiff(date1?: any, date2?: any): any {
    if (!date1 || !date2) return undefined;
    const _d1: any = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()),
      _d2: any = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
    return _d2 - _d1;
  }

  updateTimewindow(startTime?: any, endTime?: any): void {
    this.ctx().dashboard.dashboardTimewindowApi.onUpdateTimewindow(startTime, endTime, 10);
  }

  updateDateInterval(): void {
    const interval: any = this.advancedModel.dateEnd.getTime() - this.advancedModel.dateStart.getTime();

    for (const i in this.datesMap) {
      if (Object.prototype.hasOwnProperty.call(this.datesMap, i)) {
        if (this.datesMap[i].ts === interval || this.datesMap[i].ts === interval + 1 || this.datesMap[i].ts === interval - 1) {
          this.selectedDateInterval = this.datesMap[i].ts;
          this.customInterval = false;
          return;
        }
      }
    }

    this.selectedDateInterval = interval;
    this.customInterval = { ts: interval, label: "Custom interval" };
  }

  updateAdvancedModel(): void {
    const fixedTimewindow: any = this.ctx().dashboard.dashboardTimewindow.history.fixedTimewindow;
    this.advancedModel = this.getFormattedDate(fixedTimewindow.startTimeMs, fixedTimewindow.endTimeMs);
  }

  updateStorageDate(): void {
    this.saveIntoStorage('date-range', {
      start: this.advancedModel.dateStart.getTime(),
      end: this.advancedModel.dateEnd.getTime(),
      name: this.advancedModel.selectedTemplateName
    });
  }

  saveIntoStorage(keyName?: any, selection?: any): void {
    if (selection) {
      window.sessionStorage.setItem(keyName, JSON.stringify(selection));
    }
  }

  private startOfDay(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  private addDays(date: Date, days: number): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
  }

  private startOfWeek(date: Date): Date {
    const d = this.startOfDay(date);
    const diff = (d.getDay() - this.dateAdapter.firstDayOfWeek + 7) % 7;
    return this.addDays(d, -diff);
  }

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
