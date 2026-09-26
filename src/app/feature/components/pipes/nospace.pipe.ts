import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `nospace` (module `thingsboard.directives.menuLink`) in src/app/components/menu-link.directive.js:27.
 * Scaffolded by the playbook. Same name, so templates that wrote `| nospace` keep working once this pipe is imported.
 */
@Pipe({ name: 'nospace', standalone: true })
export class NospacePipe implements PipeTransform {
  transform(value?: any, ...rest: any[]): any {
    return (!value) ? '' : value.replace(/ /g, '');
  }
}
