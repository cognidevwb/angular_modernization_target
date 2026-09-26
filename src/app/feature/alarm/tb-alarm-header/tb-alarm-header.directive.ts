import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ElementRef } from '@angular/core';

/**
 * Ported from the AngularJS directive `tbAlarmHeader` (module `thingsboard.alarm`) in src/app/alarm/index.js:21.
 * Scaffolded by the playbook: the directive's linked template is now the component's own templateUrl.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-alarm-header]',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './tb-alarm-header.directive.html',
})
export class TbAlarmHeaderDirective {
  protected readonly element = inject(ElementRef);
}
