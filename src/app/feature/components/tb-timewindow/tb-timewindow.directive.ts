import { Component, DestroyRef, effect, ElementRef, inject, Injector, input, model, untracked, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DatePipe } from '@angular/common';
import { MilliSecondsToTimeStringPipe } from '../pipes/milli-seconds-to-time-string.pipe';
import { Overlay } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule, TooltipPosition } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { merge } from 'rxjs';
import { TimeService } from '../../api/services/time.service';
import { linkAttrs } from '../../../legacy-link';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { TimewindowPanelComponent } from '../timewindow-panel/timewindow-panel.component';
import { mdPanelPlacement, openMdPanel } from '../md-panel/md-panel';

/** AngularJS Material's `$mdMedia` breakpoints. */
const GT_SM = '(min-width: 960px)';
const GT_MD = '(min-width: 1280px)';

/**
 * Ported from the AngularJS directive `tbTimewindow` (src/app/components/timewindow.directive.js) with its
 * templates timewindow.tpl.html (inline: the edit icon on the `direction` side of the display value) and
 * timewindow-button.tpl.html (`[asButton]="true"`). `[(ngModel)]` is the timewindow; the edit opens the
 * timewindow panel. Attributes read as in the legacy link: `history-only`, `aggregation`, `is-toolbar`,
 * `direction`, `tooltip-direction`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-timewindow',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  template: `
    @if (asButton()) {
      <button mat-raised-button color="primary" type="button" [disabled]="timewindowDisabled" (click)="openEditMode($event)">
        <mat-icon>query_builder</mat-icon>
        <span>{{ model?.displayValue }}</span>
      </button>
    } @else {
      <section class="tb-timewindow" layout="row" layout-align="start center">
        @if (direction === 'left') {
          <button mat-icon-button type="button" class="tb-md-32" [disabled]="timewindowDisabled" (click)="openEditMode($event)"
                  [attr.aria-label]="'timewindow.edit' | translate"
                  [matTooltip]="'timewindow.edit' | translate" [matTooltipPosition]="tooltipPosition">
            <mat-icon [attr.aria-label]="'timewindow.date-range' | translate">query_builder</mat-icon>
          </button>
        }
        <span [hidden]="hideLabel()" (click)="openEditMode($event)"
              [matTooltip]="'timewindow.edit' | translate" [matTooltipPosition]="tooltipPosition">
          {{ model?.displayValue }}
        </span>
        @if (direction === 'right') {
          <button mat-icon-button type="button" class="tb-md-32" [disabled]="timewindowDisabled" (click)="openEditMode($event)"
                  [attr.aria-label]="'timewindow.edit' | translate"
                  [matTooltip]="'timewindow.edit' | translate" [matTooltipPosition]="tooltipPosition">
            <mat-icon [attr.aria-label]="'timewindow.date-range' | translate">query_builder</mat-icon>
          </button>
        }
      </section>
    }
  `,
  providers: [DatePipe, MilliSecondsToTimeStringPipe, ...ngModelProviders(TbTimewindowDirective)],
})
export class TbTimewindowDirective extends NgModelController {
  readonly asButton = model<any>(undefined, { alias: 'asButton' });
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  /** Whether the timewindow is edited in the dashboard's edit mode: a flag, or the legacy `&?` callback returning one. */
  readonly isEdit = input<(() => boolean) | boolean | string | undefined>(undefined);

  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly overlay = inject(Overlay);
  protected readonly injector = inject(Injector);
  protected readonly translate = inject(TranslateService);
  protected readonly timeService = inject(TimeService);
  protected readonly element = inject(ElementRef);
  protected readonly datePipe = inject(DatePipe);
  private readonly milliSecondsToTimeStringPipe = inject(MilliSecondsToTimeStringPipe);

  model: any;
  timewindowDisabled: any;

  constructor() {
    super();
    const subscription = merge(this.translate.onLangChange, this.translate.onTranslationChange, this.translate.onFallbackLangChange)
      .subscribe(() => {
        if (this.model) {
          this.updateDisplayValue();
        }
      });
    inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
    /** `scope.$watchGroup(['disabled', 'isEdit'], …)`. */
    effect(() => {
      this.disabled();
      this.isEdit();
      untracked(() => {
        if (this.model) {
          this.timewindowDisabled = this.isTimewindowDisabled();
        }
      });
    });
  }

  get historyOnly(): boolean {
    return this.attrs.historyOnly !== undefined;
  }

  /** `scope.$eval(attrs.aggregation)`: the attribute's boolean. */
  get aggregation(): boolean {
    return this.attrs.aggregation === 'true';
  }

  get isToolbar(): boolean {
    return this.attrs.isToolbar !== undefined;
  }

  get direction(): string {
    return this.attrs.direction !== undefined ? this.attrs.direction : 'left';
  }

  get tooltipPosition(): TooltipPosition {
    const direction = this.attrs.tooltipDirection !== undefined ? this.attrs.tooltipDirection : 'top';
    return direction === 'bottom' ? 'below' : direction === 'top' ? 'above' : direction;
  }

  /** The legacy `attrs.isEdit === 'true'`, over the bound value when there is one. */
  isEditFlag(): boolean {
    const value = this.isEdit();
    if (typeof value === 'function') {
      return !!value();
    }
    if (value === undefined) {
      return this.attrs.isEdit === 'true';
    }
    return value === true || value === 'true';
  }

  override $render(): void {
    this.model = this.timeService.defaultTimewindow();
    if (this.$viewValue) {
      const value: any = this.$viewValue;
      const model: any = this.model;
      if (value.realtime !== undefined) {
        model.selectedTab = 0;
        model.realtime.interval = value.realtime.interval;
        model.realtime.timewindowMs = value.realtime.timewindowMs;
      } else {
        model.selectedTab = 1;
        model.history.interval = value.history.interval;
        if (value.history.timewindowMs !== undefined) {
          model.history.historyType = 0;
          model.history.timewindowMs = value.history.timewindowMs;
        } else {
          model.history.historyType = 1;
          model.history.fixedTimewindow.startTimeMs = value.history.fixedTimewindow.startTimeMs;
          model.history.fixedTimewindow.endTimeMs = value.history.fixedTimewindow.endTimeMs;
        }
      }
      if (value.aggregation !== undefined) {
        if (value.aggregation.type !== undefined && value.aggregation.type.length > 0) {
          model.aggregation.type = value.aggregation.type;
        }
        model.aggregation.limit = value.aggregation.limit || Math.floor(this.timeService.getMaxDatapointsLimit() / 2);
      }
      model.hideInterval = value.hideInterval;
      model.hideAggregation = value.hideAggregation;
      model.hideAggInterval = value.hideAggInterval;
    }
    this.timewindowDisabled = this.isTimewindowDisabled();
    this.updateDisplayValue();
  }

  hideLabel(): boolean {
    return this.isToolbar && !this.breakpoints.isMatched(GT_MD);
  }

  openEditMode(_event?: any): void {
    if (this.timewindowDisabled) {
      return;
    }
    const host: HTMLElement = this.element.nativeElement;
    const isGtSm = this.breakpoints.isMatched(GT_SM);
    openMdPanel(this.overlay, this.injector, {
      origin: host,
      component: TimewindowPanelComponent,
      panelClass: 'tb-timewindow-panel',
      ...mdPanelPlacement(host, 417, 375),
      fullscreen: !isGtSm,
      locals: {
        timewindow: structuredClone(this.model),
        historyOnly: this.historyOnly,
        aggregation: this.aggregation,
        isEdit: this.isEditFlag(),
        onTimewindowUpdate: (timewindow: any) => {
          this.model = timewindow;
          this.updateView();
        },
      },
    });
  }

  updateView(): void {
    const value: any = {};
    const model: any = this.model;
    if (model.selectedTab === 0) {
      value.realtime = {
        interval: model.realtime.interval,
        timewindowMs: model.realtime.timewindowMs,
      };
    } else if (model.history.historyType === 0) {
      value.history = {
        interval: model.history.interval,
        timewindowMs: model.history.timewindowMs,
      };
    } else {
      value.history = {
        interval: model.history.interval,
        fixedTimewindow: {
          startTimeMs: model.history.fixedTimewindow.startTimeMs,
          endTimeMs: model.history.fixedTimewindow.endTimeMs,
        },
      };
    }
    value.aggregation = {
      type: model.aggregation.type,
      limit: model.aggregation.limit,
    };
    value.hideInterval = model.hideInterval;
    value.hideAggregation = model.hideAggregation;
    value.hideAggInterval = model.hideAggInterval;
    this.$setViewValue(value);
    this.updateDisplayValue();
  }

  updateDisplayValue(): void {
    if (this.model.selectedTab === 0 && !this.historyOnly) {
      this.model.displayValue = this.translate.instant('timewindow.realtime') + ' - ' +
        this.translate.instant('timewindow.last-prefix') + ' ' +
        this.milliSecondsToTimeString(this.model.realtime.timewindowMs);
    } else {
      this.model.displayValue = !this.historyOnly ? (this.translate.instant('timewindow.history') + ' - ') : '';
      if (this.model.history.historyType === 0) {
        this.model.displayValue += this.translate.instant('timewindow.last-prefix') + ' ' +
          this.milliSecondsToTimeString(this.model.history.timewindowMs);
      } else {
        const startString: any = this.datePipe.transform(this.model.history.fixedTimewindow.startTimeMs, 'yyyy-MM-dd HH:mm:ss');
        const endString: any = this.datePipe.transform(this.model.history.fixedTimewindow.endTimeMs, 'yyyy-MM-dd HH:mm:ss');
        this.model.displayValue += this.translate.instant('timewindow.period', { startTime: startString, endTime: endString });
      }
    }
  }

  /** The legacy `$filter('milliSecondsToTimeString')`. */
  protected milliSecondsToTimeString(milliSeconds: number): string {
    return this.milliSecondsToTimeStringPipe.transform(milliSeconds);
  }

  isTimewindowDisabled(): boolean {
    return !!(this.disabled() || (!this.isEditFlag() && this.model.hideInterval && this.model.hideAggregation && this.model.hideAggInterval));
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
