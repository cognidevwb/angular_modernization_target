import { Pipe, PipeTransform } from '@angular/core';

/**
 * Ported from the AngularJS filter `keyboardShortcut` (module `thingsboard.filters.keyboardShortcut`) in src/app/components/keyboard-shortcut.filter.js:16.
 * Scaffolded by the playbook. Same name, so templates that wrote `| keyboardShortcut` keep working once this pipe is imported.
 */
@Pipe({ name: 'keyboardShortcut', standalone: true })
export class KeyboardShortcutPipe implements PipeTransform {
  transform(str?: any, ...rest: any[]): any {
    if (!str) return undefined;
    var keys: any = str.split('-');
    var isOSX: any = /Mac OS X/.test(window.navigator.userAgent);

    var seperator: any = (!isOSX || keys.length > 2) ? '+' : '';

    var abbreviations: any = {
        M: isOSX ? '⌘' : 'Ctrl',
        A: isOSX ? 'Option' : 'Alt',
        S: 'Shift'
    };

    return keys.map(function(key?: any, index?: any) {
        var last: any = index == keys.length - 1;
        return last ? key : abbreviations[key];
    }).join(seperator);
  }
}
