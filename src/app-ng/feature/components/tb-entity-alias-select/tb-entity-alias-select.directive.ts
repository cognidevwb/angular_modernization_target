import { Component, effect, inject, input, model, untracked, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { CreateEntityAliasFn } from '../tb-datasource/datasource-callbacks';
import { EntityService } from '../../api/services/entity.service';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbEntityAliasSelect` (src/app/components/entity-alias-select.directive.js)
 * with its template entity-alias-select.tpl.html: an autocomplete over the alias controller's entity aliases
 * (optionally only those resolving to `allowedEntityTypes`). `[(ngModel)]` is the chosen entity alias;
 * "create a new one!" (or Enter on an unknown name) calls `onCreateEntityAlias(event, alias, allowedEntityTypes)`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-entity-alias-select',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, TranslatePipe, TruncatePipe],
  template: `
    <section layout="column">
      <mat-form-field id="entity-autocomplete" subscriptSizing="dynamic">
        <input matInput name="entity_alias" [required]="!!tbRequired()"
               [placeholder]="'entity.entity-alias' | translate"
               [matAutocomplete]="aliasAuto" #trigger="matAutocompleteTrigger"
               [ngModel]="entityAliasSearchText" (ngModelChange)="onSearchTextChange($event)"
               [ngModelOptions]="{standalone: true}"
               (keydown)="entityAliasEnter($event, trigger)">
        <mat-autocomplete #aliasAuto="matAutocomplete" class="tb-entity-alias-autocomplete"
                          [displayWith]="displayAlias" (optionSelected)="onAliasSelected($event)">
          @for (item of entityAliasSearch(searchQuery()); track item.id) {
            <mat-option [value]="item"><span>{{ item.alias }}</span></mat-option>
          }
          @if (!entityAliasSearch(searchQuery()).length) {
            <mat-option disabled class="tb-not-found">
              @if (!textIsNotEmpty(searchQuery())) {
                <div class="tb-no-entries"><span>{{ 'entity.no-aliases-found' | translate }}</span></div>
              } @else {
                <div>
                  <span>{{ 'entity.no-alias-matching' | translate: { alias: (searchQuery() | truncate: true: 6: '...') } }}</span>
                  <span>
                    <a style="pointer-events: all; cursor: pointer;" (mousedown)="createEntityAlias($event, searchQuery(), trigger)">{{ 'entity.create-new-alias' | translate }}</a>
                  </span>
                </div>
              }
            </mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
      @if ($error['entityAlias']) {
        <div class="tb-error-messages" role="alert">
          <div class="tb-error-message">{{ 'entity.alias-required' | translate }}</div>
        </div>
      }
    </section>
  `,
  providers: ngModelProviders(TbEntityAliasSelectDirective),
})
export class TbEntityAliasSelectDirective extends NgModelController {
  readonly tbRequired = model<any>(false);
  readonly aliasController = model<any>();
  readonly allowedEntityTypes = model<any>();
  readonly onCreateEntityAlias = input<CreateEntityAliasFn | undefined>();

  protected readonly entityService = inject(EntityService);

  entityAliasList: any[] = [];
  entityAlias: any = null;
  /** The input's text, or the selected alias (md-autocomplete's `md-search-text`). */
  entityAliasSearchText: any = '';

  constructor() {
    super();
    /** `scope.$watch('aliasController', …)`. */
    effect(() => {
      const aliasController = this.aliasController();
      const allowedEntityTypes = this.allowedEntityTypes();
      untracked(() => {
        this.entityAliasList = [];
        if (!aliasController) {
          return;
        }
        const entityAliases: any = aliasController.getEntityAliases();
        for (const aliasId in entityAliases) {
          if (allowedEntityTypes && !this.entityService.filterAliasByEntityTypes(entityAliases[aliasId], allowedEntityTypes)) {
            continue;
          }
          this.entityAliasList.push(entityAliases[aliasId]);
        }
      });
    });
  }

  override $render(): void {
    if (this.$viewValue) {
      this.entityAlias = this.$viewValue;
      this.entityAliasSearchText = this.entityAlias;
    }
    this.updateValidity();
  }

  /** The typed text (a selected alias shows as its name). */
  searchQuery(): string {
    const text = this.entityAliasSearchText;
    return typeof text === 'string' ? text : (text?.alias ?? '');
  }

  updateValidity(): void {
    const value: any = this.$viewValue;
    const valid = (value !== undefined && value != null) || !this.tbRequired();
    this.$setValidity('entityAlias', valid);
  }

  entityAliasSearch(entityAliasSearchText?: any): any[] {
    return entityAliasSearchText ? this.entityAliasList.filter(this.createFilterForEntityAlias(entityAliasSearchText)) : this.entityAliasList;
  }

  createFilterForEntityAlias(query: string): (entityAlias: any) => boolean {
    const lowercaseQuery = query.toLowerCase();
    return (entityAlias: any) => entityAlias.alias.toLowerCase().indexOf(lowercaseQuery) === 0;
  }

  /** `scope.$watch('entityAlias', …)`: the selection goes out through ngModel. */
  private setEntityAlias(entityAlias: any): void {
    if (entityAlias !== this.entityAlias) {
      this.entityAlias = entityAlias;
      this.updateView();
    }
  }

  updateView(): void {
    this.$setViewValue(this.entityAlias);
    this.updateValidity();
  }

  /** Typing over a selected alias clears the selection (md-autocomplete's `md-selected-item`). */
  onSearchTextChange(text: any): void {
    this.entityAliasSearchText = text;
    if (typeof text === 'string' && (!this.entityAlias || this.entityAlias.alias !== text)) {
      this.setEntityAlias(null);
    }
  }

  onAliasSelected(event: MatAutocompleteSelectedEvent): void {
    this.entityAliasSearchText = event.option.value;
    this.setEntityAlias(event.option.value);
  }

  textIsNotEmpty(text?: any): boolean {
    return !!(text && text.length > 0);
  }

  entityAliasEnter($event: KeyboardEvent, trigger: MatAutocompleteTrigger): void {
    if ($event.keyCode === ENTER) {
      $event.preventDefault();
      if (!this.entityAlias) {
        const found = this.entityAliasSearch(this.searchQuery()).length > 0;
        if (!found) {
          this.createEntityAlias($event, this.searchQuery(), trigger);
        }
      }
    }
  }

  createEntityAlias(event: Event, alias: string, trigger: MatAutocompleteTrigger): void {
    event.preventDefault();
    trigger.closePanel();
    const promise = this.onCreateEntityAlias()?.(event, alias, this.allowedEntityTypes());
    if (promise) {
      promise.then((newAlias?: any) => {
        if (newAlias) {
          this.entityAliasList.push(newAlias);
          this.entityAliasSearchText = newAlias;
          this.setEntityAlias(newAlias);
        }
      }, () => {});
    }
  }

  readonly displayAlias = (item: any): string => (item && typeof item === 'object' ? item.alias : item ?? '');
}
