import { Component, forwardRef, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbDatasourceFuncDirective } from '../tb-datasource-func/tb-datasource-func.directive';
import { TbDatasourceEntityDirective } from '../tb-datasource-entity/tb-datasource-entity.directive';

import $ from 'jquery';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbDatasource` (module `thingsboard.directives.datasource`) in src/app/components/datasource.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-datasource',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule, forwardRef(() => TbDatasourceFuncDirective), forwardRef(() => TbDatasourceEntityDirective)],
  templateUrl: './tb-datasource.directive.html',
})
export class TbDatasourceDirective {
  readonly aliasController = model<any>();
  readonly maxDataKeys = model<any>();
  readonly optDataKeys = model<any>();
  readonly widgetType = model<any>();
  readonly functionsOnly = model<any>();
  readonly datakeySettingsSchema = model<any>();
  readonly generateDataKey = output<any>();
  readonly fetchEntityKeys = output<any>();
  readonly onCreateEntityAlias = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly typesRef: any = types;
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-switch-when left in place

  types: any;
  $watch: any;
  datasourceTypes: any;
  model: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.types = this.typesRef;
    if (this.functionsOnly()) {
            this.datasourceTypes = [this.typesRef.datasourceType.function];
        } else{
            this.datasourceTypes = [this.typesRef.datasourceType.entity, this.typesRef.datasourceType.function];
        }
    this.$watch('model.type', (newType?: any, prevType?: any) => {
            if (newType && prevType && newType != prevType) {
                if (this.widgetType() == this.typesRef.widgetType.alarm.value) {
                    this.model.dataKeys = this.utils.getDefaultAlarmDataKeys();
                } else {
                    this.model.dataKeys = [];
                }
            }
        });
    this.$watch('model', () => {
            this.updateView();
        }, true);
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                this.model = ngModelCtrl.$viewValue;
            } else {
                this.model = {};
            }
        };
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateView(...rest: any[]): any {
    if (!this.model.dataKeys) {
        this.model.dataKeys = [];
    }
    ngModelCtrl.$setViewValue(this.model);
  }
}
