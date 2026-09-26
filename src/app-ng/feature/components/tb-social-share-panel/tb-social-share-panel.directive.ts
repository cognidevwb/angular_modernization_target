import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function SocialsharePanelController(this: any, utils?: any) {

    let vm: any = this;

    vm.isShareLinkLocal = function() {
        if (vm.shareLink && vm.shareLink.length > 0) {
            return utils.isLocalUrl(vm.shareLink);
        } else {
            return true;
        }
        return undefined;
    }

}

/**
 * Ported from the AngularJS directive `tbSocialSharePanel` (module `thingsboard.directives.socialsharePanel`) in src/app/components/socialshare-panel.directive.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
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

  restrict: any = "E";
  bindToController: any = {
            shareTitle: '@',
            shareText: '@',
            shareLink: '@',
            shareHashTags: '@'
        };
  controller: any = SocialsharePanelController;
  controllerAs: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }

  protected isShareLinkLocal(): boolean {
    const link = this.shareLink();
    if (link && link.length > 0) {
      try {
        const url = new URL(link, window.location.href);
        return url.origin === window.location.origin;
      } catch {
        return true;
      }
    }
    return true;
  }
}
