import { Component, forwardRef, inject } from '@angular/core';
import { AssetService } from '../../api/services/asset.service';
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
 * Ported from the AngularJS controller `AddAssetsToCustomerController` (module `thingsboard.asset`) in src/app/asset/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'add-assets-to-customer',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbScopeElementDirective)],
  templateUrl: './add-assets-to-customer.component.html',
})
export class AddAssetsToCustomerComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly assetService = inject(AssetService);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  assets: any;
  searchText: any = '';
  theAssets: any;

  constructor() {
    this.assets = this.dialogData.assets;
    this.assign = this.assign;
    this.cancel = this.cancel;
    this.hasData = this.hasData;
    this.noData = this.noData;
    this.searchAssetTextUpdated = this.searchAssetTextUpdated;
    this.toggleAssetSelection = this.toggleAssetSelection;
    this.theAssets = {
        getItemAtIndex: (index?: any, ...rest: any[]) => {
            if (index > this.assets.data.length) {
                this.theAssets.fetchMoreItems_(index);
                return null;
            }
            var item: any = this.assets.data[index];
            if (item) {
                item.indexNumber = index + 1;
            }
            return item;
        },

        getLength: (...rest: any[]) => {
            if (this.assets.hasNext) {
                return this.assets.data.length + this.assets.nextPageLink.limit;
            } else {
                return this.assets.data.length;
            }
            return undefined;
        },

        fetchMoreItems_: (...rest: any[]) => {
            if (this.assets.hasNext && !this.assets.pending) {
                this.assets.pending = true;
                this.assetService.getTenantAssets(this.assets.nextPageLink, false).then(
                    (assets?: any) => {
                        this.assets.data = this.assets.data.concat(assets.data);
                        this.assets.nextPageLink = assets.nextPageLink;
                        this.assets.hasNext = assets.hasNext;
                        if (this.assets.hasNext) {
                            this.assets.nextPageLink.limit = this.assets.pageSize;
                        }
                        this.assets.pending = false;
                    },
                    () => {
                        this.assets.hasNext = false;
                        this.assets.pending = false;
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
    for (var assetId in this.assets.selections) {
        tasks.push(this.assetService.assignAssetToCustomer(this.dialogData.customerId, assetId));
    }
    Promise.all(tasks).then(() => {
(this.dialog as any).hide();
    });
  };

  noData = (...rest: any[]): any => {
    return this.assets.data.length == 0 && !this.assets.hasNext;
  };

  hasData = (...rest: any[]): any => {
    return this.assets.data.length > 0;
  };

  toggleAssetSelection = ($event?: any, asset?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    var selected: any = (asset.selected !== undefined) && asset.selected;
    asset.selected = !selected;
    if (asset.selected) {
        this.assets.selections[asset.id.id] = true;
        this.assets.selectedCount++;
    } else {
        delete this.assets.selections[asset.id.id];
        this.assets.selectedCount--;
    }
  };

  searchAssetTextUpdated = (...rest: any[]): any => {
    this.assets = {
        pageSize: this.assets.pageSize,
        data: [],
        nextPageLink: {
            limit: this.assets.pageSize,
            textSearch: this.searchText
        },
        selections: {},
        selectedCount: 0,
        hasNext: true,
        pending: false
    };
  };
}
