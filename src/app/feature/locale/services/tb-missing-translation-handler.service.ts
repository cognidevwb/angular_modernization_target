import { Injectable } from '@angular/core';
import { bindMethods } from '../../../bind-methods';

/**
 * Ported from the AngularJS factory `tbMissingTranslationHandler` (module `thingsboard.locale`) in src/app/locale/translate-handler.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class TbMissingTranslationHandlerService {
  private readonly __bound = bindMethods(this);

  constructor() {
    /*translationId*/
    /*if (translationId && !translationId.startsWith(types.translate.customTranslationsPrefix)) {
        $log.warn('Translation for ' + translationId + ' doesn\'t exist');
    }*/
  }
}
