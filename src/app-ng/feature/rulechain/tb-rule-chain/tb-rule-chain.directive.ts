import { Component, ElementRef, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard.service';
import { ToastService } from '../../services/toast.service';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

/**
 * Ported from the AngularJS directive `tbRuleChain` (module `thingsboard.ruleChain`) in src/app/rulechain/rulechain.directive.js
 * (template src/app/rulechain/rulechain-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-rule-chain dialog's form.
 */
@Component({
  selector: 'tb-rule-chain',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, FormsModule],
  viewProviders: joinParentForm,
  templateUrl: './tb-rule-chain.directive.html',
})
export class TbRuleChainDirective {
  protected readonly rootScope = inject(RootState);
  readonly ruleChain = model<any>();
  readonly isEdit = model<any>();
  readonly isReadOnly = model<any>();
  readonly theForm = model<any>();
  readonly onSetRootRuleChain = output<any>();
  readonly onExportRuleChain = output<any>();
  readonly onDeleteRuleChain = output<any>();

  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly element = inject(ElementRef);

  /** `ng-model="ruleChain.additionalInfo.x"`: creates `additionalInfo` on first write, as AngularJS did. */
  setAdditionalInfo(ruleChain: any, key: string, value: any): void {
    ruleChain.additionalInfo = ruleChain.additionalInfo || {};
    ruleChain.additionalInfo[key] = value;
  }

  onRuleChainIdCopied(): void {
    this.toast.showSuccess(this.translate.instant('rulechain.idCopiedMessage'), 750, this.element.nativeElement.parentElement?.parentElement, 'bottom left');
  }

  copyRuleChainId(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.ruleChain()?.id?.id).then(() => this.onRuleChainIdCopied());
  }
}
