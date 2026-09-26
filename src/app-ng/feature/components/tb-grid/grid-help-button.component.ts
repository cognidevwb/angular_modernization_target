import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { helpLinks } from '../../help/constants/help-links';

/**
 * The help button `tb-help="'devices'"` put in the grid's details header and in the add dialogs:
 * opens the help page of `helpId` (a key of helpLinks.linksMap, or a URL) in a new window.
 */
@Component({
  selector: 'tb-grid-help',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatTooltipModule, TranslatePipe],
  template: `
    <button mat-icon-button type="button" class="tb-help-button-style tb-help-button-pos" (click)="gotoHelpPage($event)"
            [matTooltip]="'help.goto-help-page' | translate" matTooltipPosition="above">
      <mat-icon class="material-icons">help</mat-icon>
    </button>
  `,
})
export class TbGridHelpButtonComponent {
  readonly helpId = input<string>();

  gotoHelpPage($event?: Event): void {
    $event?.stopPropagation();
    const id = this.helpId();
    let helpUrl: string | undefined = id ? (helpLinks.linksMap as Record<string, string>)[id] : undefined;
    if (!helpUrl && id && (id.startsWith('http://') || id.startsWith('https://'))) {
      helpUrl = id;
    }
    if (helpUrl) {
      window.open(helpUrl, '_blank');
    }
  }
}
