import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbJsonToString` (module `tbJsonToString`) in src/app/components/tb-json-to-string.directive.js:16.
 */
@Directive({
  selector: '[tb-json-to-string]',
  standalone: true,
  providers: ngModelProviders(TbJsonToStringDirective),
})
export class TbJsonToStringDirective extends NgModelController {
  protected readonly element = inject(ElementRef);

  constructor() {
    super();
    this.$parsers.push(this.into);
    this.$formatters.push(this.out);
  }

  into = (input?: any, ...rest: any[]): any => {
    try {
        this.$setValidity('invalidJSON', true);
        return JSON.parse(input);
    } catch (e: any) {
        this.$setValidity('invalidJSON', false);
    }
    return undefined;
  };

  out = (data?: any, ...rest: any[]): any => {
    try {
        this.$setValidity('invalidJSON', true);
        return JSON.stringify(data);
    } catch (e: any) {
        this.$setValidity('invalidJSON', false);
    }
    return undefined;
  };
}
