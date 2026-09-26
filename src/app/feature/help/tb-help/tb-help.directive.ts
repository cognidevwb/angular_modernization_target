import { ComponentRef, DestroyRef, Directive, ElementRef, ViewContainerRef, afterNextRender, effect, inject, input } from '@angular/core';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';

/**
 * Ported from the AngularJS directive `tbHelp` (module `thingsboard.directives.help`) in src/app/help/help.directive.js:
 * adds the help icon button (tooltip "help.goto-help-page") to the host element — or to the element with id
 * `help-container-id` inside it — which opens the help page of `tbHelp` (a key of helpLinks.linksMap, or a URL)
 * in a new window.
 */
@Directive({
  selector: '[tb-help]',
  standalone: true,
})
export class TbHelpDirective {
  readonly helpLinkId = input<any>(undefined, { alias: 'tbHelp' });

  private readonly element = inject(ElementRef);
  private readonly viewContainer = inject(ViewContainerRef);
  private helpButton: ComponentRef<TbGridHelpButtonComponent> | null = null;

  constructor() {
    afterNextRender(() => this.attachHelpButton());
    effect(() => {
      const helpLinkId = this.helpLinkId();
      this.helpButton?.setInput('helpId', helpLinkId);
    });
    inject(DestroyRef).onDestroy(() => this.helpButton?.destroy());
  }

  private attachHelpButton(): void {
    const host: HTMLElement = this.element.nativeElement;
    const button = this.viewContainer.createComponent(TbGridHelpButtonComponent);
    button.setInput('helpId', this.helpLinkId());
    const containerId = host.getAttribute('help-container-id');
    const container = containerId ? host.querySelector(`[id="${containerId}"]`) : null;
    (container ?? host).appendChild(button.location.nativeElement);
    this.helpButton = button;
  }
}
