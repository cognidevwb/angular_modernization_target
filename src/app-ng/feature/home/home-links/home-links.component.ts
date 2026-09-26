import { mdMedia } from '../../../core/md-media';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuService } from '../../services/menu.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router, RouterLink } from '@angular/router';
import { stateHref } from '../../../state-paths';

/**
 * Ported from the AngularJS controller `HomeLinksController` (module `thingsboard.homeLinks`) in src/app/home/index.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'home-links',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatCardModule, MatButtonModule, MatGridListModule, RouterLink],
  templateUrl: './home-links.component.html',
})
export class HomeLinksComponent {
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly menu = inject(MenuService);
  protected readonly router = inject(Router);
  protected readonly stateHref = stateHref;
  // TODO(port): elements not resolved to a component: md-grid-list, md-grid-tile
  // TODO(port): template: 2 × md-grid-list left in place
  // TODO(port): template: 2 × md-grid-tile left in place
  // TODO(port): template: 1 × ui-sref left in place

  model: any;
  cols: any;

  constructor() {
    this.sectionColspan = this.sectionColspan;
    this.breakpoints.observe([mdMedia('lg'), mdMedia('gt-lg')]).pipe(takeUntilDestroyed()).subscribe(() => {
      this.updateColumnCount();
    });
    this.updateColumnCount();
    this.model = this.menu.getHomeSections();
  }

  updateColumnCount(...rest: any[]): any {
    this.cols = 2;
    if (this.breakpoints.isMatched(mdMedia('lg'))) {
        this.cols = 3;
    }
    if (this.breakpoints.isMatched(mdMedia('gt-lg'))) {
        this.cols = 4;
    }
  }

  sectionColspan = (section?: any, ...rest: any[]): any => {
    var colspan: any = this.cols;
    if (section && section.places && section.places.length <= colspan) {
        colspan = section.places.length;
    }
    return colspan;
  };
}
