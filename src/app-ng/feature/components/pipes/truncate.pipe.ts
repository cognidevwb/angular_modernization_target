import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `truncate` (module `thingsboard.filters.truncate`) in src/app/components/truncate.filter.js:16.
 * Scaffolded by the playbook. Same name, so templates that wrote `| truncate` keep working once this pipe is imported.
 */
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value?: any, wordwise?: any, max?: any, tail?: any, ...rest: any[]): any {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
        var lastspace: any = value.lastIndexOf(' ');
        if (lastspace != -1) {
            //Also remove . and , so its gives a cleaner result.
            if (value.charAt(lastspace - 1) == '.' || value.charAt(lastspace - 1) == ',') {
                lastspace = lastspace - 1;
            }
            value = value.substr(0, lastspace);
        }
    }

    return value + (tail || ' …');
  }
}
