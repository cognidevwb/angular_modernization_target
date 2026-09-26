import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Ported from the AngularJS filter `milliSecondsToTimeString` (module `thingsboard.directives.timewindow`) in src/app/components/timewindow.directive.js:32.
 * The duration as the plural messages `timewindow.days/hours/minutes/seconds` (MessageFormat, see LegacyTranslateCompiler);
 * a lone single unit drops its count ("day", as in "last day"). Also called from code (tb-timewindow).
 */
@Pipe({ name: 'milliSecondsToTimeString', standalone: true })
export class MilliSecondsToTimeStringPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(millseconds?: any, ...rest: any[]): any {
    var seconds: any = Math.floor(millseconds / 1000);
    var days: any = Math.floor(seconds / 86400);
    var hours: any = Math.floor((seconds % 86400) / 3600);
    var minutes: any = Math.floor(((seconds % 86400) % 3600) / 60);
    seconds = seconds % 60;
    var timeString: any = '';
    if (days > 0) timeString += this.translate.instant('timewindow.days', {days: days});
    if (hours > 0) {
        if (timeString.length === 0 && hours === 1) {
            hours = 0;
        }
        timeString += this.translate.instant('timewindow.hours', {hours: hours});
    }
    if (minutes > 0) {
        if (timeString.length === 0 && minutes === 1) {
            minutes = 0;
        }
        timeString += this.translate.instant('timewindow.minutes', {minutes: minutes});
    }
    if (seconds > 0) {
        if (timeString.length === 0 && seconds === 1) {
            seconds = 0;
        }
        timeString += this.translate.instant('timewindow.seconds', {seconds: seconds});
    }
    return timeString;
  }
}
