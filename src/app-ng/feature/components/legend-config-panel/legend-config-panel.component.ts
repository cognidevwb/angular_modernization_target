import { NgForm } from '@angular/forms';
import { attachLegacyForm, lateLegacyForm, LegacyForm } from '../tb-grid/legacy-form';
import { Component, inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { KeyValuePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { MD_PANEL_DATA } from '../md-panel/md-panel';

/**
 * Ported from the AngularJS controller `LegendConfigPanelController` (src/app/components/legend-config-panel.controller.js)
 * with its template legend-config-panel.tpl.html. Opened by tb-legend-config as an `$mdPanel`;
 * every edit is reported through `onLegendConfigUpdate` (the legacy deep `$watch('vm.legendConfig')`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'legend-config-panel',
  standalone: true,
  imports: [KeyValuePipe, FormsModule, MatCheckboxModule, MatFormFieldModule, MatSelectModule, TranslatePipe],
  templateUrl: './legend-config-panel.component.html',
})
export class LegendConfigPanelComponent {
  /** The legacy `theForm` (FormController), over the template's `#theFormRef` NgForm. */
  readonly theForm: LegacyForm = lateLegacyForm('theForm');

  @ViewChild('theFormRef')
  set theFormRef(form: NgForm | undefined) {
    attachLegacyForm(this.theForm, form);
  }

  protected readonly rootScope = inject(RootState);
  private readonly data: any = inject(MD_PANEL_DATA);

  legendConfig: any = this.data.legendConfig;
  readonly positions: any = types.position;
  readonly directions: any = types.direction;
  readonly isRowDirection: boolean = this.legendConfig.direction === types.direction.row.value;

  /** The object's own key order, as `ng-repeat` over an object listed it. */
  readonly keepOrder = (): number => 0;

  configChanged(): void {
    if (this.data.onLegendConfigUpdate) {
      this.data.onLegendConfigUpdate(this.legendConfig);
    }
  }

  update(): void {
    this.data.mdPanelRef.close();
  }
}
