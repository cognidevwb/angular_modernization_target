import { Component, forwardRef, inject, model, output } from '@angular/core';
import { AssetService } from '../../api/services/asset.service';
import { CustomerService } from '../../api/services/customer.service';
import { ElementRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntitySubtypeAutocompleteDirective } from '../../entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive';

import $ from 'jquery';
import assetFieldsetTemplate from '../../../../app/asset/asset-fieldset.tpl.html?raw';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAsset` (module `thingsboard.asset`) in src/app/asset/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-asset',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, forwardRef(() => TbEntitySubtypeAutocompleteDirective)],
  templateUrl: './tb-asset.directive.html',
})
export class TbAssetDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly asset = model<any>();
  readonly isEdit = model<any>();
  readonly assetScope = model<any>();
  readonly theForm = model<any>();
  readonly onAssignToCustomer = output<any>();
  readonly onMakePublic = output<any>();
  readonly onUnassignFromCustomer = output<any>();
  readonly onDeleteAsset = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly toast = inject(ToastService);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly assetService = inject(AssetService);
  protected readonly customerService = inject(CustomerService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(assetFieldsetTemplate);
  types: any;
  isAssignedToCustomer: any = false;
  isPublic: any = false;
  assignedCustomer: any = null;
  $watch: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.$watch('asset', (newVal?: any) => {
            if (newVal) {
                if (this.asset().customerId && this.asset().customerId.id !== this.typesRef.id.nullUid) {
                    this.isAssignedToCustomer = true;
                    this.customerService.getShortCustomerInfo(this.asset().customerId.id).then(
                        (customer?: any) => {
                            this.assignedCustomer = customer;
                            this.isPublic = customer.isPublic;
                        }
                    );
                } else {
                    this.isAssignedToCustomer = false;
                    this.isPublic = false;
                    this.assignedCustomer = null;
                }
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  onAssetIdCopied(...rest: any[]): any {
    this.toast.showSuccess(this.translate.instant('asset.idCopiedMessage'), 750, $($(this.element.nativeElement)).parent().parent(), 'bottom left');
  }
}
