import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import messageTypeAutocompleteTemplate from '../../../../app/rulechain/message-type-autocomplete.tpl.html?raw';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $q: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbMessageTypeAutocomplete` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-message-type-autocomplete',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './tb-message-type-autocomplete.directive.html',
})
export class TbMessageTypeAutocompleteDirective {
  readonly theForm = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly required = model<any>(undefined, { alias: 'ngRequired' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(messageTypeAutocompleteTemplate);
  protected messageTypeList: any = [];
  messageType: any = null;
  messageTypeSearchText: any = '';
  $watch: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    for (var t in types.messageType) {
            var type: any = types.messageType[t];
            this.messageTypeList.push(type);
        }
    ngModelCtrl.$render = function () {
            var value: any = ngModelCtrl.$viewValue;
            if (value) {
                var result: any = $filter('filter')(this.messageTypeList, {'value': value}, true);
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
        };
    this.$watch('messageType', (newValue?: any, prevValue?: any) => {
            if (!angular.equals(newValue, prevValue)) {
                this.updateView();
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  fetchMessageTypes(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var result: any = $filter('filter')(this.messageTypeList, {'name': searchText});
    if (result && result.length) {
        deferred.resolve(result);
    } else {
        deferred.resolve([{name: searchText, value: searchText}]);
    }
    return deferred.promise;
  }

  messageTypeSearchTextChanged(...rest: any[]): any {
          }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        var value: any = null;
        if (this.messageType) {
            value = this.messageType.value;
        }
        ngModelCtrl.$setViewValue(value);
    }
  }
}
