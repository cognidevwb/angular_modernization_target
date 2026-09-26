import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ElementRef, InjectionToken, Injector, Type } from '@angular/core';

/** What an `$mdPanel` panel controller received: its `locals`, plus `mdPanelRef` to close itself. */
export const MD_PANEL_DATA = new InjectionToken<any>('MD_PANEL_DATA');

/** The `mdPanelRef` a panel controller closed itself with. */
export interface MdPanelRef {
  close(): void;
  readonly overlayRef: OverlayRef;
}

export type MdPanelXPosition = 'ALIGN_START' | 'ALIGN_END' | 'CENTER';
export type MdPanelYPosition = 'BELOW' | 'ABOVE';

export interface MdPanelConfig {
  /** The element the panel is positioned relative to (`newPanelPosition().relativeTo(element)`). */
  origin: ElementRef | HTMLElement;
  component: Type<unknown>;
  panelClass: string;
  locals: Record<string, any>;
  xPosition: MdPanelXPosition;
  yPosition: MdPanelYPosition;
  /** `fullscreen: true` with an absolute top-left position: the panel covers the viewport (small screens). */
  fullscreen?: boolean;
  /** Called once the panel closed (outside click, Escape, or `mdPanelRef.close()`). */
  onClose?: () => void;
}

/**
 * `$mdPanel.open(config)` with `clickOutsideToClose` + `escapeToClose`, over the CDK overlay:
 * the panel component is attached next to `origin` at the given `$mdPanel` x/y position and
 * reads its locals (and `mdPanelRef`) from `MD_PANEL_DATA`.
 */
export function openMdPanel(overlay: Overlay, parent: Injector, config: MdPanelConfig): MdPanelRef {
  const overlayX = config.xPosition === 'ALIGN_END' ? 'end' : config.xPosition === 'CENTER' ? 'center' : 'start';
  const preferred: ConnectedPosition = config.yPosition === 'ABOVE'
    ? { originX: overlayX, originY: 'top', overlayX, overlayY: 'bottom' }
    : { originX: overlayX, originY: 'bottom', overlayX, overlayY: 'top' };
  const flipped: ConnectedPosition = {
    ...preferred,
    originY: preferred.originY === 'top' ? 'bottom' : 'top',
    overlayY: preferred.overlayY === 'top' ? 'bottom' : 'top',
  };
  const positionStrategy = config.fullscreen
    ? overlay.position().global().top('0').left('0')
    : overlay.position().flexibleConnectedTo(config.origin).withPositions([preferred, flipped]);
  const overlayRef = overlay.create({
    positionStrategy,
    panelClass: ['md-panel', config.panelClass],
    ...(config.fullscreen ? { width: '100%', height: '100%' } : {}),
    hasBackdrop: true,
    backdropClass: 'cdk-overlay-transparent-backdrop',
    scrollStrategy: overlay.scrollStrategies.reposition(),
  });
  let closed = false;
  const panelRef: MdPanelRef = {
    overlayRef,
    close: () => {
      if (!closed) {
        closed = true;
        overlayRef.dispose();
        config.onClose?.();
      }
    },
  };
  overlayRef.backdropClick().subscribe(() => panelRef.close());
  overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      panelRef.close();
    }
  });
  const injector = Injector.create({
    providers: [{ provide: MD_PANEL_DATA, useValue: { ...config.locals, mdPanelRef: panelRef } }],
    parent,
  });
  overlayRef.attach(new ComponentPortal(config.component, null, injector));
  return panelRef;
}

/** The legacy placement rule: open above when the panel would run off the bottom, end-aligned when off the right. */
export function mdPanelPlacement(element: HTMLElement, panelWidth: number, panelHeight: number,
                                 xFallback: MdPanelXPosition = 'ALIGN_END'): { xPosition: MdPanelXPosition; yPosition: MdPanelYPosition } {
  const offset = element.getBoundingClientRect();
  const yPosition: MdPanelYPosition = offset.bottom + panelHeight > window.innerHeight ? 'ABOVE' : 'BELOW';
  const xPosition: MdPanelXPosition = offset.left + panelWidth > window.innerWidth ? xFallback : 'ALIGN_START';
  return { xPosition, yPosition };
}
