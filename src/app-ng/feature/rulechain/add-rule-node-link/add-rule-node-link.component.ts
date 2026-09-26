import { Component, forwardRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { helpLinks } from '../../help/constants/help-links';
import { FormsModule } from '@angular/forms';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbRuleNodeLinkDirective } from '../tb-rule-node-link/tb-rule-node-link.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `AddRuleNodeLinkController` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'add-rule-node-link',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbHelpDirective), forwardRef(() => TbRuleNodeLinkDirective)],
  templateUrl: './add-rule-node-link.component.html',
})
export class AddRuleNodeLinkComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  protected readonly helpLinksRef: any = helpLinks;

  helpLinks: any;
  link: any;
  labels: any;
  allowCustomLabels: any;
  theForm: any;

  constructor() {
    this.helpLinks = this.helpLinksRef;
    this.link = this.dialogData.link;
    this.labels = this.dialogData.labels;
    this.allowCustomLabels = this.dialogData.allowCustomLabels;
    this.add = this.add;
    this.cancel = this.cancel;
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  add = (...rest: any[]): any => {
    this.theForm.$setPristine();
    this.dialog.hide(this.link);
  };
}
