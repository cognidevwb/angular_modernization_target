import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `range` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * Scaffolded by the playbook. Same name, so templates that wrote `| range` keep working once this pipe is imported.
 */
@Pipe({ name: 'range', standalone: true })
export class RangePipe implements PipeTransform {
  transform(input?: any, total?: any, ...rest: any[]): any {
    total = parseInt(total);

    for (var i: any=0; i<total; i++) {
        input.push(i);
    }

    return input;
  }
}
