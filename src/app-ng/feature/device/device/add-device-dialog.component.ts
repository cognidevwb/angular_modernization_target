import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { AddItemComponent } from '../../components/add-item/add-item.component';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { TbDeviceDirective } from '../tb-device/tb-device.directive';

/** The add-device dialog (legacy src/app/device/add-device.tpl.html with AddItemController). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-device-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, TbGridHelpButtonComponent, TbDeviceDirective],
  template: `
    <form #theForm="ngForm" (ngSubmit)="add()" [attr.aria-label]="'device.add' | translate">
      <mat-toolbar>
        <div class="md-toolbar-tools">
          <h2>{{ 'device.add' | translate }}</h2>
          <span flex></span>
          <tb-grid-help helpId="devices"></tb-grid-help>
          <button mat-icon-button type="button" (click)="cancel()">
            <mat-icon [attr.aria-label]="'dialog.close' | translate">close</mat-icon>
          </button>
        </div>
      </mat-toolbar>
      <mat-progress-bar color="warn" mode="indeterminate" [style.visibility]="rootScope.loading ? 'visible' : 'hidden'"></mat-progress-bar>
      <mat-dialog-content>
        <div class="md-dialog-content">
          <tb-device [device]="item" [isEdit]="true" [theForm]="theFormCtl()"></tb-device>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions layout="row">
        <span flex></span>
        <button mat-raised-button color="primary" type="submit" [disabled]="rootScope.loading || theForm.invalid || !theForm.dirty">
          {{ 'action.add' | translate }}
        </button>
        <button mat-button type="button" [disabled]="rootScope.loading" (click)="cancel()" style="margin-right:20px;">{{ 'action.cancel' | translate }}</button>
      </mat-dialog-actions>
    </form>
  `,
})
export class AddDeviceDialogComponent extends AddItemComponent {}
