import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';

import { Router, RouterLink } from '@angular/router';
import { stateHref } from '../../../state-paths';
import { NospacePipe } from '../pipes/nospace.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbMenuLink` (module `thingsboard.directives.menuLink`) in src/app/components/menu-link.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-menu-link',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatButtonModule, NospacePipe, CommonModule, RouterLink],
  templateUrl: './tb-menu-link.directive.html',
})
export class TbMenuLinkDirective {
  readonly section = model<any>();

  protected readonly menu = inject(MenuService);
  protected readonly element = inject(ElementRef);
  protected readonly router = inject(Router);
  protected readonly stateHref = stateHref;
  // TODO(port): template: 1 × ui-sref-active-eq left in place

  sectionActive: any;
  sectionHeight: any;

  constructor() {
    if (this.section().type !== 'link') {
            const parentNode: any = this.element.nativeElement.parentNode.parentNode.parentNode;
            if (parentNode.classList.contains('parent-list-item')) {
                const heading: any = parentNode.querySelector('h2');
                this.element.nativeElement.firstChild.setAttribute('aria-describedby', heading.id);
            }

            this.sectionActive = () => {
                return this.menu.sectionActive(this.section());
            };

            this.sectionHeight = () => {
                return this.menu.sectionHeight(this.section());
            };
        }
  }
}
