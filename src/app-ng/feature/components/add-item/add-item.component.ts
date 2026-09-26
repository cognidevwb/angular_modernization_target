import { Directive, computed, inject, viewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { helpLinks } from '../../help/constants/help-links';
import { RootState } from '../../../root-state';
import { legacyForm, LegacyForm } from '../tb-grid/legacy-form';

/** What the grid hands an add dialog (the legacy `locals`). */
export interface AddItemDialogData {
  saveItemFunction: (item: any) => Promise<any>;
  /** The page that configured the grid (its `parentCtl`). */
  parentCtl?: any;
}

/**
 * Ported from the AngularJS controller `AddItemController` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * The base of every page's add dialog (add-device, add-asset, …): the template is the page's,
 * with `<form #theForm="ngForm" (ngSubmit)="add()">`; the dialog closes with the saved item.
 */
@Directive()
export abstract class AddItemComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly dialogRef = inject(MatDialogRef);
  protected readonly data: AddItemDialogData = inject(MAT_DIALOG_DATA);
  protected readonly helpLinks: any = helpLinks;

  /** The `<form #theForm="ngForm">` of the dialog template. */
  protected readonly ngForm = viewChild<NgForm>('theForm');
  /** The same form as the entity details components read it (`theForm.$invalid`, …). */
  protected readonly theFormCtl = computed<LegacyForm | undefined>(() => {
    const form = this.ngForm();
    return form ? legacyForm(form) : undefined;
  });

  item: any = {};

  cancel(): void {
    this.dialogRef.close();
  }

  add(): void {
    this.data.saveItemFunction(this.item).then(
      (item?: any) => {
        this.item = item;
        this.ngForm()?.form.markAsPristine();
        this.dialogRef.close(item);
      },
      () => undefined,
    );
  }
}
