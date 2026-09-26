import { AfterViewInit, Component, inject, viewChild } from '@angular/core';
import { KeyValuePipe, NgClass } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { TimeService } from '../../api/services/time.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { TbTimeintervalDirective } from '../tb-timeinterval/tb-timeinterval.directive';
import { TbDatetimePeriodDirective } from '../tb-datetime-period/tb-datetime-period.directive';
import { MD_PANEL_DATA } from '../md-panel/md-panel';

/**
 * Ported from the AngularJS controller `TimewindowPanelController` (src/app/components/timewindow-panel.controller.js)
 * with its template timewindow-panel.tpl.html. Opened by tb-timewindow as an `$mdPanel`; Update closes the panel
 * and hands the edited timewindow to `onTimewindowUpdate`.
 */
@Component({
  selector: 'timewindow-panel',
  standalone: true,
  imports: [
    KeyValuePipe, NgClass, FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatRadioModule,
    MatSelectModule, MatSliderModule, MatTabsModule, TranslatePipe, TbTimeintervalDirective, TbDatetimePeriodDirective,
  ],
  templateUrl: './timewindow-panel.component.html',
})
export class TimewindowPanelComponent implements AfterViewInit {
  protected readonly rootScope = inject(RootState);
  protected readonly timeService = inject(TimeService);
  private readonly data: any = inject(MD_PANEL_DATA);
  private readonly theForm = viewChild<NgForm>('theForm');

  timewindow: any = this.data.timewindow;
  readonly historyOnly: boolean = this.data.historyOnly;
  readonly aggregation: boolean = this.data.aggregation;
  readonly isEdit: boolean = this.data.isEdit;
  readonly aggregationTypes: any = types.aggregation;

  /** The object's own key order, as `ng-repeat` over an object listed it. */
  readonly keepOrder = (): number => 0;

  constructor() {
    if (this.historyOnly) {
      this.timewindow.selectedTab = 1;
    }
  }

  /** `mdPanelRef.config.onOpenComplete`: the form starts pristine once the panel has opened. */
  ngAfterViewInit(): void {
    setTimeout(() => this.theForm()?.form.markAsPristine());
  }

  /** `$scope.$watch('vm.timewindow.selectedTab')`: switching tabs is an edit. */
  onSelectedTabChange(index: number): void {
    if (index !== this.timewindow.selectedTab) {
      this.timewindow.selectedTab = index;
      this.theForm()?.form.markAsDirty();
    }
  }

  cancel(): void {
    this.data.mdPanelRef.close();
  }

  update(): void {
    this.data.mdPanelRef.close();
    if (this.data.onTimewindowUpdate) {
      this.data.onTimewindowUpdate(this.timewindow);
    }
  }

  showLimit(): boolean {
    return this.timewindow.aggregation.type === this.aggregationTypes.none.value;
  }

  showRealtimeAggInterval(): boolean {
    return this.timewindow.aggregation.type !== this.aggregationTypes.none.value && this.timewindow.selectedTab === 0;
  }

  showHistoryAggInterval(): boolean {
    return this.timewindow.aggregation.type !== this.aggregationTypes.none.value && this.timewindow.selectedTab === 1;
  }

  minRealtimeAggInterval(): any {
    return this.timeService.minIntervalLimit(this.timewindow.realtime.timewindowMs);
  }

  maxRealtimeAggInterval(): any {
    return this.timeService.maxIntervalLimit(this.timewindow.realtime.timewindowMs);
  }

  minHistoryAggInterval(): any {
    return this.timeService.minIntervalLimit(this.currentHistoryTimewindow());
  }

  maxHistoryAggInterval(): any {
    return this.timeService.maxIntervalLimit(this.currentHistoryTimewindow());
  }

  minDatapointsLimit(): any {
    return this.timeService.getMinDatapointsLimit();
  }

  maxDatapointsLimit(): any {
    return this.timeService.getMaxDatapointsLimit();
  }

  currentHistoryTimewindow(): number {
    if (this.timewindow.history.historyType === 0) {
      return this.timewindow.history.timewindowMs;
    }
    return this.timewindow.history.fixedTimewindow.endTimeMs - this.timewindow.history.fixedTimewindow.startTimeMs;
  }
}
