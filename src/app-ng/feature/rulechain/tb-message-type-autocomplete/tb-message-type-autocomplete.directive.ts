import { Component, model } from '@angular/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
import { isEqual } from 'lodash-es';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbMessageTypeAutocomplete` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-message-type-autocomplete',
  standalone: true,
  imports: [TranslatePipe, FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule],
  templateUrl: './tb-message-type-autocomplete.directive.html',
  providers: ngModelProviders(TbMessageTypeAutocompleteDirective),
})
export class TbMessageTypeAutocompleteDirective extends NgModelController {
  readonly theForm = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly required = model<any>(undefined, { alias: 'ngRequired' });

  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected messageTypeList: any = [];
  protected messageTypeOptions: any[] = this.messageTypeList;
  protected readonly messageTypeDisplayFn = (item: any): string => item?.name ?? '';
  private _messageType: any = null;
  messageTypeSearchText: any = '';

  get messageType(): any {
    return this._messageType;
  }

  set messageType(value: any) {
    const prevValue = this._messageType;
    this._messageType = value;
    if (!isEqual(value, prevValue)) {
      this.updateView();
    }
  }

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  constructor() {
    super();
    for (var t in types.messageType) {
            var type: any = types.messageType[t];
            this.messageTypeList.push(type);
        }
  }

  override $render(): void {
    const value: any = this.$viewValue;
    if (value) {
        const result: any = this.filterByProperty(this.messageTypeList, {'value': value}, true);
        if (result && result.length) {
            this.messageType = result[0];
        } else {
            this.messageType = {
                name: value,
                value: value
            };
        }
    } else {
        this.messageType = null;
    }
  }

  fetchMessageTypes(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var result: any = this.filterByProperty(this.messageTypeList, {'name': searchText});
    if (result && result.length) {
        deferred.resolve(result);
    } else {
        deferred.resolve([{name: searchText, value: searchText}]);
    }
    return deferred.promise;
  }

  messageTypeSearchTextChanged(...rest: any[]): any {
          }

  onMessageTypeSelected(item: any): void {
    this.messageType = item;
    this.updateView();
  }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        var value: any = null;
        if (this.messageType) {
            value = this.messageType.value;
        }
        this.$setViewValue(value);
    }
  }

  private filterByProperty(arr: any[], predicate: Record<string, any>, exactMatch = false): any[] {
    return (arr || []).filter((item: any) => Object.entries(predicate).every(([key, val]) => {
        if (exactMatch) {
            return item[key] === val;
        }
        return String(item[key] ?? '').toLowerCase().includes(String(val ?? '').toLowerCase());
    }));
  }
}
