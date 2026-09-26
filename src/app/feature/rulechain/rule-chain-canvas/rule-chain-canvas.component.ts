import { Component, DestroyRef, ElementRef, OnInit, inject, input, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  FcConnector,
  FcEdge,
  FcItemInfo,
  FcModel,
  FcNode,
  FlowchartModelService,
  flowchartConstants,
} from './flowchart-model';

/** The box a node renders as (`.tb-rule-node`: 150 + 2×10 padding + 2×1 border wide, 32 + 2×5 + 2×1 high). */
const NODE_BOX_WIDTH = 172;
const NODE_BOX_HEIGHT = 44;
/** A connector's centre sits 3px outside the node box (`.fc-leftConnectors { left: -20px }` + magnet + 14px connector). */
const CONNECTOR_OUTSET = 3;
/** Mouse travel before a press on a node becomes a drag. */
const DRAG_THRESHOLD = 3;

interface Point {
  x: number;
  y: number;
}

interface NodeDrag {
  start: Point;
  origins: Map<FcNode, Point>;
  moved: boolean;
}

interface EdgeDrag {
  source: FcConnector;
  from: Point;
  to: Point;
}

interface SelectRect {
  start: Point;
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A node being dragged out of a library canvas, until a canvas takes the drop. */
let libraryDrag: { node: FcNode; grab: Point; dropTargetId: string } | null = null;

let canvasSeq = 0;

/**
 * The rule chain canvas: the part of ngFlowchart's `<fc-canvas>` the rule chain
 * editor wires — nodes as absolutely positioned boxes, edges as SVG curves with
 * their labels, selection (click, ctrl-click, rectangle), node dragging,
 * connector-to-connector linking, delete, double-click edit, and dragging a
 * node from a library canvas (`dropTargetId`) onto the canvas with that id.
 *
 * `control` receives `modelservice` and `adjustCanvasSize(fit)`, as it did.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-rule-chain-canvas',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './rule-chain-canvas.component.html',
  styles: [`
    :host { display: block; height: 100%; }
    .tb-rule-node mat-icon,
    .tb-rule-node .tb-node-icon-url {
      width: 20px;
      min-width: 20px;
      height: 20px;
      min-height: 20px;
      padding-right: 4px;
      font-size: 20px;
    }
  `],
})
export class RuleChainCanvasComponent implements OnInit {
  readonly model = input.required<FcModel>();
  readonly selectedObjects = input<any[]>([]);
  readonly callbacks = input<any>({});
  readonly control = input<any>({});
  readonly nodeWidth = input<number>(170);
  readonly nodeHeight = input<number>(50);
  readonly edgeStyle = input<string>(flowchartConstants.lineStyle);
  readonly automaticResize = input<boolean>(false);
  readonly dropTargetId = input<string | null>(null);

  protected readonly host = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  private readonly canvasRef = viewChild<ElementRef<HTMLElement>>('canvas');

  protected readonly constants = flowchartConstants;
  protected readonly arrowId = 'fc-arrow-' + ++canvasSeq;
  protected readonly arrowSelectedId = this.arrowId + '-selected';

  protected modelservice!: FlowchartModelService;
  protected hoveredNode: FcNode | null = null;
  protected hoveredEdge: FcEdge | null = null;
  protected hoveredConnector: FcConnector | null = null;
  protected nodeDrag: NodeDrag | null = null;
  protected edgeDrag: EdgeDrag | null = null;
  protected selectRect: SelectRect | null = null;
  protected fitWidth = 0;
  protected fitHeight = 0;

  private readonly onMove = (event: MouseEvent) => this.mouseMove(event);
  private readonly onUp = (event: MouseEvent) => this.mouseUp(event);

  ngOnInit(): void {
    this.modelservice = new FlowchartModelService(
      this.model(),
      this.selectedObjects(),
      () => this.canvasRef()?.nativeElement ?? null,
      (x, y) => this.itemInfoAtPoint(x, y),
    );
    this.modelservice.editable = this.isEditable();
    const control = this.control();
    if (control) {
      control.modelservice = this.modelservice;
      control.adjustCanvasSize = (fit?: boolean) => this.adjustCanvasSize(fit);
    }
    this.destroyRef.onDestroy(() => this.stopTracking());
  }

  /** A library canvas (it has a drop target) is a drag source only. */
  protected isEditable(): boolean {
    return !this.dropTargetId();
  }

  protected canvasWidth(): number {
    let maxX = 0;
    for (const node of this.model().nodes) {
      maxX = Math.max(maxX, node.x + this.nodeWidth());
    }
    return Math.max(this.fitWidth, maxX + (this.automaticResize() ? 50 : 10));
  }

  protected canvasHeight(): number {
    let maxY = 0;
    for (const node of this.model().nodes) {
      maxY = Math.max(maxY, node.y + this.nodeHeight());
    }
    return Math.max(this.fitHeight, maxY + (this.automaticResize() ? 50 : 10));
  }

  adjustCanvasSize(fit?: boolean): void {
    if (fit) {
      this.fitWidth = 0;
      this.fitHeight = 0;
      return;
    }
    const el = this.canvasRef()?.nativeElement;
    this.fitWidth = Math.max(this.canvasWidth(), el?.offsetWidth ?? 0);
    this.fitHeight = Math.max(this.canvasHeight(), el?.offsetHeight ?? 0);
  }

  protected connectorsOf(node: FcNode, type: string): FcConnector[] {
    return this.modelservice.nodes.getConnectorsByType(node, type);
  }

  protected isSelected(object: any): boolean {
    return this.modelservice.isSelected(object);
  }

  // ---- geometry --------------------------------------------------------------

  private connectorPoint(connectorId: any): Point | null {
    const node = this.modelservice.nodes.getNodeByConnectorId(connectorId);
    const connector = this.modelservice.nodes.getConnectorById(connectorId);
    if (!node || !connector) {
      return null;
    }
    const y = node.y + NODE_BOX_HEIGHT / 2;
    return connector.type === flowchartConstants.leftConnectorType
      ? { x: node.x - CONNECTOR_OUTSET, y }
      : { x: node.x + NODE_BOX_WIDTH + CONNECTOR_OUTSET, y };
  }

  private tangent(from: Point, to: Point): number {
    return Math.max(Math.abs(to.x - from.x) / 2, 50);
  }

  protected pathBetween(from: Point, to: Point): string {
    if (this.edgeStyle() === flowchartConstants.curvedStyle) {
      const dx = this.tangent(from, to);
      return `M ${from.x}, ${from.y} C ${from.x + dx}, ${from.y} ${to.x - dx}, ${to.y} ${to.x}, ${to.y}`;
    }
    return `M ${from.x}, ${from.y} L ${to.x}, ${to.y}`;
  }

  protected edgePath(edge: FcEdge): string {
    const from = this.connectorPoint(edge.source);
    const to = this.connectorPoint(edge.destination);
    return from && to ? this.pathBetween(from, to) : '';
  }

  protected labelPoint(edge: FcEdge): Point {
    const from = this.connectorPoint(edge.source);
    const to = this.connectorPoint(edge.destination);
    if (!from || !to) {
      return { x: 0, y: 0 };
    }
    if (this.edgeStyle() === flowchartConstants.curvedStyle) {
      const dx = this.tangent(from, to);
      // the cubic Bézier at t = ½: (P0 + 3·P1 + 3·P2 + P3) / 8
      return {
        x: (from.x + 3 * (from.x + dx) + 3 * (to.x - dx) + to.x) / 8,
        y: (from.y + 3 * from.y + 3 * to.y + to.y) / 8,
      };
    }
    return { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 };
  }

  private toCanvas(event: MouseEvent): Point {
    const rect = this.canvasRef()?.nativeElement.getBoundingClientRect();
    return rect ? { x: event.clientX - rect.left, y: event.clientY - rect.top } : { x: event.clientX, y: event.clientY };
  }

  private itemInfoAtPoint(x: number, y: number): FcItemInfo {
    const element = document.elementFromPoint(x, y) as HTMLElement | null;
    const canvas = this.canvasRef()?.nativeElement;
    if (!element || !canvas || !canvas.contains(element)) {
      return {};
    }
    const nodeEl = element.closest('[data-fc-node-index]');
    if (nodeEl) {
      return { node: this.model().nodes[Number(nodeEl.getAttribute('data-fc-node-index'))] };
    }
    const edgeEl = element.closest('[data-fc-edge-index]');
    if (edgeEl) {
      return { edge: this.model().edges[Number(edgeEl.getAttribute('data-fc-edge-index'))] };
    }
    return {};
  }

  // ---- node callbacks ---------------------------------------------------------

  private nodeCallback(name: string, event: Event, node: FcNode): void {
    const fn = this.callbacks()?.nodeCallbacks?.[name];
    if (fn) {
      fn(event, node);
    }
  }

  protected nodeMouseEnter(event: MouseEvent, node: FcNode): void {
    this.hoveredNode = node;
    this.nodeCallback('mouseEnter', event, node);
  }

  protected nodeMouseLeave(event: MouseEvent, node: FcNode): void {
    this.hoveredNode = null;
    this.nodeCallback('mouseLeave', event, node);
  }

  protected nodeDblClick(event: MouseEvent, node: FcNode): void {
    if (this.isEditable()) {
      this.nodeCallback('doubleClick', event, node);
    }
  }

  protected nodeEdit(event: MouseEvent, node: FcNode): void {
    event.stopPropagation();
    this.nodeCallback('nodeEdit', event, node);
  }

  protected nodeDelete(event: MouseEvent, node: FcNode): void {
    event.stopPropagation();
    this.modelservice.nodes.delete(node);
  }

  protected nodeMouseDown(event: MouseEvent, node: FcNode): void {
    this.nodeCallback('mouseDown', event, node);
    if (event.button !== 0 || !this.isEditable()) {
      return;
    }
    event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {
      this.modelservice.nodes.toggleSelected(node);
    } else if (!this.modelservice.isSelected(node)) {
      this.modelservice.deselectAll();
      this.modelservice.select(node);
    }
    const origins = new Map<FcNode, Point>();
    for (const selected of this.modelservice.nodes.getSelectedNodes()) {
      origins.set(selected, { x: selected.x, y: selected.y });
    }
    if (!origins.has(node)) {
      origins.set(node, { x: node.x, y: node.y });
    }
    this.nodeDrag = { start: { x: event.clientX, y: event.clientY }, origins, moved: false };
    this.startTracking();
  }

  /** A link dropped on a node lands on its input connector (ngFlowchart's magnet). */
  protected nodeMouseUp(event: MouseEvent, node: FcNode): void {
    if (this.edgeDrag) {
      const target = this.connectorsOf(node, flowchartConstants.leftConnectorType)[0]
        ?? this.connectorsOf(node, flowchartConstants.rightConnectorType)[0];
      if (target) {
        this.finishEdge(event, target);
      }
    }
  }

  // ---- connectors ------------------------------------------------------------

  protected connectorMouseDown(event: MouseEvent, connector: FcConnector): void {
    if (event.button !== 0 || !this.isEditable()) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    const from = this.connectorPoint(connector.id);
    if (!from) {
      return;
    }
    this.edgeDrag = { source: connector, from, to: this.toCanvas(event) };
    this.startTracking();
  }

  protected connectorMouseUp(event: MouseEvent, connector: FcConnector): void {
    if (this.edgeDrag) {
      event.stopPropagation();
      this.finishEdge(event, connector);
    }
  }

  private finishEdge(event: MouseEvent, destination: FcConnector): void {
    const drag = this.edgeDrag;
    this.edgeDrag = null;
    this.stopTracking();
    if (!drag || drag.source === destination) {
      return;
    }
    const callbacks = this.callbacks() ?? {};
    if (callbacks.isValidEdge && !callbacks.isValidEdge(drag.source, destination)) {
      return;
    }
    const duplicate = this.model().edges.some((e) => e.source === drag.source.id && e.destination === destination.id);
    if (duplicate) {
      return;
    }
    const edge: FcEdge = { source: drag.source.id, destination: destination.id };
    const created = callbacks.createEdge ? callbacks.createEdge(event, edge) : Promise.resolve(edge);
    Promise.resolve(created).then(
      (result: FcEdge | undefined) => {
        const added = result ?? edge;
        if (this.model().edges.indexOf(added) === -1) {
          this.model().edges.push(added);
        }
      },
      () => undefined,
    );
  }

  // ---- edges -----------------------------------------------------------------

  protected edgeMouseDown(event: MouseEvent, edge: FcEdge): void {
    if (event.button !== 0 || !this.isEditable()) {
      return;
    }
    event.stopPropagation();
    if (event.ctrlKey || event.metaKey) {
      this.modelservice.edges.toggleSelected(edge);
    } else {
      this.modelservice.deselectAll();
      this.modelservice.select(edge);
    }
  }

  protected edgeDblClick(event: MouseEvent, edge: FcEdge): void {
    const fn = this.callbacks()?.edgeDoubleClick;
    if (fn && this.isEditable()) {
      fn(event, edge);
    }
  }

  protected edgeEdit(event: MouseEvent, edge: FcEdge): void {
    event.stopPropagation();
    const fn = this.callbacks()?.edgeEdit;
    if (fn) {
      fn(event, edge);
    }
  }

  protected edgeDelete(event: MouseEvent, edge: FcEdge): void {
    event.stopPropagation();
    this.modelservice.edges.delete(edge);
  }

  // ---- canvas: rectangle selection, tracking --------------------------------

  protected canvasMouseDown(event: MouseEvent): void {
    if (event.button !== 0 || !this.isEditable()) {
      return;
    }
    if (!(event.ctrlKey || event.metaKey)) {
      this.modelservice.deselectAll();
    }
    const start = this.toCanvas(event);
    this.selectRect = { start, x: start.x, y: start.y, width: 0, height: 0 };
    this.startTracking();
  }

  private startTracking(): void {
    document.addEventListener('mousemove', this.onMove);
    document.addEventListener('mouseup', this.onUp);
  }

  private stopTracking(): void {
    document.removeEventListener('mousemove', this.onMove);
    document.removeEventListener('mouseup', this.onUp);
  }

  private mouseMove(event: MouseEvent): void {
    if (this.nodeDrag) {
      const dx = event.clientX - this.nodeDrag.start.x;
      const dy = event.clientY - this.nodeDrag.start.y;
      if (!this.nodeDrag.moved && Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) {
        return;
      }
      this.nodeDrag.moved = true;
      this.nodeDrag.origins.forEach((origin, node) => {
        node.x = Math.max(0, Math.round(origin.x + dx));
        node.y = Math.max(0, Math.round(origin.y + dy));
      });
    } else if (this.edgeDrag) {
      this.edgeDrag.to = this.toCanvas(event);
    } else if (this.selectRect) {
      const p = this.toCanvas(event);
      const r = this.selectRect;
      r.x = Math.min(r.start.x, p.x);
      r.y = Math.min(r.start.y, p.y);
      r.width = Math.abs(p.x - r.start.x);
      r.height = Math.abs(p.y - r.start.y);
    }
  }

  private mouseUp(_event: MouseEvent): void {
    this.stopTracking();
    if (this.selectRect) {
      this.selectInRect(this.selectRect);
    }
    if (this.nodeDrag?.moved && this.automaticResize()) {
      this.adjustCanvasSize(false);
    }
    this.nodeDrag = null;
    this.edgeDrag = null;
    this.selectRect = null;
  }

  private selectInRect(r: SelectRect): void {
    if (r.width < 2 && r.height < 2) {
      return;
    }
    const inRect = (node: FcNode) =>
      node.x >= r.x && node.y >= r.y && node.x + NODE_BOX_WIDTH <= r.x + r.width && node.y + NODE_BOX_HEIGHT <= r.y + r.height;
    const selected = this.model().nodes.filter(inRect);
    selected.forEach((node) => {
      if (!node.readonly) {
        this.modelservice.select(node);
      }
    });
    for (const edge of this.model().edges) {
      const source = this.modelservice.nodes.getNodeByConnectorId(edge.source);
      const dest = this.modelservice.nodes.getNodeByConnectorId(edge.destination);
      if (source && dest && selected.indexOf(source) !== -1 && selected.indexOf(dest) !== -1) {
        this.modelservice.select(edge);
      }
    }
  }

  // ---- library drag and drop -------------------------------------------------

  protected nodeDragStart(event: DragEvent, node: FcNode): void {
    const target = this.dropTargetId();
    if (!target) {
      event.preventDefault();
      return;
    }
    const box = (event.currentTarget as HTMLElement).getBoundingClientRect();
    libraryDrag = { node, grab: { x: event.clientX - box.left, y: event.clientY - box.top }, dropTargetId: target };
    event.dataTransfer?.setData('text', String(node.id));
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'copy';
    }
  }

  protected nodeDragEnd(): void {
    libraryDrag = null;
  }

  private acceptsDrop(): boolean {
    return !!libraryDrag && libraryDrag.dropTargetId === this.host.nativeElement.id;
  }

  protected canvasDragOver(event: DragEvent): void {
    if (this.acceptsDrop()) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    }
  }

  protected canvasDrop(event: DragEvent): void {
    const drag = libraryDrag;
    if (!drag || !this.acceptsDrop()) {
      return;
    }
    event.preventDefault();
    libraryDrag = null;
    const p = this.toCanvas(event);
    const node: FcNode = {
      ...drag.node,
      x: Math.max(0, Math.round(p.x - drag.grab.x)),
      y: Math.max(0, Math.round(p.y - drag.grab.y)),
      connectors: [],
    };
    const fn = this.callbacks()?.dropNode;
    if (fn) {
      fn(event, node);
    } else {
      this.model().nodes.push(node);
    }
  }
}
