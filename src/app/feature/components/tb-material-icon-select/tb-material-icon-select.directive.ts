import { Component, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';
import { MaterialIconsDialogComponent } from '../material-icons-dialog/material-icons-dialog.component';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbMaterialIconSelect` (module `thingsboard.directives.materialIconSelect`) in src/app/components/material-icon-select.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-material-icon-select',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  providers: ngModelProviders(TbMaterialIconSelectDirective),
  template: `
    <div class="tb-material-icon-select">
      <mat-icon>{{ icon }}</mat-icon>
      <button mat-icon-button type="button" (click)="openIconDialog($event)">
        <mat-icon>edit</mat-icon>
      </button>
    </div>
  `,
})
export class TbMaterialIconSelectDirective extends NgModelController {
  readonly tbRequired = model<any>();

  protected readonly dialog = inject(MatDialog);

  icon: any = null;

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
  }

  override $render(): void {
    if (this.$viewValue) {
      this.icon = this.$viewValue;
    }
    if (!this.icon || !this.icon.length) {
      this.icon = 'more_horiz';
    }
    this.updateView();
  }

  updateView(...rest: any[]): any {
    this.$setViewValue(this.icon);
  }

  openIconDialog($event?: any, ...rest: any[]): any {
    if ($event) {
        $event.stopPropagation();
    }
    firstValueFrom(this.dialog.open(MaterialIconsDialogComponent, {
        data: {icon: this.icon},
        panelClass: 'tb-dialog'
    }).afterClosed()).then((icon?: any) => {
        if (icon !== undefined) {
            this.icon = icon;
            this.updateView();
        }
    });
  }
}
