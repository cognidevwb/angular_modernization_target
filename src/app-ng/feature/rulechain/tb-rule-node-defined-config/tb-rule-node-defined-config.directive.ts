import { Component, ComponentRef, DestroyRef, effect, ElementRef, inject, model, reflectComponentType, untracked, viewChild,
  ViewContainerRef } from '@angular/core';
import { isEqual } from 'lodash-es';
import { linkAttrs } from '../../../legacy-link';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { RuleNodeConfigRegistry } from './rule-node-config-registry';

/**
 * Ported from the AngularJS directive `tbRuleNodeDefinedConfig` (src/app/rulechain/rulenode-defined-config.directive.js).
 * The legacy link `$compile`d `<config-directive rule-node-id ng-model="configuration" ng-required ng-readonly>` for the
 * node definition's `configDirective` (the `rule-node-directive` attribute); here that name resolves through
 * RuleNodeConfigRegistry to a registered component (a form control: `writeValue` / `registerOnChange`, or a
 * `configuration` model) or to a custom element (`configuration` property, `change` / `configurationChange` events).
 * `[(ngModel)]` is the node configuration.
 */
@Component({
  selector: 'tb-rule-node-defined-config',
  standalone: true,
  template: '<ng-container #outlet></ng-container>',
  providers: ngModelProviders(TbRuleNodeDefinedConfigDirective),
})
export class TbRuleNodeDefinedConfigDirective extends NgModelController {
  readonly ruleNodeId = model<any>();
  readonly required = model<any>(undefined, { alias: 'ngRequired' });
  readonly readonly = model<any>(undefined, { alias: 'ngReadonly' });

  protected readonly element = inject(ElementRef);
  private readonly registry = inject(RuleNodeConfigRegistry);
  private readonly outlet = viewChild('outlet', { read: ViewContainerRef });

  configuration: any;
  private componentRef?: ComponentRef<any>;
  private customElement?: HTMLElement & Record<string, any>;
  private loadedDirective?: string;

  constructor() {
    super();
    const stopObserving = this.attrs.$observe('ruleNodeDirective', () => this.loadTemplate());
    inject(DestroyRef).onDestroy(() => {
      stopObserving();
      this.destroyConfig();
    });
    effect(() => {
      if (this.outlet()) {
        untracked(() => this.loadTemplate());
      }
    });
    effect(() => {
      const bound = { ruleNodeId: this.ruleNodeId(), required: this.required(), readonly: this.readonly() };
      untracked(() => {
        for (const [name, value] of Object.entries(bound)) {
          this.setConfigProperty(name, value);
        }
      });
    });
  }

  override $render(): void {
    this.configuration = this.$viewValue;
    this.writeConfiguration();
  }

  /** `scope.$watch('configuration', …)`: an edit in the config UI goes out through ngModel. */
  private onConfigurationChange(configuration: any): void {
    if (!isEqual(configuration, this.configuration)) {
      this.configuration = configuration;
      this.$setViewValue(this.configuration);
    }
  }

  loadTemplate(): void {
    const outlet = this.outlet();
    const directive: string | undefined = this.attrs.ruleNodeDirective;
    if (!outlet || !directive || directive === this.loadedDirective) {
      return;
    }
    this.destroyConfig();
    this.loadedDirective = directive;
    const component = this.registry.component(directive);
    if (component) {
      this.componentRef = outlet.createComponent(component);
      const instance = this.componentRef.instance;
      if (typeof instance.registerOnChange === 'function') {
        instance.registerOnChange((value: any) => this.onConfigurationChange(value));
      } else if (instance.configurationChange?.subscribe) {
        instance.configurationChange.subscribe((value: any) => this.onConfigurationChange(value));
      }
    } else {
      const tag = this.registry.customElementTag(directive);
      if (tag) {
        const el = document.createElement(tag) as HTMLElement & Record<string, any>;
        const listener = (event: Event) => this.onConfigurationChange((event as CustomEvent).detail ?? el['configuration']);
        el.addEventListener('change', listener);
        el.addEventListener('configurationChange', listener);
        this.element.nativeElement.appendChild(el);
        this.customElement = el;
      }
    }
    this.setConfigProperty('ruleNodeId', this.ruleNodeId());
    this.setConfigProperty('required', this.required());
    this.setConfigProperty('readonly', this.readonly());
    this.writeConfiguration();
  }

  private writeConfiguration(): void {
    const instance = this.componentRef?.instance;
    if (instance && typeof instance.writeValue === 'function') {
      instance.writeValue(this.configuration);
    } else {
      this.setConfigProperty('configuration', this.configuration);
    }
  }

  private setConfigProperty(name: string, value: any): void {
    if (this.componentRef) {
      const mirror = reflectComponentType(this.componentRef.componentType);
      if (mirror && mirror.inputs.some((i) => i.templateName === name)) {
        this.componentRef.setInput(name, value);
      } else {
        this.componentRef.instance[name] = value;
      }
    } else if (this.customElement) {
      this.customElement[name] = value;
    }
  }

  private destroyConfig(): void {
    this.componentRef?.destroy();
    this.componentRef = undefined;
    this.customElement?.remove();
    this.customElement = undefined;
    this.loadedDirective = undefined;
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
