/**
 * The model ngFlowchart worked on, kept as it was so the rule chain editor's
 * load/save code reads and writes the same shape: a model of `nodes` (x/y,
 * `connectors` typed left/right) and `edges` (connector id → connector id),
 * and a `selectedObjects` array holding the selected nodes and edges.
 *
 * `FlowchartModelService` is the port of ngFlowchart's `Modelfactory`: the
 * operations the controller calls (`nodes.getConnectorsByType`,
 * `edges.delete`, `deleteSelected` …), over the same arrays.
 */

export const flowchartConstants = {
  leftConnectorType: 'leftConnector',
  rightConnectorType: 'rightConnector',
  curvedStyle: 'curved',
  lineStyle: 'line',
} as const;

export interface FcConnector {
  id: any;
  type: string;
}

export interface FcNode {
  id: any;
  x: number;
  y: number;
  connectors: FcConnector[];
  readonly?: boolean;
  [key: string]: any;
}

export interface FcEdge {
  source: any;
  destination: any;
  label?: string;
  [key: string]: any;
}

export interface FcModel {
  nodes: FcNode[];
  edges: FcEdge[];
}

/** What sits under a point of the canvas (`getItemInfoAtPoint`). */
export interface FcItemInfo {
  node?: FcNode;
  edge?: FcEdge;
}

export class FlowchartModelService {
  readonly nodes = {
    getConnectorsByType: (node: FcNode, type: string): FcConnector[] =>
      (node?.connectors ?? []).filter((c) => c.type === type),

    getNodeByConnectorId: (connectorId: any): FcNode | undefined =>
      this.model.nodes.find((n) => (n.connectors ?? []).some((c) => c.id === connectorId)),

    getConnectorById: (connectorId: any): FcConnector | undefined => {
      for (const node of this.model.nodes) {
        const c = (node.connectors ?? []).find((con) => con.id === connectorId);
        if (c) {
          return c;
        }
      }
      return undefined;
    },

    getSelectedNodes: (): FcNode[] => this.model.nodes.filter((n) => this.isSelected(n)),

    isSelected: (node: FcNode): boolean => this.isSelected(node),

    select: (node: FcNode): void => this.select(node),

    deselect: (node: FcNode): void => this.deselect(node),

    toggleSelected: (node: FcNode): void => this.toggleSelected(node),

    delete: (node: FcNode): void => {
      if (!node || node.readonly) {
        return;
      }
      const index = this.model.nodes.indexOf(node);
      if (index === -1) {
        return;
      }
      this.deselect(node);
      const connectorIds = new Set((node.connectors ?? []).map((c) => c.id));
      for (let i = this.model.edges.length - 1; i >= 0; i--) {
        const edge = this.model.edges[i];
        if (connectorIds.has(edge.source) || connectorIds.has(edge.destination)) {
          this.edges.delete(edge);
        }
      }
      this.model.nodes.splice(this.model.nodes.indexOf(node), 1);
    },
  };

  readonly edges = {
    getSelectedEdges: (): FcEdge[] => this.model.edges.filter((e) => this.isSelected(e)),

    isSelected: (edge: FcEdge): boolean => this.isSelected(edge),

    select: (edge: FcEdge): void => this.select(edge),

    deselect: (edge: FcEdge): void => this.deselect(edge),

    toggleSelected: (edge: FcEdge): void => this.toggleSelected(edge),

    delete: (edge: FcEdge): void => {
      const index = this.model.edges.indexOf(edge);
      if (index === -1) {
        return;
      }
      this.deselect(edge);
      this.model.edges.splice(index, 1);
    },
  };

  constructor(
    readonly model: FcModel,
    readonly selectedObjects: any[],
    private readonly canvas?: () => HTMLElement | null,
    private readonly itemAt?: (x: number, y: number) => FcItemInfo,
  ) {}

  /** A canvas that is a drop source (the node library) is not editable. */
  editable = true;

  isEditable(): boolean {
    return this.editable;
  }

  isSelected(object: any): boolean {
    return this.selectedObjects.indexOf(object) !== -1;
  }

  select(object: any): void {
    if (object && !this.isSelected(object)) {
      this.selectedObjects.push(object);
    }
  }

  deselect(object: any): void {
    const index = this.selectedObjects.indexOf(object);
    if (index !== -1) {
      this.selectedObjects.splice(index, 1);
    }
  }

  toggleSelected(object: any): void {
    if (this.isSelected(object)) {
      this.deselect(object);
    } else {
      this.select(object);
    }
  }

  selectAll(): void {
    this.model.nodes.forEach((node) => {
      if (!node.readonly) {
        this.select(node);
      }
    });
    this.model.edges.forEach((edge) => this.select(edge));
  }

  deselectAll(): void {
    this.selectedObjects.length = 0;
  }

  deleteSelected(): void {
    this.edges.getSelectedEdges().forEach((edge) => this.edges.delete(edge));
    this.nodes.getSelectedNodes().forEach((node) => this.nodes.delete(node));
  }

  getCanvasHtmlElement(): HTMLElement | null {
    return this.canvas ? this.canvas() : null;
  }

  getItemInfoAtPoint(x: number, y: number): FcItemInfo {
    return this.itemAt ? this.itemAt(x, y) : {};
  }
}
