import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * Ported from the AngularJS filter `breadcrumbLabel` (module `thingsboard.home`) in src/app/layout/breadcrumb-label.filter.js.
 * The label is the state's `ncyBreadcrumb.label` JSON (`{"icon", "label", "translate"}`): the label translated unless
 * `"translate": "false"`. Impure, as the filter was `$stateful`: the translation arrives after the first read.
 */
@Pipe({ name: 'breadcrumbLabel', standalone: true, pure: false })
export class BreadcrumbLabelPipe implements PipeTransform {
  private readonly translate = inject(TranslateService);
  private readonly labels: Record<string, Record<string, string>> = {};

  transform(bLabel?: any): any {
    const labelObj: any = bLabel ? (typeof bLabel === 'string' ? JSON.parse(bLabel) : bLabel) : null;
    if (!labelObj) {
      return '';
    }
    const translate = !(labelObj.translate && labelObj.translate === 'false');
    const key = translate ? this.translate.getCurrentLang() || this.translate.getFallbackLang() || '' : 'orig';
    if (!this.labels[labelObj.label]) {
      this.labels[labelObj.label] = {};
    }
    if (!this.labels[labelObj.label][key]) {
      this.labels[labelObj.label][key] = labelObj.label;
      if (translate) {
        this.translate.get(labelObj.label).subscribe((translation: string) => {
          this.labels[labelObj.label][key] = translation;
        });
      }
    }
    return this.labels[labelObj.label][key];
  }
}
