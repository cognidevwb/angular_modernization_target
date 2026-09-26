import { Component, ElementRef, effect, inject, input, model, untracked, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { RootState } from '../../../root-state';
import { types } from '../../common/constants/types';
import { EntityRelationService } from '../../api/services/entity-relation.service';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { RelationDialogComponent, RelationDialogData } from './relation-dialog.component';

/** AngularJS `orderBy` with one expression (`'prop'` or `'-prop'`): strings compared case-insensitively, stable. */
function orderBy(list: any[], order: string): any[] {
  const desc = order.startsWith('-');
  const key = desc ? order.substring(1) : order;
  const value = (item: any) => {
    const v = item?.[key];
    return typeof v === 'string' ? v.toLowerCase() : v;
  };
  return list
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const va = value(a.item);
      const vb = value(b.item);
      let cmp = 0;
      if (va !== vb) {
        if (va === undefined || va === null) {
          cmp = 1;
        } else if (vb === undefined || vb === null) {
          cmp = -1;
        } else {
          cmp = va < vb ? -1 : 1;
        }
      }
      return (desc ? -cmp : cmp) || a.index - b.index;
    })
    .map((e) => e.item);
}

/** AngularJS `filter` with `{$: text}`: any (nested) property value contains the text, case-insensitively. */
function matchesAny(value: any, needle: string): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'object') {
    return Object.keys(value).some((k) => !k.startsWith('$') && matchesAny(value[k], needle));
  }
  return String(value).toLowerCase().indexOf(needle) !== -1;
}

/**
 * Ported from the AngularJS directive `tbRelationTable` (src/app/entity/relation/relation-table.directive.js):
 * the relations from / to an entity, sorted, searched and paged on the client.
 */
@Component({
  selector: 'tb-relation-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatSelectModule, MatInputModule, MatPaginatorModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatTableModule, MatSortModule, MatCheckboxModule, FormsModule],
  templateUrl: './tb-relation-table.directive.html',
})
export class TbRelationTableDirective {
  protected readonly rootScope = inject(RootState);
  protected readonly translate = inject(TranslateService);
  protected readonly dialog = inject(MatDialog);
  protected readonly entityRelationService = inject(EntityRelationService);
  readonly entityId = model<any>();
  readonly entityType = input<any>();

  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly types: any = types;
  protected readonly directions: string[] = Object.values(types.entitySearchDirection);
  protected direction: any = types.entitySearchDirection.from;
  protected relations: any[] = [];
  protected relationsCount = 0;
  protected allRelations: any[] = [];
  protected selectedRelations: any[] = [];
  protected query: any = {
    order: 'type',
    limit: 5,
    page: 1,
    search: null
  };

  constructor() {
    effect(() => {
      const entityId = this.entityId();
      if (entityId) {
        untracked(() => this.reloadRelations());
      }
    });
  }

  protected displayedColumns(): string[] {
    return this.direction == types.entitySearchDirection.from
      ? ['select', 'type', 'toEntityTypeName', 'toName', 'actions']
      : ['select', 'type', 'fromEntityTypeName', 'fromName', 'actions'];
  }

  protected setDirection(direction: any): void {
    if (direction && direction !== this.direction) {
      this.direction = direction;
      this.reloadRelations();
    }
  }

  protected setSearch(search: any): void {
    if (search !== this.query.search) {
      this.query.search = search;
      if (this.query.search != null) {
        this.updateRelations();
      }
    }
  }

  protected enterFilterMode(event?: any): void {
    this.query.search = '';
    setTimeout(() => {
      this.searchInput()?.nativeElement.focus();
    });
  }

  protected exitFilterMode(): void {
    this.query.search = null;
    this.updateRelations();
  }

  protected onReorder(sort: Sort): void {
    this.query.order = sort.direction === 'desc' ? '-' + sort.active : sort.active;
    this.updateRelations();
  }

  protected onPaginate(event: PageEvent): void {
    this.query.page = event.pageIndex + 1;
    this.query.limit = event.pageSize;
    this.updateRelations();
  }

  protected isSelected(relation: any): boolean {
    return this.selectedRelations.indexOf(relation) !== -1;
  }

  protected toggleSelected(relation: any): void {
    const index = this.selectedRelations.indexOf(relation);
    if (index === -1) {
      this.selectedRelations = [...this.selectedRelations, relation];
    } else {
      this.selectedRelations = this.selectedRelations.filter((r) => r !== relation);
    }
  }

  protected allSelected(): boolean {
    return this.relations.length > 0 && this.relations.every((r) => this.isSelected(r));
  }

  protected toggleAll(): void {
    this.selectedRelations = this.allSelected() ? [] : this.relations.slice();
  }

  protected addRelation($event?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.openRelationDialog($event);
  }

  protected editRelation($event?: any, relation?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.openRelationDialog($event, relation);
  }

  private openRelationDialog($event?: any, relation?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    let isAdd = false;
    if (!relation) {
      isAdd = true;
      const entityId: any = {
        id: this.entityId(),
        entityType: this.entityType()
      };
      relation = {};
      if (this.direction == types.entitySearchDirection.from) {
        relation.from = entityId;
      } else {
        relation.to = entityId;
      }
    }
    const data: RelationDialogData = { isAdd, direction: this.direction, relation };
    firstValueFrom(this.dialog.open(RelationDialogComponent, { data, panelClass: 'tb-dialog' }).afterClosed()).then((saved) => {
      if (saved) {
        this.reloadRelations();
      }
    });
  }

  protected deleteRelation($event?: any, relation?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (relation) {
      let title: string;
      let content: string;
      if (this.direction == types.entitySearchDirection.from) {
        title = this.translate.instant('relation.delete-to-relation-title', {entityName: relation.toName});
        content = this.translate.instant('relation.delete-to-relation-text', {entityName: relation.toName});
      } else {
        title = this.translate.instant('relation.delete-from-relation-title', {entityName: relation.fromName});
        content = this.translate.instant('relation.delete-from-relation-text', {entityName: relation.fromName});
      }
      showConfirm(this.dialog, {
        title,
        htmlContent: content,
        cancel: this.translate.instant('action.no'),
        ok: this.translate.instant('action.yes')
      }).then(() => {
        this.entityRelationService.deleteRelation(
          relation.from.id,
          relation.from.entityType,
          relation.type,
          relation.to.id,
          relation.to.entityType).then(
          () => {
            this.reloadRelations();
          }
        );
      }, () => undefined);
    }
  }

  protected deleteRelations($event?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.selectedRelations && this.selectedRelations.length > 0) {
      let title: string;
      let content: string;
      if (this.direction == types.entitySearchDirection.from) {
        title = this.translate.instant('relation.delete-to-relations-title', {count: this.selectedRelations.length});
        content = this.translate.instant('relation.delete-to-relations-text');
      } else {
        title = this.translate.instant('relation.delete-from-relations-title', {count: this.selectedRelations.length});
        content = this.translate.instant('relation.delete-from-relations-text');
      }
      showConfirm(this.dialog, {
        title,
        htmlContent: content,
        cancel: this.translate.instant('action.no'),
        ok: this.translate.instant('action.yes')
      }).then(() => {
        const tasks: Promise<any>[] = this.selectedRelations.map((relation: any) =>
          this.entityRelationService.deleteRelation(
            relation.from.id,
            relation.from.entityType,
            relation.type,
            relation.to.id,
            relation.to.entityType));
        Promise.all(tasks).then(() => {
          this.reloadRelations();
        });
      }, () => undefined);
    }
  }

  protected reloadRelations(): void {
    this.allRelations = [];
    this.relations = [];
    const promise: Promise<any> = this.direction == types.entitySearchDirection.from
      ? this.entityRelationService.findInfoByFrom(this.entityId(), this.entityType())
      : this.entityRelationService.findInfoByTo(this.entityId(), this.entityType());
    promise.then(
      (allRelations: any[]) => {
        allRelations.forEach((relation: any) => {
          if (this.direction == types.entitySearchDirection.from) {
            relation.toEntityTypeName = this.translate.instant(types.entityTypeTranslations[relation.to.entityType].type);
          } else {
            relation.fromEntityTypeName = this.translate.instant(types.entityTypeTranslations[relation.from.entityType].type);
          }
        });
        this.allRelations = allRelations;
        this.selectedRelations = [];
        this.updateRelations();
      },
      () => {
        this.allRelations = [];
        this.selectedRelations = [];
        this.updateRelations();
      }
    );
  }

  protected updateRelations(): void {
    this.selectedRelations = [];
    let result: any[] = orderBy(this.allRelations, this.query.order);
    if (this.query.search != null) {
      const needle = String(this.query.search).toLowerCase();
      result = result.filter((relation) => matchesAny(relation, needle));
    }
    this.relationsCount = result.length;
    const startIndex: number = this.query.limit * (this.query.page - 1);
    this.relations = result.slice(startIndex, startIndex + this.query.limit);
  }
}
