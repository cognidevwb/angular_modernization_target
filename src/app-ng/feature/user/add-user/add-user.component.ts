import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { AddItemComponent } from '../../components/add-item/add-item.component';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { TbUserDirective } from '../tb-user/tb-user.directive';
import { ActivationLinkDialogComponent } from '../activation-link-dialog/activation-link-dialog.component';

/**
 * Ported from the AngularJS controller `AddUserController` (module `thingsboard.user`) in src/app/user/add-user.controller.js
 * with its template src/app/user/add-user.tpl.html. Opened by tb-grid; the users page is `data.parentCtl`
 * (its `usersType`, `tenantId`, `customerId`). Closes with the saved user.
 */
@Component({
  selector: 'add-user',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatToolbarModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatFormFieldModule, MatSelectModule, TranslatePipe, TbGridHelpButtonComponent, TbUserDirective],
  template: `
    <form #theForm="ngForm" (ngSubmit)="add($event)" style="width: 600px;" [attr.aria-label]="'user.add' | translate">
      <mat-toolbar>
        <div class="md-toolbar-tools">
          <h2>{{ 'user.add' | translate }}</h2>
          <span flex></span>
          <tb-grid-help helpId="users"></tb-grid-help>
          <button mat-icon-button type="button" (click)="cancel()">
            <mat-icon [attr.aria-label]="'dialog.close' | translate">close</mat-icon>
          </button>
        </div>
      </mat-toolbar>
      <mat-progress-bar color="warn" mode="indeterminate" [style.visibility]="rootScope.loading ? 'visible' : 'hidden'"></mat-progress-bar>
      <mat-dialog-content>
        <div class="md-dialog-content">
          <tb-user [user]="item" [isEdit]="true" [theForm]="theFormCtl()"></tb-user>
          <mat-form-field class="md-block">
            <mat-label>{{ 'user.activation-method' | translate }}</mat-label>
            <mat-select name="userActivationMethod" [attr.aria-label]="'user.activation-method' | translate" [(ngModel)]="userActivationMethod">
              @for (activationMethod of activationMethods; track activationMethod.value) {
                <mat-option [value]="activationMethod.value">{{ activationMethod.name | translate }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
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
export class AddUserComponent extends AddItemComponent {
  protected readonly dialog = inject(MatDialog);
  protected readonly userService = inject(UserService);

  activationMethods = [
    { value: 'displayActivationLink', name: 'user.display-activation-link' },
    { value: 'sendActivationMail', name: 'user.send-activation-mail' },
  ];
  userActivationMethod = 'displayActivationLink';

  override add($event?: any): void {
    const parent = this.data.parentCtl ?? {};
    const sendActivationMail = this.userActivationMethod == 'sendActivationMail';
    if (parent.usersType === 'tenant') {
      this.item.authority = 'TENANT_ADMIN';
      this.item.tenantId = { entityType: types.entityType.tenant, id: parent.tenantId };
    } else if (parent.usersType === 'customer') {
      this.item.authority = 'CUSTOMER_USER';
      this.item.customerId = { entityType: types.entityType.customer, id: parent.customerId };
    }
    this.userService.saveUser(this.item, sendActivationMail).then((item?: any) => {
      this.item = item;
      this.ngForm()?.form.markAsPristine();
      if (this.userActivationMethod == 'displayActivationLink') {
        this.userService.getActivationLink(this.item.id.id).then((activationLink?: any) => {
          this.displayActivationLink($event, activationLink).then(() => this.dialogRef.close(item));
        });
      } else {
        this.dialogRef.close(item);
      }
    });
  }

  /** Shows the activation link over this dialog; resolves when it is closed with OK. */
  displayActivationLink(_$event: any, activationLink: any): Promise<void> {
    const ref = this.dialog.open(ActivationLinkDialogComponent, { data: { activationLink } });
    return firstValueFrom(ref.afterClosed()).then((ok) => (ok ? undefined : new Promise<void>(() => undefined)));
  }
}
