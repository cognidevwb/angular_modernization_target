import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TbRuleNodeDefinedConfigDirective } from '../tb-rule-node-defined-config/tb-rule-node-defined-config.directive';
import { TbJsonObjectEditDirective } from '../../components/tb-json-object-edit/tb-json-object-edit.directive';

import $ from 'jquery';
import ruleNodeConfigTemplate from '../../../../app/rulechain/rulenode-config.tpl.html';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $injector: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbRuleNodeConfig` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-rule-node-config',
  standalone: true,
  imports: [TranslatePipe, FormsModule, forwardRef(() => TbRuleNodeDefinedConfigDirective), forwardRef(() => TbJsonObjectEditDirective)],
  templateUrl: './tb-rule-node-config.directive.html',
})
export class TbRuleNodeConfigDirective {
  readonly ruleNodeId = model<any>();
  readonly nodeDefinition = model<any>();
  readonly required = model<any>(undefined, { alias: 'ngRequired' });
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$injector' — inject() at the use site
  protected readonly translate = inject(TranslateService);
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(ruleNodeConfigTemplate);
  $watch: any;
  configuration: any;
  definedDirectiveError: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.$watch('configuration', (newVal?: any, prevVal?: any) => {
            if (!angular.equals(newVal, prevVal)) {
                ngModelCtrl.$setViewValue(this.configuration);
            }
        });
    ngModelCtrl.$render = function () {
            this.configuration = ngModelCtrl.$viewValue;
        };
    this.$watch('nodeDefinition', () => {
            if (this.nodeDefinition()) {
                this.validateDefinedDirective();
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  useDefinedDirective(...rest: any[]): any {
    return this.nodeDefinition() &&
        this.nodeDefinition().configDirective && !this.definedDirectiveError;
  }

  validateDefinedDirective(...rest: any[]): any {
    if (this.nodeDefinition().uiResourceLoadError && this.nodeDefinition().uiResourceLoadError.length) {
        this.definedDirectiveError = this.nodeDefinition().uiResourceLoadError;
    } else {
        var definedDirective: any = this.nodeDefinition().configDirective;
        if (definedDirective && definedDirective.length) {
            if (!$injector.has(definedDirective + 'Directive')) {
                this.definedDirectiveError = this.translate.instant('rulenode.directive-is-not-loaded', {directiveName: definedDirective});
            }
        }
    }
  }
}
