import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UtilsService } from '../../common/services/utils.service';
import { RootState } from '../../../root-state';

/**
 * Ported from the AngularJS controller `MaterialIconsDialogController` (module `thingsboard.directives.jsonForm`) in src/app/components/json-form.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'material-icons-dialog',
  standalone: true,
  template: '', // TODO(port): this controller's screen template is the templateUrl of its route in the legacy router
})
export class MaterialIconsDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<MaterialIconsDialogComponent>);
  protected readonly utils = inject(UtilsService);
  protected readonly rootScope = inject(RootState);
  private readonly data = inject<{ icon: any }>(MAT_DIALOG_DATA);

  selectedIcon: any = this.data.icon;
  loadingIcons: any = false;
  icons: any;

  private _showAll: any = false;
  get showAll(): any {
    return this._showAll;
  }
  set showAll(showAll: any) {
    this._showAll = showAll;
    if (showAll) {
        this.loadingIcons = true;
        setTimeout(() => {
            this.utils.getMaterialIcons().then(
                (icons?: any) => {
                    this.icons = icons;
                }
            );
        });
    } else {
        this.icons = this.utils.getCommonMaterialIcons();
    }
  }

  constructor() {
    this.showAll = false;
    this.rootScope.$on('iconsLoadFinished', () => {
        this.loadingIcons = false;
    });
  }

  cancel = (...rest: any[]): any => {
    this.dialogRef.close();
  };

  selectIcon = ($event?: any, icon?: any, ...rest: any[]): any => {
    this.selectedIcon = icon;
    this.dialogRef.close(this.selectedIcon);
  };
}
