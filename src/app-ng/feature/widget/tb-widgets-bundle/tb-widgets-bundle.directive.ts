import { Component, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

/**
 * Ported from the AngularJS directive `tbWidgetsBundle` (module `thingsboard.widget-library`) in
 * src/app/widget/widgets-bundle.directive.js (template widgets-bundle-fieldset.tpl.html). Its inputs join the form
 * of the page that hosts it: the grid's details form, or the add-widgets-bundle dialog's form.
 */
@Component({
  selector: 'tb-widgets-bundle',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule],
  viewProviders: joinParentForm,
  templateUrl: './tb-widgets-bundle.directive.html',
})
export class TbWidgetsBundleDirective {
  protected readonly rootScope = inject(RootState);
  readonly widgetsBundle = model<any>();
  readonly isEdit = model<any>();
  readonly isReadOnly = model<any>();
  readonly theForm = model<any>();
  readonly onExportWidgetsBundle = output<any>();
  readonly onDeleteWidgetsBundle = output<any>();
}
