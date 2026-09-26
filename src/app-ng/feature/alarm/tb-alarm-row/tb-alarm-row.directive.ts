import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
const alarmDetailsDialogTemplate = '../../../../app/alarm/alarm-details-dialog.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbAlarmRow` (module `thingsboard.alarm`) in src/app/alarm/index.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: '[tb-alarm-row]',
  standalone: true,
  templateUrl: './tb-alarm-row.directive.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
})
export class TbAlarmRowDirective {
  protected readonly typesRef: any = types;
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);
  protected readonly element = inject(ElementRef);

  alarm: any;
  types: any;

  constructor() {
    this.alarm = this.attrs.alarm;
    this.types = this.typesRef;
  }

  showAlarmDetails($event?: any, ...rest: any[]): any {
    let vm = this;
    var onShowingCallback: any = {
        onShowing: function(...rest: any[]){}
    };
(this.dialog as any).show({
    controller: 'AlarmDetailsDialogController',
    controllerAs: 'vm',
    templateUrl: alarmDetailsDialogTemplate,
    locals: {
        alarmId: this.alarm.id.id,
        allowAcknowledgment: true,
        allowClear: true,
        displayDetails: true,
        showingCallback: onShowingCallback
    },
    parent: $(this.document.body),
    targetEvent: $event,
    fullscreen: true,
    multiple: true,
    onShowing: (dialogScope?: any, dialogElement?: any, ...rest: any[]) => {
        onShowingCallback.onShowing(dialogScope, dialogElement);
    }
}).then((alarm?: any) => {
    if (alarm) {
        this.alarm = alarm;
    }
});
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
