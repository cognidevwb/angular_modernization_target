import { Component, effect, inject, input, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';

import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbWidgetsBundleSelect` (module `thingsboard.directives.widgetsBundleSelect`) in src/app/components/widgets-bundle-select.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-widgets-bundle-select',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, FormsModule],
  templateUrl: './tb-widgets-bundle-select.directive.html',
  providers: ngModelProviders(TbWidgetsBundleSelectDirective),
})
export class TbWidgetsBundleSelectDirective extends NgModelController {
  readonly bundlesScope = input<any>();
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly selectFirstBundle = model<any>();
  readonly selectBundleAlias = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly widgetService = inject(WidgetService);
  protected readonly element = inject(ElementRef);

  private _widgetsBundle: any = null;
  widgetsBundles: any = [];
  protected widgetsBundleFetchFunction: any;

  get widgetsBundle(): any {
    return this._widgetsBundle;
  }
  set widgetsBundle(value: any) {
    this._widgetsBundle = value;
    this.updateView();
  }

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    this.widgetsBundleFetchFunction = this.widgetService.getAllWidgetsBundles;
    if ((this.bundlesScope !== undefined)) {
            if (this.bundlesScope() === 'system') {
                this.widgetsBundleFetchFunction = this.widgetService.getSystemWidgetsBundles;
            } else if (this.bundlesScope() === 'tenant') {
                this.widgetsBundleFetchFunction = this.widgetService.getTenantWidgetsBundles;
            }
        }
    this.widgetsBundleFetchFunction({ignoreLoading: true}).then(
            (widgetsBundles?: any) => {
                this.widgetsBundles = widgetsBundles;
                if (this.selectFirstBundle()) {
                    if (widgetsBundles.length > 0) {
                        this.widgetsBundle = widgetsBundles[0];
                    }
                } else if ((this.selectBundleAlias !== undefined)) {
                    this.selectWidgetsBundleByAlias(this.selectBundleAlias());
                }
            },
            function fail() {
            }
        );
    effect(() => {
            this.selectWidgetsBundleByAlias(this.selectBundleAlias());
        });
  }

  override $render(): void {
    if (this.$viewValue) {
        this.widgetsBundle = this.$viewValue;
    }
  }

  selectWidgetsBundleByAlias(alias?: any, ...rest: any[]): any {
    if (this.widgetsBundles && alias) {
        for (var w in this.widgetsBundles) {
            var widgetsBundle: any = this.widgetsBundles[w];
            if (widgetsBundle.alias === alias) {
                this.widgetsBundle = widgetsBundle;
                break;
            }
        }
    }
  }

  isSystem(item?: any, ...rest: any[]): any {
    return item && item.tenantId.id === types.id.nullUid;
  }

  updateView(...rest: any[]): any {
    this.$setViewValue(this.widgetsBundle);
  }
}
