import { Component } from '@angular/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS controller `DashboardCardController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'dashboard-card',
  standalone: true,
  template: '', // TODO(port): this controller's screen template is the templateUrl of its route in the legacy router
})
export class DashboardCardComponent {
  protected readonly typesRef: any = types;

  types: any;

  constructor() {
    this.types = this.typesRef;
  }
}
