import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

// Helpers at the legacy file's top level, beside the registration (as written).
const SNAKE_CASE_REGEXP: any = /[A-Z]/g;

/**
 * Ported from the AngularJS directive `tbRuleNodeDefinedConfig` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-rule-node-defined-config',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbRuleNodeDefinedConfigDirective {
  readonly ruleNodeId = model<any>();
  readonly required = model<any>(undefined, { alias: 'ngRequired' });
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly element = inject(ElementRef);

  $new: any;
  $watch: any;
  configuration: any;
  ruleNodeConfigScope: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.attrs.$observe('ruleNodeDirective', () => {
            this.loadTemplate();
        });
    this.$watch('configuration', (newVal?: any, prevVal?: any) => {
            if (!angular.equals(newVal, prevVal)) {
                ngModelCtrl.$setViewValue(this.configuration);
            }
        });
    ngModelCtrl.$render = function () {
            this.configuration = ngModelCtrl.$viewValue;
        };
  }

  loadTemplate(...rest: any[]): any {
    if (this.ruleNodeConfigScope) {
        this.ruleNodeConfigScope.$destroy();
    }
    var directive: any = this.snake_case(this.attrs.ruleNodeDirective, '-');
    var template: any = `<${directive} rule-node-id="ruleNodeId" ng-model="configuration" ng-required="required" ng-readonly="readonly"></${directive}>`;
    $(this.element.nativeElement).html(template);
    this.ruleNodeConfigScope = this.$new();
    $compile($(this.element.nativeElement).contents())(this.ruleNodeConfigScope);
  }

  snake_case(name?: any, separator?: any, ...rest: any[]): any {
    separator = separator || '_';
    return name.replace(SNAKE_CASE_REGEXP, function(letter?: any, pos?: any) {
        return (pos ? separator : '') + letter.toLowerCase();
    });
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
