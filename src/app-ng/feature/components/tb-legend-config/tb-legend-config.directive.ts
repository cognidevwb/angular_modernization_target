import { Component, ElementRef, inject, Injector, model, ChangeDetectionStrategy } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { LegendConfigPanelComponent } from '../legend-config-panel/legend-config-panel.component';
import { mdPanelPlacement, openMdPanel } from '../md-panel/md-panel';

/**
 * Ported from the AngularJS directive `tbLegendConfig` (src/app/components/legend-config.directive.js)
 * with its button template legend-config-button.tpl.html. `[(ngModel)]` is the legend config
 * `{ direction, position, showMin, showMax, showAvg, showTotal }`; the button opens the legend config panel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-legend-config',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <button mat-raised-button color="primary" type="button" [disabled]="disabled()" (click)="openEditMode($event)">
      <mat-icon>toc</mat-icon>
      <span>{{ 'legend.settings' | translate }}</span>
    </button>
  `,
  providers: ngModelProviders(TbLegendConfigDirective),
})
export class TbLegendConfigDirective extends NgModelController {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });

  protected readonly overlay = inject(Overlay);
  protected readonly injector = inject(Injector);
  protected readonly element = inject(ElementRef);

  model: any;

  override $render(): void {
    if (this.$viewValue) {
      const value: any = this.$viewValue;
      if (!this.model) {
        this.model = {};
      }
      const model: any = this.model;
      model.direction = value.direction || types.direction.column.value;
      model.position = value.position || types.position.bottom.value;
      model.showMin = value.showMin !== undefined ? value.showMin : false;
      model.showMax = value.showMax !== undefined ? value.showMax : false;
      model.showAvg = value.showAvg !== undefined ? value.showAvg : true;
      model.showTotal = value.showTotal !== undefined ? value.showTotal : false;
    } else {
      this.model = {
        direction: types.direction.column.value,
        position: types.position.bottom.value,
        showMin: false,
        showMax: false,
        showAvg: true,
        showTotal: false,
      };
    }
  }

  openEditMode(_event?: any): void {
    if (this.disabled()) {
      return;
    }
    const host: HTMLElement = this.element.nativeElement;
    openMdPanel(this.overlay, this.injector, {
      origin: host,
      component: LegendConfigPanelComponent,
      panelClass: 'tb-legend-config-panel',
      ...mdPanelPlacement(host, 220, 220),
      locals: {
        legendConfig: structuredClone(this.model),
        onLegendConfigUpdate: (legendConfig: any) => {
          this.model = legendConfig;
          this.updateView();
        },
      },
    });
  }

  updateView(): void {
    const model: any = this.model;
    this.$setViewValue({
      direction: model.direction,
      position: model.position,
      showMin: model.showMin,
      showMax: model.showMax,
      showAvg: model.showAvg,
      showTotal: model.showTotal,
    });
  }
}
