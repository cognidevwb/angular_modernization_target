import { Component, DoCheck, effect, inject, input, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbKeyValMap` (module `thingsboard.directives.keyValMap`) in src/app/components/kv-map.directive.js:24.
 */
@Component({
  selector: 'tb-key-val-map',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-key-val-map.directive.html',
})
export class TbKeyValMapDirective implements DoCheck {
  protected readonly rootScope = inject(RootState);
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly titleText = input<any>();
  readonly keyPlaceholderText = input<any>();
  readonly valuePlaceholderText = input<any>();
  readonly noDataText = input<any>();
  readonly keyValMap = model<any>();

  protected kvList: { key: string; value: any }[] = [];

  private previousKvListSnapshot = '[]';

  constructor() {
    effect(() => {
      const map = this.keyValMap();
      this.kvList.length = 0;
      if (map) {
        for (const property in map) {
          if (Object.prototype.hasOwnProperty.call(map, property)) {
            this.kvList.push({ key: property + '', value: map[property] });
          }
        }
      }
      this.previousKvListSnapshot = JSON.stringify(this.kvList);
    });
  }

  ngDoCheck(): void {
    const snapshot = JSON.stringify(this.kvList);
    if (snapshot !== this.previousKvListSnapshot) {
      this.previousKvListSnapshot = snapshot;
      const map: any = {};
      for (const entry of this.kvList) {
        map[entry.key] = entry.value;
      }
      this.keyValMap.set(map);
    }
  }

  protected removeKeyVal(index?: number): void {
    if (index !== undefined && index > -1) {
      this.kvList.splice(index, 1);
    }
  }

  protected addKeyVal(): void {
    if (!this.kvList) {
      this.kvList = [];
    }
    this.kvList.push({ key: '', value: '' });
  }
}
