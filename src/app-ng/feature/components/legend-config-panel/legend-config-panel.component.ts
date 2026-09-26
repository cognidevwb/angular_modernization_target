import { Component, DoCheck, inject } from '@angular/core';
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
import { isEqual } from 'lodash-es';

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
export class LegendConfigPanelComponent implements DoCheck {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  _mdPanelRef: any;
  legendConfig: any;
  onLegendConfigUpdate: any;
  positions: any = types.position;
  directions: any = types.direction;
  isRowDirection: any;
  theForm: any;
  private lastLegendConfig: any;

  protected update(): void {
    this._mdPanelRef?.close();
  }

  ngDoCheck(): void {
    if (!isEqual(this.legendConfig, this.lastLegendConfig)) {
      this.lastLegendConfig = structuredClone(this.legendConfig);
      if (this.dialogData.onLegendConfigUpdate) {
        this.dialogData.onLegendConfigUpdate(this.legendConfig);
      }
    }
  }

  constructor() {
    let vm = this;
    this._mdPanelRef = this.dialogData.mdPanelRef;
    this.legendConfig = this.dialogData.legendConfig;
    this.onLegendConfigUpdate = this.dialogData.onLegendConfigUpdate;
    this.isRowDirection = this.legendConfig.direction === types.direction.row.value;
    this._mdPanelRef.config.onOpenComplete = function () {
        this.theForm.$setPristine();
    };
    this.lastLegendConfig = structuredClone(this.legendConfig);
  }
}
