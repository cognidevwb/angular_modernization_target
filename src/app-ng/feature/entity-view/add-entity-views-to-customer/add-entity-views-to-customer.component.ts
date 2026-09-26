import { Component, forwardRef, inject } from '@angular/core';
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
 * Ported from the AngularJS controller `AddEntityViewsToCustomerController` (module `thingsboard.entityView`) in src/app/entity-view/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'add-entity-views-to-customer',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbScopeElementDirective)],
  templateUrl: './add-entity-views-to-customer.component.html',
})
export class AddEntityViewsToCustomerComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  entityViews: any;
  searchText: any = '';
  theEntityViews: any;

  constructor() {
    this.entityViews = this.dialogData.entityViews;
    this.assign = this.assign;
    this.cancel = this.cancel;
    this.hasData = this.hasData;
    this.noData = this.noData;
    this.searchEntityViewTextUpdated = this.searchEntityViewTextUpdated;
    this.toggleEntityViewSelection = this.toggleEntityViewSelection;
    this.theEntityViews = {
        getItemAtIndex: (index?: any, ...rest: any[]) => {
            if (index > this.entityViews.data.length) {
                this.theEntityViews.fetchMoreItems_(index);
                return null;
            }
            var item: any = this.entityViews.data[index];
            if (item) {
                item.indexNumber = index + 1;
            }
            return item;
        },

        getLength: (...rest: any[]) => {
            if (this.entityViews.hasNext) {
                return this.entityViews.data.length + this.entityViews.nextPageLink.limit;
            } else {
                return this.entityViews.data.length;
            }
            return undefined;
        },

        fetchMoreItems_: (...rest: any[]) => {
            if (this.entityViews.hasNext && !this.entityViews.pending) {
                this.entityViews.pending = true;
                this.entityViewService.getTenantEntityViews(this.entityViews.nextPageLink, false).then(
                    (entityViews?: any) => {
                        this.entityViews.data = this.entityViews.data.concat(entityViews.data);
                        this.entityViews.nextPageLink = entityViews.nextPageLink;
                        this.entityViews.hasNext = entityViews.hasNext;
                        if (this.entityViews.hasNext) {
                            this.entityViews.nextPageLink.limit = this.entityViews.pageSize;
                        }
                        this.entityViews.pending = false;
                    },
                    () => {
                        this.entityViews.hasNext = false;
                        this.entityViews.pending = false;
                    });
            }
        }
    };
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  assign = (...rest: any[]): any => {
    var tasks: any = [];
    for (var entityViewId in this.entityViews.selections) {
        tasks.push(this.entityViewService.assignEntityViewToCustomer(this.dialogData.customerId, entityViewId));
    }
    Promise.all(tasks).then(() => {
        this.dialog.hide();
    });
  };

  noData = (...rest: any[]): any => {
    return this.entityViews.data.length == 0 && !this.entityViews.hasNext;
  };

  hasData = (...rest: any[]): any => {
    return this.entityViews.data.length > 0;
  };

  toggleEntityViewSelection = ($event?: any, entityView?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    var selected: any = (entityView.selected !== undefined) && entityView.selected;
    entityView.selected = !selected;
    if (entityView.selected) {
        this.entityViews.selections[entityView.id.id] = true;
        this.entityViews.selectedCount++;
    } else {
        delete this.entityViews.selections[entityView.id.id];
        this.entityViews.selectedCount--;
    }
  };

  searchEntityViewTextUpdated = (...rest: any[]): any => {
    this.entityViews = {
        pageSize: this.entityViews.pageSize,
        data: [],
        nextPageLink: {
            limit: this.entityViews.pageSize,
            textSearch: this.searchText
        },
        selections: {},
        selectedCount: 0,
        hasNext: true,
        pending: false
    };
  };
}
