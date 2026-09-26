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
import { TbDashboardDetailsDirective } from '../tb-dashboard-details/tb-dashboard-details.directive';

/** The add dialog of the dashboard grid (legacy src/app/dashboard/add-dashboard.tpl.html with AddItemController). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-dashboard-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, TbGridHelpButtonComponent, TbDashboardDetailsDirective],
  template: `
    <form #theForm="ngForm" (ngSubmit)="add()" [attr.aria-label]="'dashboard.add' | translate">
      <mat-toolbar>
        <div class="md-toolbar-tools">
          <h2>{{ 'dashboard.add' | translate }}</h2>
          <span flex></span>
          <tb-grid-help helpId="dashboards"></tb-grid-help>
          <button mat-icon-button type="button" (click)="cancel()">
            <mat-icon [attr.aria-label]="'dialog.close' | translate">close</mat-icon>
          </button>
        </div>
      </mat-toolbar>
      <mat-progress-bar color="warn" mode="indeterminate" [style.visibility]="rootScope.loading ? 'visible' : 'hidden'"></mat-progress-bar>
      <mat-dialog-content>
        <div class="md-dialog-content">
          <tb-dashboard-details [dashboard]="item" [isEdit]="true" [theForm]="theFormCtl()"></tb-dashboard-details>
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
export class AddDashboardDialogComponent extends AddItemComponent {}
