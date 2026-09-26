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
import { TbAssetDirective } from '../tb-asset/tb-asset.directive';

/** The add-asset dialog (legacy src/app/asset/add-asset.tpl.html with AddItemController). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-asset-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, TbGridHelpButtonComponent, TbAssetDirective],
  template: `
    <form #theForm="ngForm" (ngSubmit)="add()" [attr.aria-label]="'asset.add' | translate">
      <mat-toolbar>
        <div class="md-toolbar-tools">
          <h2>{{ 'asset.add' | translate }}</h2>
          <span flex></span>
          <tb-grid-help helpId="assets"></tb-grid-help>
          <button mat-icon-button type="button" (click)="cancel()">
            <mat-icon [attr.aria-label]="'dialog.close' | translate">close</mat-icon>
          </button>
        </div>
      </mat-toolbar>
      <mat-progress-bar color="warn" mode="indeterminate" [style.visibility]="rootScope.loading ? 'visible' : 'hidden'"></mat-progress-bar>
      <mat-dialog-content>
        <div class="md-dialog-content">
          <tb-asset [asset]="item" [isEdit]="true" [theForm]="theFormCtl()"></tb-asset>
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
export class AddAssetDialogComponent extends AddItemComponent {}
