import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { RootState } from '../../../root-state';
import { $timeout } from '../../../core/q';
import { TbOnFinishRenderDirective } from '../tb-on-finish-render/tb-on-finish-render.directive';

/**
 * Ported from the AngularJS controller `MaterialIconsDialogController` (src/app/components/material-icons-dialog.controller.js)
 * with its template src/app/components/material-icons-dialog.tpl.html. Opened with `data: { icon }`; closes with the chosen icon.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'material-icons-dialog',
  standalone: true,
  imports: [
    NgClass, FormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatProgressSpinnerModule,
    MatSlideToggleModule, MatToolbarModule, MatTooltipModule, TranslatePipe, TbOnFinishRenderDirective,
  ],
  templateUrl: './material-icons-dialog.component.html',
})
export class MaterialIconsDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<MaterialIconsDialogComponent>);
  protected readonly utils = inject(UtilsService);
  protected readonly rootScope = inject(RootState);
  private readonly data = inject<{ icon: any }>(MAT_DIALOG_DATA, { optional: true }) ?? { icon: null };

  selectedIcon: any = this.data.icon;
  loadingIcons = false;
  icons: string[] = [];

  private _showAll = false;
  get showAll(): boolean {
    return this._showAll;
  }
  /** `$scope.$watch('vm.showAll', …)`. */
  set showAll(showAll: boolean) {
    this._showAll = showAll;
    if (showAll) {
      this.loadingIcons = true;
      $timeout(() => {
        this.utils.getMaterialIcons().then((icons?: any) => {
          this.icons = icons;
        });
      });
    } else {
      this.icons = this.utils.getCommonMaterialIcons();
    }
  }

  constructor() {
    this.showAll = false;
  }

  cancel(): void {
    this.dialogRef.close();
  }

  selectIcon(_$event?: any, icon?: any): void {
    this.selectedIcon = icon;
    this.dialogRef.close(this.selectedIcon);
  }
}
