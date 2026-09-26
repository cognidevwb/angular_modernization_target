import { Component, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MenuService } from '../../services/menu.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS controller `HomeLinksController` (module `thingsboard.homeLinks`) in src/app/home/index.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'home-links',
  standalone: true,
  imports: [MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './home-links.component.html',
})
export class HomeLinksComponent {
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly menu = inject(MenuService);
  // TODO(port): elements not resolved to a component: md-grid-list, md-grid-tile
  // TODO(port): template: 2 × md-grid-list left in place
  // TODO(port): template: 2 × md-grid-tile left in place
  // TODO(port): template: 1 × ui-sref left in place

  model: any;
  cols: any;

  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    this.sectionColspan = this.sectionColspan;
    $scope.$watch(() => { return this.breakpoints.isMatched('lg'); }, () => {
        this.updateColumnCount();
    });
    $scope.$watch(() => { return this.breakpoints.isMatched('gt-lg'); }, () => {
        this.updateColumnCount();
    });
    this.updateColumnCount();
    this.model = this.menu.getHomeSections();
  }

  updateColumnCount(...rest: any[]): any {
    this.cols = 2;
    if (this.breakpoints.isMatched('lg')) {
        this.cols = 3;
    }
    if (this.breakpoints.isMatched('gt-lg')) {
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
