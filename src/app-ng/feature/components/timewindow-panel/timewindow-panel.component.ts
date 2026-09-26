import { Component, DoCheck, forwardRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TimeService } from '../../api/services/time.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbTimeintervalDirective } from '../tb-timeinterval/tb-timeinterval.directive';
import { TbDatetimePeriodDirective } from '../tb-datetime-period/tb-datetime-period.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS controller `TimewindowPanelController` (module `thingsboard.directives.timewindow`) in src/app/components/timewindow.directive.js:32.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'timewindow-panel',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, MatSliderModule, MatSelectModule, MatRadioModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbTimeintervalDirective), forwardRef(() => TbDatetimePeriodDirective)],
  templateUrl: './timewindow-panel.component.html',
})
export class TimewindowPanelComponent implements DoCheck {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly timeService = inject(TimeService);
  // TODO(port): elements not resolved to a component: md-slider-container

  _mdPanelRef: any;
  timewindow: any;
  historyOnly: any;
  aggregation: any;
  onTimewindowUpdate: any;
  aggregationTypes: any = types.aggregation;
  isEdit: any;
  theForm: any;
  private _prevSelectedTab: any;

  constructor() {
    let vm = this;
    this._mdPanelRef = this.dialogData.mdPanelRef;
    this.timewindow = this.dialogData.timewindow;
    this.historyOnly = this.dialogData.historyOnly;
    this.aggregation = this.dialogData.aggregation;
    this.onTimewindowUpdate = this.dialogData.onTimewindowUpdate;
    this.showLimit = this.showLimit;
    this.showRealtimeAggInterval = this.showRealtimeAggInterval;
    this.showHistoryAggInterval = this.showHistoryAggInterval;
    this.minRealtimeAggInterval = this.minRealtimeAggInterval;
    this.maxRealtimeAggInterval = this.maxRealtimeAggInterval;
    this.minHistoryAggInterval = this.minHistoryAggInterval;
    this.maxHistoryAggInterval = this.maxHistoryAggInterval;
    this.minDatapointsLimit = this.minDatapointsLimit;
    this.maxDatapointsLimit = this.maxDatapointsLimit;
    this.isEdit = this.dialogData.isEdit;
    if (this.historyOnly) {
        this.timewindow.selectedTab = 1;
    }
    this._mdPanelRef.config.onOpenComplete = function () {
        this.theForm.$setPristine();
    }
    this._prevSelectedTab = this.timewindow?.selectedTab;
  }

  ngDoCheck(): void {
    const newSelection = this.timewindow?.selectedTab;
    if (newSelection !== this._prevSelectedTab) {
        this.theForm?.$setDirty();
        this._prevSelectedTab = newSelection;
    }
  }

  cancel(...rest: any[]): any {
    this._mdPanelRef && this._mdPanelRef.close();
  }

  update(...rest: any[]): any {
    this._mdPanelRef && this._mdPanelRef.close().then(() => {
        this.onTimewindowUpdate && this.onTimewindowUpdate(this.timewindow);
    });
  }

  showLimit = (...rest: any[]): any => {
    return this.timewindow.aggregation.type === this.aggregationTypes.none.value;
  };

  showRealtimeAggInterval = (...rest: any[]): any => {
    return this.timewindow.aggregation.type !== this.aggregationTypes.none.value &&
           this.timewindow.selectedTab === 0;
  };

  showHistoryAggInterval = (...rest: any[]): any => {
    return this.timewindow.aggregation.type !== this.aggregationTypes.none.value &&
        this.timewindow.selectedTab === 1;
  };

  minRealtimeAggInterval = (...rest: any[]): any => {
    return this.timeService.minIntervalLimit(this.timewindow.realtime.timewindowMs);
  };

  maxRealtimeAggInterval = (...rest: any[]): any => {
    return this.timeService.maxIntervalLimit(this.timewindow.realtime.timewindowMs);
  };

  minHistoryAggInterval = (...rest: any[]): any => {
    return this.timeService.minIntervalLimit(this.currentHistoryTimewindow());
  };

  maxHistoryAggInterval = (...rest: any[]): any => {
    return this.timeService.maxIntervalLimit(this.currentHistoryTimewindow());
  };

  minDatapointsLimit = (...rest: any[]): any => {
    return this.timeService.getMinDatapointsLimit();
  };

  maxDatapointsLimit = (...rest: any[]): any => {
    return this.timeService.getMaxDatapointsLimit();
  };

  currentHistoryTimewindow(...rest: any[]): any {
    if (this.timewindow.history.historyType === 0) {
        return this.timewindow.history.timewindowMs;
    } else {
        return this.timewindow.history.fixedTimewindow.endTimeMs -
            this.timewindow.history.fixedTimewindow.startTimeMs;
    }
    return undefined;
  }
}
