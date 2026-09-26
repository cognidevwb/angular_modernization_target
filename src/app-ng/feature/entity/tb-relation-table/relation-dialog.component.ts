import { AfterViewInit, Component, ElementRef, OnDestroy, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import ace from 'brace';
import 'brace/ext/searchbox';
import 'brace/mode/json';
import 'brace/theme/github';
import { RootState } from '../../../root-state';
import { types } from '../../common/constants/types';
import { EntityRelationService } from '../../api/services/entity-relation.service';
import { TbRelationTypeAutocompleteDirective } from '../tb-relation-type-autocomplete/tb-relation-type-autocomplete.directive';
import { TbEntitySelectDirective } from '../tb-entity-select/tb-entity-select.directive';

/** What the relation table opens the dialog with. */
export interface RelationDialogData {
  isAdd: boolean;
  direction: string;
  relation: any;
}

/**
 * Ported from the AngularJS controller `RelationDialogController`
 * (src/app/entity/relation/relation-dialog.controller.js) with its template
 * relation-dialog.tpl.html. Closes with `true` once the relation is saved.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-relation-dialog',
  standalone: true,
  imports: [TranslatePipe, FormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule, MatToolbarModule, TbRelationTypeAutocompleteDirective, TbEntitySelectDirective],
  templateUrl: './relation-dialog.component.html',
})
export class RelationDialogComponent implements AfterViewInit, OnDestroy {
  protected readonly rootScope = inject(RootState);
  protected readonly dialogRef = inject(MatDialogRef<RelationDialogComponent, boolean>);
  protected readonly entityRelationService = inject(EntityRelationService);
  private readonly data: RelationDialogData = inject(MAT_DIALOG_DATA);
  private readonly editorElement = viewChild<ElementRef<HTMLElement>>('additionalInfoEditor');
  private readonly theForm = viewChild<NgForm>('theForm');

  protected readonly types: any = types;
  protected readonly isAdd: boolean = this.data.isAdd;
  protected readonly direction: string = this.data.direction;
  protected relation: any = this.data.relation;
  protected targetEntityId: any;
  protected additionalInfo = '';
  protected additionalInfoInvalid = false;
  private editor: any;

  constructor() {
    if (this.isAdd) {
      this.relation.type = types.entityRelationType.contains;
      this.targetEntityId = {};
    } else if (this.direction == types.entitySearchDirection.from) {
      this.targetEntityId = this.relation.to;
    } else {
      this.targetEntityId = this.relation.from;
    }
    if (this.relation.additionalInfo) {
      this.additionalInfo = JSON.stringify(this.relation.additionalInfo, null, 4);
    }
  }

  ngAfterViewInit(): void {
    const element = this.editorElement()?.nativeElement;
    if (!element) {
      return;
    }
    element.style.height = '200px';
    this.editor = ace.edit(element);
    this.editor.$blockScrolling = Infinity;
    this.editor.getSession().setMode('ace/mode/json');
    this.editor.setTheme('ace/theme/github');
    this.editor.getSession().setUseWrapMode(false);
    this.editor.renderer.setShowGutter(false);
    this.editor.setShowPrintMargin(false);
    this.editor.setValue(this.additionalInfo, -1);
    this.editor.on('change', () => {
      this.additionalInfo = this.editor.getValue();
      this.additionalInfoInvalid = false;
      this.theForm()?.form.markAsDirty();
    });
    this.editor.resize();
  }

  ngOnDestroy(): void {
    this.editor?.destroy();
  }

  protected cancel(): void {
    this.dialogRef.close(false);
  }

  protected save(): void {
    if (this.isAdd) {
      if (this.direction == types.entitySearchDirection.from) {
        this.relation.to = this.targetEntityId;
      } else {
        this.relation.from = this.targetEntityId;
      }
    }
    this.theForm()?.form.markAsPristine();

    let valid = true;
    if (this.additionalInfo && this.additionalInfo.length) {
      try {
        this.relation.additionalInfo = JSON.parse(this.additionalInfo);
      } catch {
        valid = false;
      }
    } else {
      this.relation.additionalInfo = null;
    }
    this.additionalInfoInvalid = !valid;

    if (valid) {
      this.entityRelationService.saveRelation(this.relation).then(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
