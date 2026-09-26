import { Directive, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { helpLinks } from '../constants/help-links';
import { linkAttrs } from '../../../legacy-link';
import $ from 'jquery';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $window: any;

/**
 * Ported from the AngularJS directive `tbHelp` (module `thingsboard.directives.help`) in src/app/help/help.directive.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-help]',
  standalone: true,
})
export class TbHelpDirective {
  readonly helpLinkId = model<any>(undefined, { alias: 'tbHelp' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly element = inject(ElementRef);

  protected html: any = '<md-tooltip md-direction="top">' +
            '{{\'help.goto-help-page\' | translate}}' +
            '</md-tooltip>' +
            '<md-icon class="material-icons">' +
                'help' +
            '</md-icon>';
  protected helpButton: any;

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.helpButton = $('<md-button class="tb-help-button-style tb-help-button-pos md-icon-button" ' +
            'ng-click="gotoHelpPage($event)">' +
            this.html +
            '</md-button>');
    if (this.attrs.helpContainerId) {
            var helpContainer: any = $('#' + this.attrs.helpContainerId, $(this.element.nativeElement))[0];
            helpContainer = $(helpContainer);
            helpContainer.append(this.helpButton);
            (this.element.nativeElement as HTMLElement).appendChild(helpContainer[0]);
        } else {
            (this.element.nativeElement as HTMLElement).appendChild(this.helpButton[0]);
            $(this.element.nativeElement).append(this.helpButton);
        }
  }

  gotoHelpPage($event?: any, ...rest: any[]): any {
    if ($event) {
        $event.stopPropagation();
    }
    var helpUrl: any = helpLinks.linksMap[this.helpLinkId()];
    if (!helpUrl && this.helpLinkId() &&
            (this.helpLinkId().startsWith('http://') || this.helpLinkId().startsWith('https://'))) {
        helpUrl = this.helpLinkId();
    }
    if (helpUrl) {
        window.open(helpUrl, '_blank');
    }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
