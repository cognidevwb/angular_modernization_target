import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

/**
 * Ported from the AngularJS controller `AliasesEntitySelectPanelController` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'aliases-entity-select-panel',
  standalone: true,
  imports: [MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './aliases-entity-select-panel.component.html',
})
export class AliasesEntitySelectPanelComponent {
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  _mdPanelRef: any;
  aliasController: any;
  onEntityAliasesUpdate: any;
  entityAliases: any = {};
  entityAliasesInfo: any = {};
  protected allEntityAliases: any;
  entityAliasInfo: any;

  constructor() {
    this._mdPanelRef = this.dialogData.mdPanelRef;
    this.aliasController = this.dialogData.aliasController;
    this.onEntityAliasesUpdate = this.dialogData.onEntityAliasesUpdate;
    this.currentAliasEntityChanged = this.currentAliasEntityChanged;
    this.allEntityAliases = this.aliasController.getEntityAliases();
    for (var aliasId in this.allEntityAliases) {
        var aliasInfo: any = this.aliasController.getInstantAliasInfo(aliasId);
        if (aliasInfo && !aliasInfo.resolveMultiple && aliasInfo.currentEntity
            && aliasInfo.resolvedEntities.length > 1) {
            this.entityAliasesInfo[aliasId] = structuredClone(aliasInfo);
            this.entityAliasesInfo[aliasId].selectedId = aliasInfo.currentEntity.id;
        }
    }
  }

  currentAliasEntityChanged = (aliasId?: any, selectedId?: any, ...rest: any[]): any => {
    var resolvedEntities: any = this.entityAliasesInfo[aliasId].resolvedEntities;
    var selected: any = (resolvedEntities || []).filter((entity: any) => entity && entity.id === selectedId);
    if (selected && selected.length) {
        this.aliasController.updateCurrentAliasEntity(aliasId, selected[0]);
        if (this.dialogData.onEntityAliasesUpdate) {
            this.dialogData.onEntityAliasesUpdate();
        }
    }
  };

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
