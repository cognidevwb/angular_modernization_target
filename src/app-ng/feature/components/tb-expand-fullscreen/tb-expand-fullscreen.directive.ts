import { Directive, inject, model, output, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { linkAttrs } from '../../../legacy-link';
import $ from 'jquery';
import { TranslateService } from '@ngx-translate/core';

// `uniqueId` mirrors the legacy factory's closure-scoped counter, shared by every directive instance.
let uniqueId = 1;

/**
 * Ported from the AngularJS directive `tbExpandFullscreen` (module `thingsboard.directives.expandFullscreen`) in src/app/components/expand-fullscreen.directive.js:20.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 6 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-expand-fullscreen]',
  standalone: true,
})
export class TbExpandFullscreenDirective {
  readonly expand = output<any>({ alias: 'tbExpandFullscreen' });
  readonly hideExpandButton = output<any>({ alias: 'hideExpandButton' });
  readonly onFullscreenChanged = output<any>({ alias: 'onFullscreenChanged' });
  readonly fullscreenZindex = output<any>({ alias: 'fullscreenZindex' });
  readonly backgroundStyle = model<any>(undefined, { alias: 'fullscreenBackgroundStyle' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  protected readonly element = inject(ElementRef);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly translate = inject(TranslateService);

  body: any;
  fullscreenParentId: any = 'fullscreen-parent' + uniqueId;
  fullscreenParent: any;
  elementParent: any = null;
  expanded: any = false;
  protected buttonSize: any;
  protected tooltipDirection: any;
  protected html: any;
  $watch: any;

  // TODO(port): `scope.expand(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): `scope.fullscreenZindex(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): `scope.fullscreenZindex` was an optional callback; an output is always there, so its check reads `true`
  // TODO(port): `scope.hideExpandButton(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): `scope.onFullscreenChanged` was an optional callback; an output is always there, so its check reads `true`
  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.body = $($(this.document).find('body').eq(0));
    this.fullscreenParent = $('#' + this.fullscreenParentId, this.body)[0];
    if (!this.fullscreenParent) {
            uniqueId++;
            var fullscreenParent: any = $('<div id=\'' + this.fullscreenParentId + '\' class=\'tb-fullscreen-parent\'></div>');
            this.body.append(fullscreenParent);
            this.fullscreenParent = $('#' + this.fullscreenParentId, this.body)[0];
            this.fullscreenParent = $(this.fullscreenParent);
            this.fullscreenParent.css('display', 'none');
        } else {
            this.fullscreenParent = $(this.fullscreenParent);
        }
    this.destroyRef.onDestroy(() => {
            this.fullscreenParent.remove();
        });
    // TODO(port): `fullscreenZindex` is an input; a value assigned here belongs in the template or a computed()
  this.fullscreenZindex = (this.fullscreenZindex as any).emit(undefined);
    if (!true) {
            this.fullscreenZindex = '70' as any;
        }
    let prevExpanded: any;
    effect(() => {
      const newExpanded: any = this.expanded;
      if (newExpanded != prevExpanded) {
        prevExpanded = newExpanded;
        if (this.expanded) {
          this.elementParent = $(this.element.nativeElement).parent();
          $(this.element.nativeElement).detach();
          if (this.backgroundStyle()) {
            this.fullscreenParent.css(this.backgroundStyle());
          }
          this.fullscreenParent.append($(this.element.nativeElement));
          this.fullscreenParent.css('display', '');
          this.fullscreenParent.css('z-index', this.fullscreenZindex);
          $(this.element.nativeElement).addClass('tb-fullscreen');
        } else {
          if (this.elementParent) {
            $(this.element.nativeElement).detach();
            this.elementParent.append($(this.element.nativeElement));
            this.elementParent = null;
          }
          $(this.element.nativeElement).removeClass('tb-fullscreen');
          this.fullscreenParent.css('display', 'none');
          this.fullscreenParent.css('z-index', '');
        }
        if (true) {
          this.onFullscreenChanged.emit({expanded: this.expanded});
        }
      }
    });
    effect(() => {
      const newExpanded: any = this.expand.emit(undefined);
      this.expanded = newExpanded;
    });
    if (this.attrs.expandButtonSize) {
            this.buttonSize = this.attrs.expandButtonSize;
        }
    this.tooltipDirection = (this.attrs.expandTooltipDirection !== undefined) ? this.attrs.expandTooltipDirection : 'top';
    this.html = '<md-tooltip md-direction="' + (this.expanded ? 'bottom' : this.tooltipDirection) + '">' +
            this.translate.instant(this.expanded ? 'fullscreen.exit' : 'fullscreen.expand') +
            '</md-tooltip>' +
            '<ng-md-icon ' + (this.buttonSize ? 'size="'+ this.buttonSize +'" ' : '') + 'icon="' + (this.expanded ? 'fullscreen_exit' : 'fullscreen') + '" ' +
            'options=\'{"easing": "circ-in-out", "duration": 375, "rotation": "none"}\'>' +
            '</ng-md-icon>';
    if (this.attrs.expandButtonId) {
            setTimeout(() => {
               var expandButton: any = $('#' + this.attrs.expandButtonId, $(this.element.nativeElement))[0];
                this.renderExpandButton(expandButton);
            });
        } else {
            this.renderExpandButton();
        }
  }

  toggleExpand = ($event?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    this.expanded = !this.expanded;
  };

  renderExpandButton(expandButton?: any, ...rest: any[]): any {
    if (expandButton) {
        expandButton = $(expandButton);
        if ((this.hideExpandButton as any)()) {
            expandButton.remove();
        } else {
            expandButton.attr('md-ink-ripple', 'false');
            expandButton.append(this.html);

            expandButton.on("click", this.toggleExpand);
        }
    } else if (!(this.hideExpandButton as any)()) {
        var button: any = $('<md-button class="tb-fullscreen-button-style tb-fullscreen-button-pos md-icon-button" ' +
            'md-ink-ripple="false">' +
            this.html +
            '</md-button>');

        button.on('click', this.toggleExpand);

        $(this.element.nativeElement).prepend(button);
    }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
