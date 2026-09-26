import { Component, forwardRef, inject } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { TbMenuLinkDirective } from '../tb-menu-link/tb-menu-link.directive';

/**
 * Ported from the AngularJS directive `tbSideMenu` (module `thingsboard.directives.sideMenu`) in src/app/components/side-menu.directive.js:27.
 */
@Component({
  selector: 'tb-side-menu',
  standalone: true,
  imports: [CommonModule, forwardRef(() => TbMenuLinkDirective)],
  templateUrl: './tb-side-menu.directive.html',
})
export class TbSideMenuDirective {
  protected readonly menu = inject(MenuService);

  sections: any;

  constructor() {
    this.sections = this.menu.getSections();
  }

  /**
   * The legacy template's `isOpen(section)`: the directive's isolate scope (`scope: {}`)
   * never defined it, so it evaluated to undefined and `parentActive` was never set.
   */
  isOpen(_section: any): boolean {
    return false;
  }
}
