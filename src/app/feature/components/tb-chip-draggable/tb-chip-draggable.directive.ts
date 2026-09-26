import { AfterViewInit, DestroyRef, Directive, DOCUMENT, ElementRef, inject, input, output } from '@angular/core';

/** What `mdChipDraggable:change` carried: the reordered collection, the moved item and its move. */
export interface ChipDraggableChange {
  collection: any[];
  item: any;
  from: number;
  to: number | null;
}

/** The chip list the chip being dragged belongs to (drops only land in the same list). */
let globalDraggingChipsWrap: Element | null = null;

const CHIP_SELECTOR = 'mat-chip-row, mat-chip, mat-chip-option, md-chip';
const CHIPS_WRAP_SELECTOR = 'mat-chip-grid, mat-chip-set, mat-chip-listbox, md-chips-wrap';

/**
 * Ported from the AngularJS directive `tbChipDraggable` (src/app/components/md-chip-draggable.directive.js):
 * put on a chip's drag handle; the enclosing chip becomes draggable (from the handle only) and can be dropped
 * before/after another chip of the same chip list. `[chipItems]` is the chips' array (the legacy
 * `$mdChipsCtrl.items`) and `[chipItem]` this chip's item: a drop moves the item within `chipItems` in place
 * and emits `chipDraggableChange` (the legacy `$scope.$emit('mdChipDraggable:change', …)`).
 */
@Directive({
  selector: '[tb-chip-draggable]',
  standalone: true,
})
export class TbChipDraggableDirective implements AfterViewInit {
  readonly chipItems = input<any[]>([]);
  readonly chipItem = input<any>();
  readonly chipDraggableChange = output<ChipDraggableChange>();

  protected readonly document = inject(DOCUMENT);
  protected readonly element = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  private dragging = false;
  private preventDrag = false;
  private dropPosition: 'before' | 'after' | null = null;
  private dropTimeout?: ReturnType<typeof setTimeout>;
  private counter = 0;

  ngAfterViewInit(): void {
    const handle: HTMLElement = this.element.nativeElement;
    const chip: HTMLElement = handle.closest(CHIP_SELECTOR) ?? handle;
    chip.setAttribute('draggable', 'true');
    const listen = (target: EventTarget, type: string, fn: (event: any) => void) => {
      target.addEventListener(type, fn);
      this.destroyRef.onDestroy(() => target.removeEventListener(type, fn));
    };

    listen(chip, 'mousedown', (event: MouseEvent) => {
      if (event.target !== handle && !handle.contains(event.target as Node)) {
        this.preventDrag = true;
      }
    });
    listen(this.document, 'mouseup', () => {
      this.preventDrag = false;
    });
    listen(chip, 'dragstart', (event: DragEvent) => {
      if (this.preventDrag) {
        event.preventDefault();
        return;
      }
      this.dragging = true;
      globalDraggingChipsWrap = chip.closest(CHIPS_WRAP_SELECTOR);
      chip.classList.add('dragging');
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = 'copyMove';
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.setData('text/plain', String(this.chipItems().indexOf(this.chipItem())));
      }
    });
    listen(chip, 'dragend', () => {
      this.dragging = false;
      globalDraggingChipsWrap = null;
      chip.classList.remove('dragging');
    });
    listen(chip, 'dragenter', () => {
      this.counter++;
    });
    listen(chip, 'dragover', (event: DragEvent) => this.onDragOver(chip, event));
    listen(chip, 'drop', (event: DragEvent) => this.onDrop(chip, event));
    listen(chip, 'dragleave', () => {
      this.counter--;
      if (this.counter <= 0) {
        this.counter = 0;
        this.clearDropClasses(chip);
      }
    });
  }

  private onDragOver(chip: HTMLElement, event: DragEvent): void {
    if (this.dragging) {
      return;
    }
    event.preventDefault();
    if (globalDraggingChipsWrap !== chip.closest(CHIPS_WRAP_SELECTOR)) {
      return;
    }
    const bounds = chip.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    chip.classList.add('dropping');
    chip.classList.remove('dropping-after', 'dropping-before');
    if (x >= (bounds.right - bounds.left) / 2 || y >= (bounds.bottom - bounds.top) / 2) {
      this.dropPosition = 'after';
      chip.classList.add('dropping-after');
    } else {
      this.dropPosition = 'before';
      chip.classList.add('dropping-before');
    }
  }

  private onDrop(chip: HTMLElement, event: DragEvent): void {
    if (this.dragging) {
      return;
    }
    this.counter = 0;
    event.preventDefault();
    if (globalDraggingChipsWrap !== chip.closest(CHIPS_WRAP_SELECTOR)) {
      return;
    }
    const items = this.chipItems();
    const droppedItemIndex = parseInt(event.dataTransfer?.getData('text/plain') ?? '', 10);
    const currentIndex = items.indexOf(this.chipItem());
    let newIndex: number;
    if (this.dropPosition === 'before') {
      newIndex = droppedItemIndex < currentIndex ? currentIndex - 1 : currentIndex;
    } else {
      newIndex = droppedItemIndex < currentIndex ? currentIndex : currentIndex + 1;
    }
    // prevent the event firing multiple times in firefox
    clearTimeout(this.dropTimeout);
    this.dropTimeout = setTimeout(() => {
      this.dropPosition = null;
      if (!isNaN(droppedItemIndex)) {
        items.splice(newIndex, 0, items.splice(droppedItemIndex, 1)[0]);
        this.chipDraggableChange.emit({
          collection: items,
          item: items[droppedItemIndex],
          from: droppedItemIndex,
          to: newIndex,
        });
      }
      this.clearDropClasses(chip);
    }, 1000 / 16);
  }

  private clearDropClasses(chip: HTMLElement): void {
    chip.classList.remove('dropping', 'dropping-after', 'dropping-before');
  }
}
