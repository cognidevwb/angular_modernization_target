import { Component, forwardRef, inject } from '@angular/core';
import { CustomerService } from '../../api/services/customer.service';
import { EntityViewService } from '../../api/services/entity-view.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TbScopeElementDirective } from '../../components/tb-scope-element/tb-scope-element.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `AssignEntityViewToCustomerController` (module `thingsboard.entityView`) in src/app/entity-view/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'assign-entity-view-to-customer',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbScopeElementDirective)],
  templateUrl: './assign-entity-view-to-customer.component.html',
})
export class AssignEntityViewToCustomerComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly customerService = inject(CustomerService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  customers: any;
  searchText: any = '';
  theCustomers: any;

  constructor() {
    this.customers = this.dialogData.customers;
    this.assign = this.assign;
    this.cancel = this.cancel;
    this.isCustomerSelected = this.isCustomerSelected;
    this.hasData = this.hasData;
    this.noData = this.noData;
    this.searchCustomerTextUpdated = this.searchCustomerTextUpdated;
    this.toggleCustomerSelection = this.toggleCustomerSelection;
    this.theCustomers = {
        getItemAtIndex: (index?: any, ...rest: any[]) => {
            if (index > this.customers.data.length) {
                this.theCustomers.fetchMoreItems_(index);
                return null;
            }
            var item: any = this.customers.data[index];
            if (item) {
                item.indexNumber = index + 1;
            }
            return item;
        },

        getLength: (...rest: any[]) => {
            if (this.customers.hasNext) {
                return this.customers.data.length + this.customers.nextPageLink.limit;
            } else {
                return this.customers.data.length;
            }
            return undefined;
        },

        fetchMoreItems_: (...rest: any[]) => {
            if (this.customers.hasNext && !this.customers.pending) {
                this.customers.pending = true;
                this.customerService.getCustomers(this.customers.nextPageLink).then(
                    (customers?: any) => {
                        this.customers.data = this.customers.data.concat(customers.data);
                        this.customers.nextPageLink = customers.nextPageLink;
                        this.customers.hasNext = customers.hasNext;
                        if (this.customers.hasNext) {
                            this.customers.nextPageLink.limit = this.customers.pageSize;
                        }
                        this.customers.pending = false;
                    },
                    () => {
                        this.customers.hasNext = false;
                        this.customers.pending = false;
                    });
            }
        }
    };
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  assign = (...rest: any[]): any => {
    var tasks: any = [];
    for (var i: any=0; i < this.dialogData.entityViewIds.length;i++) {
        tasks.push(this.entityViewService.assignEntityViewToCustomer(this.customers.selection.id.id, this.dialogData.entityViewIds[i]));
    }
    Promise.all(tasks).then(() => {
        (this.dialog as any).hide();
    });
  };

  noData = (...rest: any[]): any => {
    return this.customers.data.length == 0 && !this.customers.hasNext;
  };

  hasData = (...rest: any[]): any => {
    return this.customers.data.length > 0;
  };

  toggleCustomerSelection = ($event?: any, customer?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    if (this.isCustomerSelected(customer)) {
        this.customers.selection = null;
    } else {
        this.customers.selection = customer;
    }
  };

  isCustomerSelected = (customer?: any, ...rest: any[]): any => {
    return this.customers.selection != null && customer &&
        customer.id.id === this.customers.selection.id.id;
  };

  searchCustomerTextUpdated = (...rest: any[]): any => {
    this.customers = {
        pageSize: this.customers.pageSize,
        data: [],
        nextPageLink: {
            limit: this.customers.pageSize,
            textSearch: this.searchText
        },
        selection: null,
        hasNext: true,
        pending: false
    };
  };
}
