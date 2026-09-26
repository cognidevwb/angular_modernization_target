import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `milliSecondsToTimeString` (module `thingsboard.directives.timewindow`) in src/app/components/timewindow.directive.js:32.
 * Scaffolded by the playbook. Same name, so templates that wrote `| milliSecondsToTimeString` keep working once this pipe is imported.
 */
@Pipe({ name: 'milliSecondsToTimeString', standalone: true })
export class MilliSecondsToTimeStringPipe implements PipeTransform {
  transform(millseconds?: any, ...rest: any[]): any {
    var seconds: any = Math.floor(millseconds / 1000);
    var days: any = Math.floor(seconds / 86400);
    var hours: any = Math.floor((seconds % 86400) / 3600);
    var minutes: any = Math.floor(((seconds % 86400) % 3600) / 60);
    seconds = seconds % 60;
    var timeString: any = '';
    if (days > 0) timeString += (this as any).translate.instant('timewindow.days', {days: days}, 'messageformat');
    if (hours > 0) {
        if (timeString.length === 0 && hours === 1) {
            hours = 0;
        }
        timeString += (this as any).translate.instant('timewindow.hours', {hours: hours}, 'messageformat');
    }
    if (minutes > 0) {
        if (timeString.length === 0 && minutes === 1) {
            minutes = 0;
        }
        timeString += (this as any).translate.instant('timewindow.minutes', {minutes: minutes}, 'messageformat');
    }
    if (seconds > 0) {
        if (timeString.length === 0 && seconds === 1) {
            seconds = 0;
        }
        timeString += (this as any).translate.instant('timewindow.seconds', {seconds: seconds}, 'messageformat');
    }
    return timeString;
  }
}
