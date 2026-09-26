import { Component, inject } from '@angular/core';
import { AlarmService } from '../../api/services/alarm.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import beautify from 'js-beautify';
import { UiAceDirective } from '../../components/ui-ace/ui-ace.directive';

// Helpers at the legacy file's top level, beside the registration (as written).
const js_beautify: any = (beautify as any).js;

/**
 * Ported from the AngularJS controller `AlarmDetailsDialogController` (module `thingsboard.alarm`) in src/app/alarm/index.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'alarm-details-dialog',
  standalone: true,
  imports: [UiAceDirective, TranslatePipe, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './alarm-details-dialog.component.html',
  providers: [DatePipe],
})
export class AlarmDetailsDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly alarmService = inject(AlarmService);
  protected readonly datePipe = inject(DatePipe);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  alarmId: any;
  allowAcknowledgment: any;
  allowClear: any;
  displayDetails: any;
  types: any;
  alarm: any = null;
  alarmUpdated: any = false;
  alarmDetailsOptions: any;
  ackTime: any;
  alarmDetails: any;
  alarmSeverity: any;
  alarmStatus: any;
  clearTime: any;
  createdTime: any;
  editor: any;
  endTime: any;
  startTime: any;

  constructor() {
    this.alarmId = this.dialogData.alarmId;
    this.allowAcknowledgment = this.dialogData.allowAcknowledgment;
    this.allowClear = this.dialogData.allowClear;
    this.displayDetails = this.dialogData.displayDetails;
    this.types = this.typesRef;
    this.dialogData.showingCallback.onShowing = (_scope?: any, element?: any) => {
        if (this.displayDetails) {
            this.updateEditorSize(element);
        }
    }
    this.alarmDetailsOptions = {
        useWrapMode: false,
        mode: 'json',
        showGutter: false,
        showPrintMargin: false,
        theme: 'github',
        advanced: {
            enableSnippets: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.editor = _ace;
        }
    };
    this.close = this.close;
    this.acknowledge = this.acknowledge;
    this.clear = this.clear;
    this.loadAlarm();
  }

  updateEditorSize(element?: any, ...rest: any[]): any {
    var newWidth: any = 600;
    var newHeight: any = 200;
    $('#tb-alarm-details', element).height(newHeight.toString() + "px")
        .width(newWidth.toString() + "px");
    this.editor.resize();
  }

  loadAlarm(...rest: any[]): any {
    this.alarmService.getAlarmInfo(this.alarmId).then(
        (alarm?: any) => {
            this.alarm = alarm;
            this.loadAlarmFields();
        },
        () => {
            this.alarm = null;
        }
    );
  }

  loadAlarmFields(...rest: any[]): any {
    this.createdTime = this.datePipe.transform(this.alarm.createdTime, 'yyyy-MM-dd HH:mm:ss');
    this.startTime = null;
    if (this.alarm.startTs) {
        this.startTime = this.datePipe.transform(this.alarm.startTs, 'yyyy-MM-dd HH:mm:ss');
    }
    this.endTime = null;
    if (this.alarm.endTs) {
        this.endTime = this.datePipe.transform(this.alarm.endTs, 'yyyy-MM-dd HH:mm:ss');
    }
    this.ackTime = null;
    if (this.alarm.ackTs) {
        this.ackTime = this.datePipe.transform(this.alarm.ackTs, 'yyyy-MM-dd HH:mm:ss')
    }
    this.clearTime = null;
    if (this.alarm.clearTs) {
        this.clearTime = this.datePipe.transform(this.alarm.clearTs, 'yyyy-MM-dd HH:mm:ss');
    }

    this.alarmSeverity = this.translate.instant(this.typesRef.alarmSeverity[this.alarm.severity].name);

    this.alarmStatus = this.translate.instant('alarm.display-status.' + this.alarm.status);

    this.alarmDetails = null;
    if (this.alarm.details) {
        this.alarmDetails = JSON.stringify(this.alarm.details);
        this.alarmDetails = js_beautify(this.alarmDetails, {indent_size: 4});
    }
  }

  acknowledge = (...rest: any[]): any => {
    this.alarmService.ackAlarm(this.alarmId).then(
        () => {
            this.alarmUpdated = true;
            this.loadAlarm();
        }
    );
  };

  clear = (...rest: any[]): any => {
    this.alarmService.clearAlarm(this.alarmId).then(
        () => {
            this.alarmUpdated = true;
            this.loadAlarm();
        }
    );
  };

  close = (...rest: any[]): any => {
(this.dialog as any).hide(this.alarmUpdated ? this.alarm : null);
  };
}
