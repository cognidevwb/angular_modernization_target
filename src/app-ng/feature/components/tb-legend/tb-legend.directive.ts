import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';

import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbLegend` (module `thingsboard.directives.legend`) in src/app/components/legend.directive.js:25.
 * With its template src/app/components/legend.tpl.html.
 */
@Component({
  selector: 'tb-legend',
  standalone: true,
  imports: [TranslatePipe, CommonModule],
  templateUrl: './tb-legend.directive.html',
})
export class TbLegendDirective {
  readonly legendConfig = model<any>();
  readonly legendData = model<any>();

  protected readonly element = inject(ElementRef);

  /** Read from the inputs (the legacy link read them once the scope was bound). */
  get isHorizontal(): boolean {
    const legendConfig = this.legendConfig();
    return !!legendConfig && (legendConfig.position === types.position.bottom.value ||
      legendConfig.position === types.position.top.value);
  }

  get isRowDirection(): boolean {
    return this.legendConfig()?.direction === types.direction.row.value;
  }

  displayHeader(): boolean {
    const legendConfig = this.legendConfig();
    return !!legendConfig && (legendConfig.showMin === true ||
           legendConfig.showMax === true ||
           legendConfig.showAvg === true ||
           legendConfig.showTotal === true);
  }

  toggleHideData(index?: any, ...rest: any[]): any {
    if (!this.legendData().keys[index].dataKey.settings.disableDataHiding) {
        this.legendData().keys[index].dataKey.hidden = !this.legendData().keys[index].dataKey.hidden;
    }
  }
}
