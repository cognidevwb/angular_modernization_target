import { Component, Injector, effect, forwardRef, inject, model } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TbRuleNodeDefinedConfigDirective } from '../tb-rule-node-defined-config/tb-rule-node-defined-config.directive';
import { TbJsonObjectEditDirective } from '../../components/tb-json-object-edit/tb-json-object-edit.directive';
import { isEqual } from 'lodash-es';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbRuleNodeConfig` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-rule-node-config',
  standalone: true,
  imports: [TranslatePipe, FormsModule, forwardRef(() => TbRuleNodeDefinedConfigDirective), forwardRef(() => TbJsonObjectEditDirective)],
  templateUrl: './tb-rule-node-config.directive.html',
  providers: ngModelProviders(TbRuleNodeConfigDirective),
})
export class TbRuleNodeConfigDirective extends NgModelController {
  readonly ruleNodeId = model<any>();
  readonly nodeDefinition = model<any>();
  readonly required = model<any>(undefined, { alias: 'ngRequired' });
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });

  protected readonly translate = inject(TranslateService);
  private readonly injector = inject(Injector);

  configuration: any;
  definedDirectiveError: any;

  private prevConfiguration: any;

  constructor() {
    super();
    effect(() => {
      if (this.nodeDefinition()) {
        this.validateDefinedDirective();
      }
    });
  }

  ngDoCheck(): void {
    if (!isEqual(this.configuration, this.prevConfiguration)) {
      this.prevConfiguration = structuredClone(this.configuration);
      this.$setViewValue(this.configuration);
    }
  }

  $render(): void {
    this.configuration = this.$viewValue;
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
            if (!this.injector.get(definedDirective + 'Directive' as any, null)) {
                this.definedDirectiveError = this.translate.instant('rulenode.directive-is-not-loaded', {directiveName: definedDirective});
            }
        }
    }
  }
}
