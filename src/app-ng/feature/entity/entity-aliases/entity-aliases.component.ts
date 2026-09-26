import { Component, forwardRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EntityService } from '../../api/services/entity.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntityFilterViewDirective } from '../tb-entity-filter-view/tb-entity-filter-view.directive';

import $ from 'jquery';
import entityAliasDialogTemplate from '../../../../app/entity/alias/entity-alias-dialog.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `EntityAliasesController` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'entity-aliases',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatSlideToggleModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbEntityFilterViewDirective)],
  templateUrl: './entity-aliases.component.html',
})
export class EntityAliasesComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly utils = inject(UtilsService);
  protected readonly entityService = inject(EntityService);
  protected readonly toast = inject(ToastService);
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): template: 1 × ng-form left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  types: any;
  entityAliases: any = [];
  title: any;
  disableAdd: any;
  aliasToWidgetsMap: any = {};
  allowedEntityTypes: any;
  theForm: any;
  entityAlias: any;

  constructor() {
    this.types = this.typesRef;
    this.title = this.dialogData.config.customTitle ? this.dialogData.config.customTitle : 'entity.aliases';
    this.disableAdd = this.dialogData.config.disableAdd;
    this.allowedEntityTypes = this.dialogData.config.allowedEntityTypes;
    this.addAlias = this.addAlias;
    this.editAlias = this.editAlias;
    this.removeAlias = this.removeAlias;
    this.cancel = this.cancel;
    this.save = this.save;
    this.initController();
  }

  initController(...rest: any[]): any {
    var aliasId: any;
    if (this.dialogData.config.widgets) {
        var widgetsTitleList: any, widget: any;
        if (this.dialogData.config.isSingleWidget && this.dialogData.config.widgets.length == 1) {
            widget = this.dialogData.config.widgets[0];
            widgetsTitleList = [widget.config.title];
            for (aliasId in this.dialogData.config.entityAliases) {
                this.aliasToWidgetsMap[aliasId] = widgetsTitleList;
            }
        } else {
            for (var w in this.dialogData.config.widgets) {
                widget = this.dialogData.config.widgets[w];
                if (widget.type === this.typesRef.widgetType.rpc.value) {
                    if (widget.config.targetDeviceAliasIds && widget.config.targetDeviceAliasIds.length > 0) {
                        var targetDeviceAliasId: any = widget.config.targetDeviceAliasIds[0];
                        widgetsTitleList = this.aliasToWidgetsMap[targetDeviceAliasId];
                        if (!widgetsTitleList) {
                            widgetsTitleList = [];
                            this.aliasToWidgetsMap[targetDeviceAliasId] = widgetsTitleList;
                        }
                        widgetsTitleList.push(widget.config.title);
                    }
                } else {
                    var datasources: any = this.utils.validateDatasources(widget.config.datasources);
                    for (var i: any=0;i<datasources.length;i++) {
                        var datasource: any = datasources[i];
                        if (datasource.type === this.typesRef.datasourceType.entity && datasource.entityAliasId) {
                            widgetsTitleList = this.aliasToWidgetsMap[datasource.entityAliasId];
                            if (!widgetsTitleList) {
                                widgetsTitleList = [];
                                this.aliasToWidgetsMap[datasource.entityAliasId] = widgetsTitleList;
                            }
                            widgetsTitleList.push(widget.config.title);
                        }
                    }
                }
            }
        }
    }

    for (aliasId in this.dialogData.config.entityAliases) {
        var entityAlias: any = this.dialogData.config.entityAliases[aliasId];
        var filter: any = entityAlias.filter;
        if (!filter) {
            filter = {
                resolveMultiple: false
            };
        }
        if (!filter.resolveMultiple) {
            filter.resolveMultiple = false;
        }
        var result: any = {id: aliasId, alias: entityAlias.alias, filter: filter};
        this.entityAliases.push(result);
    }
  }

  addAlias = ($event?: any, ...rest: any[]): any => {
    this.openAliasDialog($event);
  };

  editAlias = ($event?: any, entityAlias?: any, ...rest: any[]): any => {
    this.openAliasDialog($event, entityAlias);
  };

  openAliasDialog($event?: any, entityAlias?: any, ...rest: any[]): any {
    let vm = this;
    var isAdd: any = entityAlias ? false : true;
    var aliasIndex: any;
    if (!isAdd) {
        aliasIndex = this.entityAliases.indexOf(entityAlias);
    }
    this.dialog.show({
        controller: 'EntityAliasDialogController',
        controllerAs: 'vm',
        templateUrl: entityAliasDialogTemplate,
        locals: {
            isAdd: isAdd,
            allowedEntityTypes: this.allowedEntityTypes,
            entityAliases: this.entityAliases,
            alias: isAdd ? null : structuredClone(entityAlias)
        },
        parent: $(this.document.body),
        fullscreen: true,
        multiple: true,
        targetEvent: $event
    }).then((alias?: any) => {
        if (isAdd) {
            this.entityAliases.push(alias);
        } else {
            this.entityAliases[aliasIndex] = alias;
        }
        if (this.theForm) {
            this.theForm.$setDirty();
        }
    }, function () {
    });
  }

  removeAlias = ($event?: any, entityAlias?: any, ...rest: any[]): any => {
    var index: any = this.entityAliases.indexOf(entityAlias);
    if (index > -1) {
        var widgetsTitleList: any = this.aliasToWidgetsMap[entityAlias.id];
        if (widgetsTitleList) {
            var widgetsListHtml: any = '';
            for (var t in widgetsTitleList) {
                widgetsListHtml += '<br/>\'' + widgetsTitleList[t] + '\'';
            }
            var alert: any = this.dialog.alert()
                .parent($(this.document.body))
                .clickOutsideToClose(true)
                .title(this.translate.instant('entity.unable-delete-entity-alias-title'))
                .htmlContent(this.translate.instant('entity.unable-delete-entity-alias-text', {entityAlias: entityAlias.alias, widgetsList: widgetsListHtml}))
                .ariaLabel(this.translate.instant('entity.unable-delete-entity-alias-title'))
                .ok(this.translate.instant('action.close'))
                .targetEvent($event);
            alert._options.multiple = true;
            alert._options.fullscreen = true;

            this.dialog.show(alert);
        } else {
            this.entityAliases.splice(index, 1);
            if (this.theForm) {
                this.theForm.$setDirty();
            }
        }
    }
  };

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  save = (...rest: any[]): any => {

    var entityAliases: any = {};
    var uniqueAliasList: any = {};

    var valid: any = true;
    var message: any, aliasId: any, alias: any, filter: any;

    for (var i: any = 0; i < this.entityAliases.length; i++) {
        aliasId = this.entityAliases[i].id;
        alias = this.entityAliases[i].alias;
        filter = this.entityAliases[i].filter;
        if (uniqueAliasList[alias]) {
            valid = false;
            message = this.translate.instant('entity.duplicate-alias-error', {alias: alias});
            break;
        } else if (!filter || !filter.type) {
            valid = false;
            message = this.translate.instant('entity.missing-entity-filter-error', {alias: alias});
            break;
        } else {
            uniqueAliasList[alias] = alias;
            entityAliases[aliasId] = {id: aliasId, alias: alias, filter: filter};
        }
    }
    if (valid) {
        this.theForm.$setPristine();
        this.dialog.hide(entityAliases);
    } else {
        this.toast.showError(message);
    }
  };
}
