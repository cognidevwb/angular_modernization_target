import { Component, effect, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { EntityService } from '../../api/services/entity.service';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbRelatedEntityAutocomplete` (module `thingsboard.directives.relatedEntityAutocomplete`)
 * in src/app/components/related-entity-autocomplete.directive.js:25: picks one of the entities related to
 * `rootEntityId`; `[(ngModel)]` is the picked entity's id object.
 */
@Component({
  selector: 'tb-related-entity-autocomplete',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  template: `
<mat-form-field class="tb-related-entity-autocomplete" style="width: 100%;">
    <mat-label>{{ placeholderText() | translate }}</mat-label>
    <input matInput type="text" name="entity"
           [required]="!!tbRequired()"
           [disabled]="!!disabled()"
           [ngModel]="entitySearchText"
           (ngModelChange)="onSearchTextChange($event)"
           (focus)="loadEntities()"
           [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete" class="tb-related-entity-autocomplete" [displayWith]="displayEntity"
                      (optionSelected)="onEntitySelected($event)">
        @for (item of entities; track item?.id?.id) {
        <mat-option [value]="item">
            <div class="tb-entity-item"><span>{{ item.name }}</span></div>
        </mat-option>
        }
        @if (!entities.length) {
        <mat-option disabled>
            <div class="tb-not-found">
                <span>{{ notFoundText() | translate: { entity: searchString() } }}</span>
            </div>
        </mat-option>
        }
    </mat-autocomplete>
    @if (tbRequired() && !entity) {
    <mat-error>{{ requiredText() | translate }}</mat-error>
    }
</mat-form-field>
`,
  providers: ngModelProviders(TbRelatedEntityAutocompleteDirective),
})
export class TbRelatedEntityAutocompleteDirective extends NgModelController {
  readonly rootEntityId = model<any>();
  readonly entityType = model<any>();
  readonly entitySubtypes = model<any>();
  readonly excludeEntityIds = model<any>();
  readonly theForm = model<any>();
  readonly tbRequired = model<any>(false);
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly placeholderText = input<string>('');
  readonly notFoundText = input<string>('');
  readonly requiredText = input<string>('');

  protected readonly entityService = inject(EntityService);

  entity: any = null;
  entitySearchText: any = '';
  entities: any[] = [];
  allEntities: any[] | null = null;

  constructor() {
    super();
    // `scope.$watch('disabled', updateView)`
    effect(() => {
      this.disabled();
      this.updateView();
    });
  }

  override $render(): void {
    if (this.$viewValue) {
      this.entityService.getRelatedEntity(this.$viewValue).then(
        (entity: any) => {
          this.entity = entity;
          this.entitySearchText = entity;
        },
        () => {
          this.entity = null;
        },
      );
    } else {
      this.entity = null;
      this.entitySearchText = '';
    }
  }

  readonly displayEntity = (item: any): string => (item && typeof item === 'object' ? item.name : item ?? '');

  searchString(): string {
    return typeof this.entitySearchText === 'string' ? this.entitySearchText : '';
  }

  onSearchTextChange(text: any): void {
    this.entitySearchText = text;
    if (typeof text === 'string') {
      this.setEntity(null);
      this.loadEntities();
    }
  }

  onEntitySelected(event: MatAutocompleteSelectedEvent): void {
    this.setEntity(event.option.value);
  }

  loadEntities(): void {
    this.fetchEntities(this.searchString()).then(
      (entities) => (this.entities = entities),
      () => (this.entities = []),
    );
  }

  fetchEntities(searchText: string): Promise<any[]> {
    if (this.allEntities) {
      return Promise.resolve(this.filterEntities(searchText));
    }
    return Promise.resolve(
      this.entityService.getRelatedEntities(this.rootEntityId(), this.entityType(), this.entitySubtypes(), -1, []),
    ).then((entities: any[]) => {
      const exclude: any[] = this.excludeEntityIds() || [];
      this.allEntities = exclude.length ? entities.filter((e: any) => exclude.indexOf(e.id.id) == -1) : entities;
      return this.filterEntities(searchText);
    });
  }

  /** `$filter('filter')(allEntities, {name: searchText})`: a case-insensitive substring match on name. */
  filterEntities(searchText: string): any[] {
    const text = (searchText || '').toLowerCase();
    return (this.allEntities || []).filter((e: any) => !text || (e.name && String(e.name).toLowerCase().indexOf(text) !== -1));
  }

  updateView(): void {
    if (!this.disabled()) {
      const value = this.entity ? this.entity.id : null;
      if (!isEqual(value, this.$viewValue ?? null)) {
        this.$setViewValue(value);
      }
    }
  }

  /** `scope.$watch('entity', updateView)` */
  private setEntity(entity: any): void {
    if (entity !== this.entity) {
      this.entity = entity;
      this.updateView();
    }
  }
}
