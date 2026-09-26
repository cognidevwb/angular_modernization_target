import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `tripAnimation` (module `thingsboard.widgets.tripAnimation`) in src/app/widget/lib/tripAnimation/trip-animation-widget.js:87.
 * Scaffolded by the playbook. Same name, so templates that wrote `| tripAnimation` keep working once this pipe is imported.
 */
@Pipe({ name: 'tripAnimation', standalone: true })
export class TripAnimationPipe implements PipeTransform {
  transform(label?: any, ...rest: any[]): any {
    label = label.toString();

    let translateSelector: any = "widgets.tripAnimation." + label;
    let translation: any = $filter('translate')(translateSelector);

    if (translation !== translateSelector) {
        return translation;
    }

    return label;
  }
}
