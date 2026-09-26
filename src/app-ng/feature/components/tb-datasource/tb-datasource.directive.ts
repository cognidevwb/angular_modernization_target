import { Component, DoCheck, forwardRef, inject, input, model } from '@angular/core';
import { isEqual } from 'lodash-es';
import { CreateEntityAliasFn, FetchEntityKeysFn, GenerateDataKeyFn } from './datasource-callbacks';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbDatasourceFuncDirective } from '../tb-datasource-func/tb-datasource-func.directive';
import { TbDatasourceEntityDirective } from '../tb-datasource-entity/tb-datasource-entity.directive';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbDatasource` (module `thingsboard.directives.datasource`) in src/app/components/datasource.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-datasource',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule, forwardRef(() => TbDatasourceFuncDirective), forwardRef(() => TbDatasourceEntityDirective)],
  templateUrl: './tb-datasource.directive.html',
  providers: ngModelProviders(TbDatasourceDirective),
})
export class TbDatasourceDirective extends NgModelController implements DoCheck {
  readonly aliasController = model<any>();
  readonly maxDataKeys = model<any>();
  readonly optDataKeys = model<any>();
  readonly widgetType = model<any>();
  readonly functionsOnly = model<any>();
  readonly datakeySettingsSchema = model<any>();
  readonly generateDataKey = input<GenerateDataKeyFn | undefined>();
  readonly fetchEntityKeys = input<FetchEntityKeysFn | undefined>();
  readonly onCreateEntityAlias = input<CreateEntityAliasFn | undefined>();

  protected readonly typesRef: any = types;
  protected readonly utils = inject(UtilsService);
  // TODO(port): template: 1 × ng-switch-when left in place

  types: any;
  datasourceTypes: any;
  model: any;
  private prevModelType: any;
  private prevModelSnapshot: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    this.types = this.typesRef;
    if (this.functionsOnly()) {
            this.datasourceTypes = [this.typesRef.datasourceType.function];
        } else{
            this.datasourceTypes = [this.typesRef.datasourceType.entity, this.typesRef.datasourceType.function];
        }
  }

  ngDoCheck(): void {
    const currentType = this.model?.type;
    if (currentType !== this.prevModelType) {
      const prevType = this.prevModelType;
      this.prevModelType = currentType;
      if (currentType && prevType && currentType !== prevType) {
        if (this.widgetType() == this.typesRef.widgetType.alarm.value) {
          this.model.dataKeys = this.utils.getDefaultAlarmDataKeys();
        } else {
          this.model.dataKeys = [];
        }
      }
    }
    if (!isEqual(this.model, this.prevModelSnapshot)) {
      this.prevModelSnapshot = structuredClone(this.model);
      this.updateView();
    }
  }

  override $render(): void {
    if (this.$viewValue) {
        this.model = this.$viewValue;
    } else {
        this.model = {};
    }
  }

  updateView(...rest: any[]): any {
    if (!this.model.dataKeys) {
        this.model.dataKeys = [];
    }
    this.$setViewValue(this.model);
  }
}
