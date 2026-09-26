import { Component, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';

import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { stateHref } from '../../../state-paths';
import { NospacePipe } from '../pipes/nospace.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbMenuLink` (module `thingsboard.directives.menuLink`) in src/app/components/menu-link.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; The link function picked one of two templates by `section.type` (menu-link.tpl.html for a link, menu-toggle.tpl.html otherwise); the template does the same with @if.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-menu-link',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatButtonModule, NospacePipe, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './tb-menu-link.directive.html',
})
export class TbMenuLinkDirective {
  readonly section = model<any>();

  protected readonly menu = inject(MenuService);
  protected readonly element = inject(ElementRef);
  protected readonly router = inject(Router);
  protected readonly stateHref = stateHref;

  /** The legacy link function's accessibility step: a toggle under a titled group names that heading. */
  ngAfterViewInit(): void {
    if (this.section()?.type !== 'link') {
      const parentNode: any = this.element.nativeElement.parentNode?.parentNode?.parentNode;
      if (parentNode?.classList?.contains('parent-list-item')) {
        const heading: any = parentNode.querySelector('h2');
        if (heading) {
          this.element.nativeElement.firstElementChild?.setAttribute('aria-describedby', heading.id);
        }
      }
    }
  }

  sectionActive(): any {
    return this.menu.sectionActive(this.section());
  }

  sectionHeight(): any {
    return this.menu.sectionHeight(this.section());
  }
}
