import { Component, forwardRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../common/services/utils.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbOnFinishRenderDirective } from '../tb-on-finish-render/tb-on-finish-render.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS controller `MaterialIconsDialogController` (module `thingsboard.directives.materialIconSelect`) in src/app/components/material-icon-select.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'material-icons-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatSlideToggleModule, MatProgressSpinnerModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbOnFinishRenderDirective)],
  templateUrl: './material-icons-dialog.component-2.html',
})
export class MaterialIconsDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  protected readonly utils = inject(UtilsService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  selectedIcon: any;
  showAll: any = false;
  loadingIcons: any = false;
  icons: any;

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
    this.selectedIcon = this.dialogData.icon;
    $scope.$watch('vm.showAll', (showAll?: any) => {
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
    });
    $scope.$on('iconsLoadFinished', () => {
        this.loadingIcons = false;
    });
    this.cancel = this.cancel;
    this.selectIcon = this.selectIcon;
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  selectIcon = ($event?: any, icon?: any, ...rest: any[]): any => {
    this.selectedIcon = icon;
    this.dialog.hide(this.selectedIcon);
  };
}
