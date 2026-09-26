import { Component, forwardRef, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { helpLinks } from '../../help/constants/help-links';
import { FormsModule } from '@angular/forms';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbRuleNodeDirective } from '../tb-rule-node/tb-rule-node.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `AddRuleNodeController` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'add-rule-node',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbHelpDirective), forwardRef(() => TbRuleNodeDirective)],
  templateUrl: './add-rule-node.component.html',
})
export class AddRuleNodeComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  protected readonly helpLinksRef: any = helpLinks;

  helpLinks: any;
  ruleNode: any;
  ruleChainId: any;
  theForm: any;

  constructor() {
    this.helpLinks = this.helpLinksRef;
    this.ruleNode = this.dialogData.ruleNode;
    this.ruleChainId = this.dialogData.ruleChainId;
    this.add = this.add;
    this.cancel = this.cancel;
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  add = (...rest: any[]): any => {
    this.theForm.$setPristine();
    this.dialog.hide(this.ruleNode);
  };
}
