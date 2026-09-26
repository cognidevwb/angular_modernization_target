import { Component, effect, inject, model } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbEntityList` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 */
@Component({
  selector: 'tb-entity-list',
  standalone: true,
  imports: [TranslatePipe, FormsModule, MatChipsModule, MatAutocompleteModule, MatFormFieldModule, MatIconModule],
  templateUrl: './tb-entity-list.directive.html',
  providers: ngModelProviders(TbEntityListDirective),
})
export class TbEntityListDirective extends NgModelController {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly tbRequired = model<any>();
  readonly entityType = model<any>();

  protected readonly entityService = inject(EntityService);

  protected entityList: any[] = [];
  protected entitySearchText = '';
  protected filteredEntities: any[] = [];
  protected inputTouched = false;
  protected invalid = false;

  private previousEntityType: any = this.entityType();
  constructor() {
    super();
    effect(() => {
      const currentEntityType = this.entityType();
      if (!isEqual(currentEntityType, this.previousEntityType)) {
        this.entityList = [];
        this.previousEntityType = currentEntityType;
      }
    });
  }

  override $render(): void {
    const value = this.$viewValue;
    this.entityList = [];
    if (value && value.length > 0) {
      this.entityService.getEntities(this.entityType(), value).then((entities: any) => {
        this.entityList = entities;
        this.updateValidity();
      });
    } else {
      this.updateValidity();
    }
  }

  override setDisabledState(isDisabled: boolean): void {
    super.setDisabledState(isDisabled);
    this.disabled.set(isDisabled);
  }

  fetchEntities(searchText?: any, limit?: any): Promise<any> {
    return this.entityService.getEntitiesByNameFilter(this.entityType(), searchText, limit, { ignoreLoading: true }).then(
      (result: any) => result ? result : []
    );
  }

  onSearchTextInput(searchText: string): void {
    this.entitySearchText = searchText;
    this.fetchEntities(searchText, 10).then((entities: any) => {
      this.filteredEntities = entities;
    });
  }

  onEntitySelected(event: MatAutocompleteSelectedEvent): void {
    const entity = event.option.value;
    this.entityList = [...this.entityList, entity];
    this.entitySearchText = '';
    this.filteredEntities = [];
    this.updateModelValue();
  }

  removeEntity(chip: any): void {
    this.entityList = this.entityList.filter((entity: any) => entity !== chip);
    this.updateModelValue();
  }

  private updateModelValue(): void {
    const ids: any[] = this.entityList.map((entity: any) => entity.id.id);
    this.$setViewValue(ids);
    this.$setTouched();
    this.updateValidity();
  }

  private updateValidity(): void {
    this.invalid = !!this.tbRequired() && !(this.entityList && this.entityList.length > 0);
    this.$setValidity('entityList', !this.invalid);
  }
}
