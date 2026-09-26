import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { UtilsService } from '../../common/services/utils.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbSocialSharePanel` (module `thingsboard.directives.socialsharePanel`) in src/app/components/socialshare-panel.directive.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-social-share-panel',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatIconModule, MatButtonModule],
  templateUrl: './tb-social-share-panel.directive.html',
})
export class TbSocialSharePanelDirective {
  readonly shareTitle = input<any>();
  readonly shareText = input<any>();
  readonly shareLink = input<any>();
  readonly shareHashTags = input<any>();

  protected readonly utils = inject(UtilsService);

  isShareLinkLocal(...rest: any[]): any {
    if (this.shareLink() && this.shareLink().length > 0) {
        return this.utils.isLocalUrl(this.shareLink());
    } else {
        return true;
    }
    return undefined;
  }
}
