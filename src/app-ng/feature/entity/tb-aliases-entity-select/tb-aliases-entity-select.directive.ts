import { Component, inject, model } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { linkAttrs } from '../../../legacy-link';
import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { RootState } from '../../../root-state';

/**
 * Ported from the AngularJS directive `tbAliasesEntitySelect` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-aliases-entity-select',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatIconModule, MatButtonModule],
  templateUrl: './tb-aliases-entity-select.directive.html',
})
export class TbAliasesEntitySelectDirective {
  readonly aliasController = model<any>();

  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly overlay = inject(Overlay);
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);

  tooltipDirection: any;
  disabled: any;
  displayValue: any;

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.tooltipDirection = (this.attrs.tooltipDirection !== undefined) ? this.attrs.tooltipDirection : 'top';
    this.rootScope.$on('entityAliasesChanged', () => {
            this.updateView();
        });
    this.rootScope.$on('entityAliasResolved', () => {
            this.updateView();
        });
  }

  openEditMode(event?: any, ...rest: any[]): any {
    let vm = this;
    if (this.disabled) {
        return;
    }
    var position: any;
    var panelHeight: any = (this.breakpoints as any)('min-height: 350px') ? 250 : 150;
    var panelWidth: any = 300;
    var offset: any = this.element.nativeElement.getBoundingClientRect();
    var bottomY: any = offset.bottom - $(window).scrollTop(); //eslint-disable-line
    var leftX: any = offset.left - $(window).scrollLeft(); //eslint-disable-line
    var yPosition: any;
    var xPosition: any;
    if (bottomY + panelHeight > $( window ).height()) { //eslint-disable-line
        yPosition = (this.overlay as any).yPosition.ABOVE;
    } else {
        yPosition = (this.overlay as any).yPosition.BELOW;
    }
    if (leftX + panelWidth > $( window ).width()) { //eslint-disable-line
        xPosition = (this.overlay as any).xPosition.CENTER;
    } else {
        xPosition = (this.overlay as any).xPosition.ALIGN_START;
    }
    position = (this.overlay as any).newPanelPosition()
        .relativeTo($(this.element.nativeElement))
        .addPanelPosition(xPosition, yPosition);
    var config: any = {
        attachTo: $(this.document.body),
        controller: 'AliasesEntitySelectPanelController',
        controllerAs: 'vm',
        // TODO(port): supply a ported AliasesEntitySelectPanelComponent template here
        panelClass: 'tb-aliases-entity-select-panel',
        position: position,
        fullscreen: false,
        locals: {
            'aliasController': this.aliasController(),
            'onEntityAliasesUpdate': (...rest: any[]) => {
                this.updateView();
            }
        },
        openFrom: event,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: false
    };
    (this.overlay as any).open(config);
  }

  updateView(...rest: any[]): any {
    this.updateDisplayValue();
  }

  updateDisplayValue(...rest: any[]): any {
    var displayValue: any;
    var singleValue: any = true;
    var currentAliasId: any;
    var entityAliases: any = this.aliasController().getEntityAliases();
    for (var aliasId in entityAliases) {
        var entityAlias: any = entityAliases[aliasId];
        if (!entityAlias.filter.resolveMultiple) {
            var resolvedAlias: any = this.aliasController().getInstantAliasInfo(aliasId);
            if (resolvedAlias && resolvedAlias.currentEntity) {
                if (!currentAliasId) {
                    currentAliasId = aliasId;
                } else {
                    singleValue = false;
                    break;
                }
            }
        }
    }
    if (singleValue && currentAliasId) {
        var aliasInfo: any = this.aliasController().getInstantAliasInfo(currentAliasId);
        displayValue = aliasInfo.currentEntity.name;
    } else {
        displayValue = this.translate.instant('entity.entities');
    }
    this.displayValue = displayValue;
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
