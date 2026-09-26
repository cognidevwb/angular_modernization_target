import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';

import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbLegend` (module `thingsboard.directives.legend`) in src/app/components/legend.directive.js:25.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
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

  isHorizontal: any;
  isRowDirection: any;

  constructor() {
    this.isHorizontal = this.legendConfig().position === types.position.bottom.value ||
            this.legendConfig().position === types.position.top.value;
    this.isRowDirection = this.legendConfig().direction === types.direction.row.value;
  }

  displayHeader(...rest: any[]): any {
    return this.legendConfig().showMin === true ||
           this.legendConfig().showMax === true ||
           this.legendConfig().showAvg === true ||
           this.legendConfig().showTotal === true;
  }

  toggleHideData(index?: any, ...rest: any[]): any {
    if (!this.legendData().keys[index].dataKey.settings.disableDataHiding) {
        this.legendData().keys[index].dataKey.hidden = !this.legendData().keys[index].dataKey.hidden;
    }
  }
}
