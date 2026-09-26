import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../common/services/utils.service';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;
declare let icon: any;

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
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  protected readonly utils = inject(UtilsService);
  // TODO(port): 'icon' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration

  selectedIcon: any = icon;
  showAll: any = false;
  loadingIcons: any = false;
  icons: any;

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
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
    (this.dialog as any).cancel();
  };

  selectIcon = ($event?: any, icon?: any, ...rest: any[]): any => {
    this.selectedIcon = icon;
    (this.dialog as any).hide(this.selectedIcon);
  };
}
