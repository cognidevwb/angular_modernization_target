import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS controller `LegendConfigPanelController` (module `thingsboard.directives.legendConfig`) in src/app/components/legend-config.directive.js:30.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'legend-config-panel',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, FormsModule],
  templateUrl: './legend-config-panel.component.html',
})
export class LegendConfigPanelComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): '$scope' — component state: fields and signals on this class

  _mdPanelRef: any;
  legendConfig: any;
  onLegendConfigUpdate: any;
  positions: any = types.position;
  directions: any = types.direction;
  isRowDirection: any;
  theForm: any;

  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
    this._mdPanelRef = this.dialogData.mdPanelRef;
    this.legendConfig = this.dialogData.legendConfig;
    this.onLegendConfigUpdate = this.dialogData.onLegendConfigUpdate;
    this.isRowDirection = this.legendConfig.direction === types.direction.row.value;
    this._mdPanelRef.config.onOpenComplete = function () {
        this.theForm.$setPristine();
    };
    $scope.$watch('vm.legendConfig', () => {
        if (this.dialogData.onLegendConfigUpdate) {
            this.dialogData.onLegendConfigUpdate(this.legendConfig);
        }
    }, true);
  }
}
