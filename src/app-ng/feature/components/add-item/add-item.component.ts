import { Component, inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { helpLinks } from '../../help/constants/help-links';

/**
 * Ported from the AngularJS controller `AddItemController` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'add-item',
  standalone: true,
  template: '', // TODO(port): this controller's screen template is the templateUrl of its route in the legacy router
})
export class AddItemComponent {
  protected readonly dialog = inject(MatDialog);
  protected readonly helpLinksRef: any = helpLinks;
  private readonly data: { saveItemFunction: (item: any) => Promise<any> } = inject(MAT_DIALOG_DATA);

  helpLinks: any;
  item: any = {};
  theForm: any;

  constructor() {
    this.helpLinks = this.helpLinksRef;
    this.add = this.add;
    this.cancel = this.cancel;
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  add = (...rest: any[]): any => {
    this.data.saveItemFunction(this.item).then((item?: any) => {
        this.item = item;
        this.theForm.$setPristine();
    (this.dialog as any).hide();
    });
  };
}
