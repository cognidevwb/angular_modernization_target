import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input, output, effect } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import $ from 'jquery';

// Mirrors the legacy factory's closure-scoped counter, shared by every directive instance.
let uniqueId = 1;

/**
 * Ported from the AngularJS directive `tbExpandFullscreen` (module `thingsboard.directives.expandFullscreen`)
 * in src/app/components/expand-fullscreen.directive.js:20.
 *
 * Moves the host element into a body-level fullscreen parent while expanded, and renders the
 * expand/restore button (into `#expand-button-id` inside the host when given, else prepended).
 * Legacy `&` bindings are inputs here: `[tbExpandFullscreen]` (expanded from outside),
 * `[hideExpandButton]`, `[fullscreenZindex]`; `(onFullscreenChanged)` emits `{expanded}`.
 */
@Directive({
  selector: '[tb-expand-fullscreen],[tbExpandFullscreen]',
  standalone: true,
})
export class TbExpandFullscreenDirective implements AfterViewInit, OnDestroy {
  readonly expand = input<any>(undefined, { alias: 'tbExpandFullscreen' });
  readonly hideExpandButton = input<any>(false);
  readonly fullscreenZindex = input<any>(undefined);
  readonly backgroundStyle = input<any>(undefined, { alias: 'fullscreenBackgroundStyle' });
  readonly expandButtonId = input<string | undefined>(undefined, { alias: 'expand-button-id' });
  readonly expandButtonSize = input<string | undefined>(undefined, { alias: 'expand-button-size' });
  readonly onFullscreenChanged = output<{ expanded: boolean }>();

  protected readonly document = inject(DOCUMENT);
  protected readonly element = inject(ElementRef);
  protected readonly translate = inject(TranslateService);

  private readonly fullscreenParent: JQuery<HTMLElement>;
  private elementParent: JQuery<HTMLElement> | null = null;
  private expandedValue = false;
  private button: JQuery<HTMLElement> | null = null;

  constructor() {
    const body = $(this.document.body);
    const fullscreenParentId = 'fullscreen-parent' + uniqueId;
    const existing = $('#' + fullscreenParentId, body);
    if (!existing.length) {
      uniqueId++;
      body.append($('<div id="' + fullscreenParentId + '" class="tb-fullscreen-parent"></div>'));
      this.fullscreenParent = $('#' + fullscreenParentId, body);
      this.fullscreenParent.css('display', 'none');
    } else {
      this.fullscreenParent = existing;
    }
    // `scope.$watch(scope.expand, v => scope.expanded = v)`
    effect(() => {
      const newExpanded = this.expand();
      if (newExpanded !== undefined) {
        this.expanded = !!newExpanded;
      }
    });
  }

  get expanded(): boolean {
    return this.expandedValue;
  }

  set expanded(value: boolean) {
    if (value == this.expandedValue) {
      return;
    }
    this.expandedValue = value;
    this.applyExpanded();
  }

  ngAfterViewInit(): void {
    const buttonId = this.expandButtonId();
    if (buttonId) {
      setTimeout(() => {
        const expandButton = $('#' + buttonId, $(this.element.nativeElement))[0];
        this.renderExpandButton(expandButton);
      });
    } else {
      this.renderExpandButton();
    }
  }

  ngOnDestroy(): void {
    this.fullscreenParent.remove();
  }

  toggleExpand = ($event?: Event): void => {
    if ($event) {
      $event.stopPropagation();
    }
    this.expanded = !this.expanded;
  };

  private zIndex(): string {
    const z = this.fullscreenZindex();
    return z ? String(z) : '70';
  }

  private applyExpanded(): void {
    const element = $(this.element.nativeElement);
    if (this.expandedValue) {
      this.elementParent = element.parent();
      element.detach();
      const style = this.backgroundStyle();
      if (style) {
        this.fullscreenParent.css(style);
      }
      this.fullscreenParent.append(element);
      this.fullscreenParent.css('display', '');
      this.fullscreenParent.css('z-index', this.zIndex());
      element.addClass('tb-fullscreen');
    } else {
      if (this.elementParent) {
        element.detach();
        this.elementParent.append(element);
        this.elementParent = null;
      }
      element.removeClass('tb-fullscreen');
      this.fullscreenParent.css('display', 'none');
      this.fullscreenParent.css('z-index', '');
    }
    this.updateButton();
    this.onFullscreenChanged.emit({ expanded: this.expandedValue });
  }

  /** The legacy md-tooltip + ng-md-icon, as a title and a Material icon glyph. */
  private updateButton(): void {
    if (!this.button) {
      return;
    }
    const icon = this.expandedValue ? 'fullscreen_exit' : 'fullscreen';
    const title = this.translate.instant(this.expandedValue ? 'fullscreen.exit' : 'fullscreen.expand');
    this.button.attr('title', title);
    this.button.find('.tb-expand-fullscreen-icon').text(icon);
  }

  private iconHtml(): string {
    const size = this.expandButtonSize();
    const style = size ? ' style="font-size: ' + size + 'px; width: ' + size + 'px; height: ' + size + 'px;"' : '';
    return '<span class="material-icons tb-expand-fullscreen-icon"' + style + '></span>';
  }

  private renderExpandButton(expandButton?: HTMLElement): void {
    if (expandButton) {
      const button = $(expandButton);
      if (this.hideExpandButton()) {
        button.remove();
      } else {
        button.append(this.iconHtml());
        button.on('click', this.toggleExpand);
        this.button = button;
      }
    } else if (!this.hideExpandButton()) {
      const button = $('<button type="button" class="mat-mdc-icon-button mdc-icon-button tb-fullscreen-button-style tb-fullscreen-button-pos">' +
        this.iconHtml() + '</button>');
      button.on('click', this.toggleExpand);
      $(this.element.nativeElement).prepend(button);
      this.button = button;
    }
    this.updateButton();
  }
}
