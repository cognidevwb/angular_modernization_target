import { Component, forwardRef, inject, model, output } from '@angular/core';
import { ClipboardService } from '../../services/clipboard.service';
import { CustomerService } from '../../api/services/customer.service';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntitySubtypeAutocompleteDirective } from '../../entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive';

import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbDevice` (module `thingsboard.device`) in src/app/device/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-device',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbEntitySubtypeAutocompleteDirective)],
  templateUrl: './tb-device.directive.html',
})
export class TbDeviceDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly device = model<any>();
  readonly isEdit = model<any>();
  readonly deviceScope = model<any>();
  readonly theForm = model<any>();
  readonly onAssignToCustomer = output<any>();
  readonly onMakePublic = output<any>();
  readonly onUnassignFromCustomer = output<any>();
  readonly onManageCredentials = output<any>();
  readonly onDeleteDevice = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly toast = inject(ToastService);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly customerService = inject(CustomerService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  types: any;
  isAssignedToCustomer: any = false;
  isPublic: any = false;
  assignedCustomer: any = null;
  $watch: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.types = this.typesRef;
    this.$watch('device', (newVal?: any) => {
            if (newVal) {
                if (this.device().customerId && this.device().customerId.id !== this.typesRef.id.nullUid) {
                    this.isAssignedToCustomer = true;
                    this.customerService.getShortCustomerInfo(this.device().customerId.id).then(
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
  }

  onDeviceIdCopied(...rest: any[]): any {
    this.toast.showSuccess(this.translate.instant('device.idCopiedMessage'), 750, $($(this.element.nativeElement)).parent().parent(), 'bottom left');
  }

  copyAccessToken(e?: any, ...rest: any[]): any {
    const trigger: any = e.delegateTarget || e.currentTarget;
    if (this.device().id) {
        this.deviceService.getDeviceCredentials(this.device().id.id, true).then(
            (credentials?: any) => {
                var credentialsId: any = credentials.credentialsId;
                this.clipboardService.copyToClipboard(trigger, credentialsId).then(
                    () => {
                        this.toast.showSuccess(this.translate.instant('device.accessTokenCopiedMessage'), 750, $($(this.element.nativeElement)).parent().parent(), 'bottom left');
                    }
                );
            }
        );
    }
  }
}
