import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { EventContentDialogComponent } from '../event-content-dialog/event-content-dialog.component';

/**
 * Ported from the AngularJS directive `tbEventRow` (module `thingsboard.event`) in src/app/event/index.js:23.
 * The four row templates the legacy link swapped in by `event-type` are the `@switch` arms of
 * tb-event-row.directive.html.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-event-row]',
  standalone: true,
  imports: [DatePipe, NgTemplateOutlet, TranslatePipe, MatButtonModule, MatIconModule, MatTooltipModule],
  templateUrl: './tb-event-row.directive.html',
})
export class TbEventRowDirective {
  readonly eventType = input<string>();
  readonly event = input<any>();

  protected readonly dialog = inject(MatDialog);
  protected readonly utils = inject(UtilsService);
  protected readonly types: any = types;

  /** Which row template the event type selects (legacy `getTemplate`). */
  protected rowKind(): 'lcEvent' | 'stats' | 'error' | 'debugRuleNode' | null {
    switch (this.eventType()) {
      case this.types.eventType.lcEvent.value:
        return 'lcEvent';
      case this.types.eventType.stats.value:
        return 'stats';
      case this.types.eventType.error.value:
        return 'error';
      case this.types.debugEventType.debugRuleNode.value:
      case this.types.debugEventType.debugRuleChain.value:
        return 'debugRuleNode';
      default:
        return null;
    }
  }

  showContent($event?: any, content?: any, title?: any, contentType?: any): void {
    var onShowingCallback: any = {
        onShowing: function () {}
    };
    if (!contentType) {
        contentType = null;
    }
    var sortedContent: any;
    try {
        sortedContent = JSON.stringify(this.utils.sortObjectKeys(JSON.parse(content)));
    }
    catch (err: any) {
        sortedContent = content;
    }
    this.dialog.open(EventContentDialogComponent, {
        data: {content: sortedContent, title: title, contentType: contentType, showingCallback: onShowingCallback},
        panelClass: 'tb-dialog'
    });
  }

  checkTooltip($event: MouseEvent): void {
    var el = $event.target as HTMLElement | null;
    if (el && el.offsetWidth < el.scrollWidth && !el.getAttribute('title')) {
        el.setAttribute('title', el.textContent ?? '');
    }
  }
}
