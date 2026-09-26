import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import linkFieldsetTemplate from '../../../../app/rulechain/link-fieldset.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $templateCache: any;
declare let angular: any;
declare let label: any;
declare let scope: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbRuleNodeLink` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-rule-node-link',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule],
  templateUrl: './tb-rule-node-link.directive.html',
})
export class TbRuleNodeLinkDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly allowedLabels = model<any>();
  readonly allowCustom = model<any>();
  readonly isEdit = model<any>();
  readonly isReadOnly = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-chips, md-autocomplete, md-not-found, md-chip-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-chip-template left in place
  // TODO(port): template: 1 × md-chips left in place
  // TODO(port): template: 1 × md-not-found left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(linkFieldsetTemplate);
  selectedLabel: any = null;
  labelSearchText: any = null;
  ngModelCtrl: any = ngModelCtrl;
  protected labelsList: any = [];
  $watch: any;
  labels: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    ngModelCtrl.$render = function () {
            this.labelsList.length = 0;
            for (var label in this.allowedLabels()) {
                var linkLabel: any = {
                    name: this.allowedLabels()[label].name,
                    value: this.allowedLabels()[label].value
                };
                this.labelsList.push(linkLabel);
            }

            var link: any = ngModelCtrl.$viewValue;
            var labels: any = [];
            if (link && link.labels) {
                for (var i: any = 0; i < link.labels.length; i++) {
                    label = link.labels[i];
                    if (this.allowedLabels()[label]) {
                        labels.push(structuredClone(this.allowedLabels()[label]));
                    } else {
                        labels.push({
                            name: label,
                            value: label
                        });
                    }
                }
            }
            this.labels = labels;
            this.$watch('labels', (newVal?: any, prevVal?: any) => {
                if (!angular.equals(newVal, prevVal)) {
                    this.updateLabels();
                }
            }, true);
        };
    $compile($(this.element.nativeElement).contents())(this);
  }

  transformLinkLabelChip(chip?: any, ...rest: any[]): any {
    var res: any = $filter('filter')(this.labelsList, {name: chip}, true);
    var result: any;
    if (res && res.length) {
        result = structuredClone(res[0]);
    } else {
        result = {
            name: chip,
            value: chip
        };
    }
    return result;
  }

  labelsSearch(searchText?: any, ...rest: any[]): any {
    var labels: any = searchText ? $filter('filter')(this.labelsList, {name: searchText}) : this.labelsList;
    return labels.map((label?: any) => label.name);
  }

  createLinkLabel(event?: any, chipsId?: any, ...rest: any[]): any {
    var chipsChild: any = $(chipsId, $(this.element.nativeElement))[0].firstElementChild;
    var el: any = $(chipsChild);
    var chipBuffer: any = el.scope().$mdChipsCtrl.getChipBuffer();
    event.preventDefault();
    event.stopPropagation();
    el.scope().$mdChipsCtrl.appendChip(chipBuffer.trim());
    el.scope().$mdChipsCtrl.resetChipBuffer();
  }

  updateLabels(...rest: any[]): any {
    if (ngModelCtrl.$viewValue) {
        var labels: any = [];
        for (var i: any = 0; i < this.labels.length; i++) {
            labels.push(this.labels[i].value);
        }
        ngModelCtrl.$viewValue.labels = labels;
        ngModelCtrl.$viewValue.label = labels.join(' / ');
        this.updateValidity();
    }
  }

  updateValidity(...rest: any[]): any {
    var valid: any = ngModelCtrl.$viewValue.labels &&
    ngModelCtrl.$viewValue.labels.length ? true : false;
    ngModelCtrl.$setValidity('linkLabels', valid);
  }
}
