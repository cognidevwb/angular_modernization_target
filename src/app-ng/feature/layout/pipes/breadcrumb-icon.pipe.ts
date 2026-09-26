import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `breadcrumbIcon` (module `thingsboard.home`) in src/app/layout/index.js:67.
 * Scaffolded by the playbook. Same name, so templates that wrote `| breadcrumbIcon` keep working once this pipe is imported.
 */
@Pipe({ name: 'breadcrumbIcon', standalone: true })
export class BreadcrumbIconPipe implements PipeTransform {
  transform(bLabel?: any, ...rest: any[]): any {
    var labelObj: any = JSON.parse(bLabel);
    if ((labelObj.icon !== undefined)) {
        return labelObj.icon;
    }
    return null;
  }
}
