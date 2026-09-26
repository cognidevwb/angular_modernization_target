import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RuleChainService } from '../../api/services/rule-chain.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbRuleChainDirective } from '../tb-rule-chain/tb-rule-chain.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import addRuleChainTemplate from '../../../../app/rulechain/add-rulechain.tpl.html';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import ruleChainCard from '../../../../app/rulechain/rulechain-card.tpl.html';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `RuleChainsController` (module `thingsboard.ruleChain`) in src/app/rulechain/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'rule-chains',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, forwardRef(() => TbGridDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbRuleChainDirective), forwardRef(() => TbAttributeTableDirective), forwardRef(() => TbAlarmTableDirective), forwardRef(() => TbEventTableDirective), forwardRef(() => TbRelationTableDirective), forwardRef(() => TbAuditLogTableDirective)],
  templateUrl: './rule-chains.component.html',
})
export class RuleChainsComponent {
  protected readonly ruleChainService = inject(RuleChainService);
  protected readonly userService = inject(UserService);
  protected readonly importExport = inject(ImportExportService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly dialog = inject(MatDialog);
  protected readonly typesRef: any = types;
  // TODO(port): elements not resolved to a component: details-buttons

  protected ruleChainActionsList: any;
  protected ruleChainAddItemActionsList: any;
  types: any;
  ruleChainGridConfig: any;
  grid: any;

  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params

  constructor() {
    this.ruleChainActionsList = [
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.openItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('rulechain.details') },
            details: (...rest: any[]) => { return this.translate.instant('rulechain.rulechain-details') },
            icon: "edit"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.exportRuleChain($event, item);
            },
            name: (...rest: any[]) => { this.translate.instant('action.export') },
            details: (...rest: any[]) => { return this.translate.instant('rulechain.export') },
            icon: "file_download"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.setRootRuleChain($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('rulechain.set-root') },
            details: (...rest: any[]) => { return this.translate.instant('rulechain.set-root') },
            icon: "flag",
            isEnabled: this.isNonRootRuleChain
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.deleteItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.delete') },
            details: (...rest: any[]) => { return this.translate.instant('rulechain.delete') },
            icon: "delete",
            isEnabled: this.isNonRootRuleChain
        }
    ];
    this.ruleChainAddItemActionsList = [
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.grid.addItem($event);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.create') },
            details: (...rest: any[]) => { return this.translate.instant('rulechain.create-new-rulechain') },
            icon: "insert_drive_file"
        },
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.importExport.importRuleChain($event).then(
                    (ruleChainImport?: any) => {
                        (this.router as any).go('home.ruleChains.importRuleChain', {ruleChainImport:ruleChainImport});
                    }
                );
            },
            name: (...rest: any[]) => { return this.translate.instant('action.import') },
            details: (...rest: any[]) => { return this.translate.instant('rulechain.import') },
            icon: "file_upload"
        }
    ];
    this.types = this.typesRef;
    this.ruleChainGridConfig = {

        refreshParamsFunc: null,

        deleteItemTitleFunc: this.deleteRuleChainTitle,
        deleteItemContentFunc: this.deleteRuleChainText,
        deleteItemsTitleFunc: this.deleteRuleChainsTitle,
        deleteItemsActionTitleFunc: this.deleteRuleChainsActionTitle,
        deleteItemsContentFunc: this.deleteRuleChainsText,

        fetchItemsFunc: this.fetchRuleChains,
        saveItemFunc: this.saveRuleChain,
        clickItemFunc: this.openRuleChain,
        deleteItemFunc: this.deleteRuleChain,

        getItemTitleFunc: this.getRuleChainTitle,
        itemCardTemplateUrl: ruleChainCard,
        parentCtl: this,

        actionsList: this.ruleChainActionsList,
        addItemActions: this.ruleChainAddItemActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addRuleChainTemplate,

        addItemText: (...rest: any[]) => { return this.translate.instant('rulechain.add-rulechain-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('rulechain.no-rulechains-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('rulechain.rulechain-details') },
        isSelectionEnabled: this.isNonRootRuleChain
    };
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.ruleChainGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.ruleChainGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.isRootRuleChain = this.isRootRuleChain;
    this.isNonRootRuleChain = this.isNonRootRuleChain;
    this.exportRuleChain = this.exportRuleChain;
    this.setRootRuleChain = this.setRootRuleChain;
  }

  deleteRuleChainTitle = (ruleChain?: any, ...rest: any[]): any => {
    return this.translate.instant('rulechain.delete-rulechain-title', {ruleChainName: ruleChain.name});
  };

  deleteRuleChainText = (...rest: any[]): any => {
    return this.translate.instant('rulechain.delete-rulechain-text');
  };

  deleteRuleChainsTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('rulechain.delete-rulechains-title', {count: selectedCount}, 'messageformat');
  };

  deleteRuleChainsActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('rulechain.delete-rulechains-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteRuleChainsText = (...rest: any[]): any => {
    return this.translate.instant('rulechain.delete-rulechains-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
    this.grid = grid;
  };

  fetchRuleChains = (pageLink?: any, ...rest: any[]): any => {
    return this.ruleChainService.getRuleChains(pageLink);
  };

  saveRuleChain = (ruleChain?: any, ...rest: any[]): any => {
    return this.ruleChainService.saveRuleChain(ruleChain);
  };

  openRuleChain = ($event?: any, ruleChain?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    (this.router as any).go('home.ruleChains.ruleChain', {ruleChainId: ruleChain.id.id});
  };

  deleteRuleChain = (ruleChainId?: any, ...rest: any[]): any => {
    return this.ruleChainService.deleteRuleChain(ruleChainId);
  };

  getRuleChainTitle = (ruleChain?: any, ...rest: any[]): any => {
    return ruleChain ? ruleChain.name : '';
  };

  isRootRuleChain = (ruleChain?: any, ...rest: any[]): any => {
    return ruleChain && ruleChain.root;
  };

  isNonRootRuleChain = (ruleChain?: any, ...rest: any[]): any => {
    return ruleChain && !ruleChain.root;
  };

  isRuleChainEditable = (ruleChain?: any, ...rest: any[]): any => {
    return ruleChain && !ruleChain.root;
  };

  exportRuleChain = ($event?: any, ruleChain?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    this.importExport.exportRuleChain(ruleChain.id.id);
  };

  setRootRuleChain = ($event?: any, ruleChain?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    var confirm: any = (this.dialog as any).confirm()
        .targetEvent($event)
        .title(this.translate.instant('rulechain.set-root-rulechain-title', {ruleChainName: ruleChain.name}))
        .htmlContent(this.translate.instant('rulechain.set-root-rulechain-text'))
        .ariaLabel(this.translate.instant('rulechain.set-root'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    (this.dialog as any).show(confirm).then(() => {
        this.ruleChainService.setRootRuleChain(ruleChain.id.id).then(
            () => {
                this.grid.refreshList();
            }
        );
    });

  };
}
