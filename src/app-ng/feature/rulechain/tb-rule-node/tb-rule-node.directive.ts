import { Component, forwardRef, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbRuleNodeConfigDirective } from '../tb-rule-node-config/tb-rule-node-config.directive';
import { TbEntityAutocompleteDirective } from '../../entity/tb-entity-autocomplete/tb-entity-autocomplete.directive';

import $ from 'jquery';
import ruleNodeFieldsetTemplate from '!!raw-loader!../../../../app/rulechain/rulenode-fieldset.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbRuleNode` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-rule-node',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbRuleNodeConfigDirective), forwardRef(() => TbEntityAutocompleteDirective)],
  templateUrl: './tb-rule-node.directive.html',
})
export class TbRuleNodeDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly ruleChainId = model<any>();
  readonly ruleNode = model<any>();
  readonly isEdit = model<any>();
  readonly isReadOnly = model<any>();
  readonly theForm = model<any>();
  readonly onDeleteRuleNode = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly ruleChainService = inject(RuleChainService);
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(ruleNodeFieldsetTemplate);
  types: any;
  params: any = {
            targetRuleChainId: null
        };
  $watch: any;
  targetRuleChainWatch: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.$watch('ruleNode', () => {
            if (this.ruleNode() && this.ruleNode().component.type == this.typesRef.ruleNodeType.RULE_CHAIN.value) {
                this.params.targetRuleChainId = this.ruleNode().targetRuleChainId;
                this.watchTargetRuleChain();
            } else {
                if (this.targetRuleChainWatch) {
                    this.targetRuleChainWatch();
                    this.targetRuleChainWatch = null;
                }
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  watchTargetRuleChain(...rest: any[]): any {
    this.targetRuleChainWatch = this.$watch('params.targetRuleChainId',
        (targetRuleChainId?: any) => {
            if (this.ruleNode().targetRuleChainId != targetRuleChainId) {
                this.ruleNode().targetRuleChainId = targetRuleChainId;
                if (targetRuleChainId) {
                    this.ruleChainService.getRuleChain(targetRuleChainId).then(
                        (ruleChain?: any) => {
                            this.ruleNode().name = ruleChain.name;
                        }
                    );
                } else {
                    this.ruleNode().name = "";
                }
            }
        }
    );
  }
}
