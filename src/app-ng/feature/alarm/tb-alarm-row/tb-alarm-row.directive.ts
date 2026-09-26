import { Component, inject, input, linkedSignal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { types } from '../../common/constants/types';
import { AlarmDetailsDialogComponent } from '../alarm-details-dialog/alarm-details-dialog.component';

/**
 * Ported from the AngularJS directive `tbAlarmRow` (module `thingsboard.alarm`) in src/app/alarm/alarm-row.directive.js:
 * one alarm table row; the details button opens the alarm details dialog and shows the alarm it returns.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-alarm-row]',
  standalone: true,
  templateUrl: './tb-alarm-row.directive.html',
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
})
export class TbAlarmRowDirective {
  /** The alarm this row shows (an object, as the legacy `scope.alarm`). */
  readonly alarmInput = input<any>(undefined, { alias: 'alarm' });

  protected readonly dialog = inject(MatDialog);
  readonly types: any = types;
  /** The row's alarm: the input, until the details dialog hands back an updated one. */
  private readonly current = linkedSignal(() => this.alarmInput());

  get alarm(): any {
    return this.current();
  }

  showAlarmDetails($event?: Event): void {
    $event?.stopPropagation();
    const onShowingCallback: any = {
      onShowing: () => undefined,
    };
    const ref = this.dialog.open(AlarmDetailsDialogComponent, {
      data: {
        alarmId: this.alarm.id.id,
        allowAcknowledgment: true,
        allowClear: true,
        displayDetails: true,
        showingCallback: onShowingCallback,
      },
      panelClass: 'tb-dialog',
    });
    firstValueFrom(ref.afterClosed()).then((alarm: any) => {
      if (alarm) {
        this.current.set(alarm);
      }
    });
  }
}
