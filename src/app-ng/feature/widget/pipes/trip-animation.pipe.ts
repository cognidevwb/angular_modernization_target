import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Ported from the AngularJS filter `tripAnimation` (module `thingsboard.widgets.tripAnimation`) in src/app/widget/lib/tripAnimation/trip-animation-widget.js:87.
 * Scaffolded by the playbook. Same name, so templates that wrote `| tripAnimation` keep working once this pipe is imported.
 */
@Pipe({ name: 'tripAnimation', standalone: true })
export class TripAnimationPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(label?: any, ...rest: any[]): any {
    label = label.toString();

    let translateSelector: any = "widgets.tripAnimation." + label;
    let translation: any = this.translate.instant(translateSelector);

    if (translation !== translateSelector) {
        return translation;
    }

    return label;
  }
}
