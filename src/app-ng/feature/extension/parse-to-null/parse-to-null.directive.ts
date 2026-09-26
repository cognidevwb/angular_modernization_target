import { Directive } from '@angular/core';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `parseToNull` (module `thingsboard.extension`) in src/app/extension/index.js:24.
 */
@Directive({
  selector: '[parse-to-null]',
  standalone: true,
  providers: ngModelProviders(ParseToNullDirective),
})
export class ParseToNullDirective extends NgModelController {
  constructor() {
    super();
    this.$parsers.push(function(value?: any) {
            if(value === "") {
                return null;
            }
            return value;
        })
  }
}
