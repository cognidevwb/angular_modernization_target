import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { TranslatePipe } from '@ngx-translate/core';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbRuleNodeLink` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-rule-node-link',
  standalone: true,
  imports: [TranslatePipe, CommonModule, FormsModule, MatChipsModule, MatAutocompleteModule],
  templateUrl: './tb-rule-node-link.directive.html',
  providers: ngModelProviders(TbRuleNodeLinkDirective),
})
export class TbRuleNodeLinkDirective extends NgModelController {
  protected readonly rootScope = injectRoot(RootState);
  readonly allowedLabels = model<any>();
  readonly allowCustom = model<any>();
  readonly isEdit = model<any>();
  readonly isReadOnly = model<any>();
  readonly required = model<any>();

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

  selectedLabel: any = null;
  labelSearchText: any = null;
  protected labelsList: any = [];
  labels: any;

  override $render(): void {
    this.labelsList.length = 0;
    const allowedLabels: any = this.allowedLabels() || {};
    for (const key in allowedLabels) {
      const linkLabel: any = {
        name: allowedLabels[key].name,
        value: allowedLabels[key].value
      };
      this.labelsList.push(linkLabel);
    }

    const link: any = this.$viewValue;
    const labels: any = [];
    if (link && link.labels) {
      for (let i: any = 0; i < link.labels.length; i++) {
        const label: any = link.labels[i];
        if (allowedLabels[label]) {
          labels.push(structuredClone(allowedLabels[label]));
        } else {
          labels.push({
            name: label,
            value: label
          });
        }
      }
    }
    this.labels = labels;
  }

  transformLinkLabelChip(chip?: any, ...rest: any[]): any {
    var res: any = this.labelsList.filter((item: any) => item.name === chip);
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
    var labels: any = searchText
      ? this.labelsList.filter((item: any) => item.name && String(item.name).toLowerCase().indexOf(String(searchText).toLowerCase()) !== -1)
      : this.labelsList;
    return labels.map((label?: any) => label.name);
  }

  protected removeLabel(chip: any): void {
    const index: number = (this.labels || []).indexOf(chip);
    if (index >= 0) {
      this.labels.splice(index, 1);
      this.updateLabels();
    }
  }

  protected onLabelSelected(event: MatAutocompleteSelectedEvent): void {
    const chip: any = this.transformLinkLabelChip(event.option.value);
    this.labels = this.labels || [];
    this.labels.push(chip);
    this.labelSearchText = '';
    this.updateLabels();
  }

  protected truncateLabel(text: string): string {
    if (!text) {
      return text;
    }
    const length: number = 6;
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
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
    if (this.$viewValue) {
        var labels: any = [];
        for (var i: any = 0; i < this.labels.length; i++) {
            labels.push(this.labels[i].value);
        }
        this.$viewValue.labels = labels;
        this.$viewValue.label = labels.join(' / ');
        this.updateValidity();
    }
  }

  updateValidity(...rest: any[]): any {
    var valid: any = this.$viewValue.labels &&
    this.$viewValue.labels.length ? true : false;
    this.$setValidity('linkLabels', valid);
  }
}
