import { AfterViewInit, Component, ElementRef, effect, inject, input, output } from '@angular/core';
import $ from 'jquery';
import 'jstree';

declare global {
  interface JQuery {
    /** jstree's jQuery plugin (the `jstree` package, as src/app/app.js loaded it). */
    jstree(...args: any[]): any;
  }
}

/** What the tree asks the host when searching: does `node` match `searchText`? */
export type NavTreeSearchCallback = (searchText: string, node: any) => boolean;

/**
 * Ported from the AngularJS directive `tbNavTree` (module `thingsboard.directives.navTree`) in src/app/components/nav-tree.directive.js:24:
 * a jstree over `loadNodes` (jstree's `core.data`), with the edit API written onto `editCallbacks`.
 * `searchCallback` was an optional `&` whose result jstree reads, so it is a function input.
 */
@Component({
  selector: 'tb-nav-tree',
  standalone: true,
  templateUrl: './tb-nav-tree.directive.html',
})
export class TbNavTreeDirective implements AfterViewInit {
  readonly loadNodes = input<any>();
  readonly editCallbacks = input<any>();
  readonly enableSearch = input<any>();
  readonly searchCallback = input<NavTreeSearchCallback | undefined>();
  readonly onNodeSelected = output<{ node: any; event: any }>();
  readonly onNodesInserted = output<{ nodes: any; parent: any }>();

  protected readonly element = inject(ElementRef);

  treeElement: any;
  private viewReady = false;
  private builtFor: any;

  constructor() {
    // `$scope.$watch('vm.loadNodes', …)`: (re)build the tree when the loader changes
    effect(() => {
      const loadNodes = this.loadNodes();
      if (this.viewReady) {
        this.buildFor(loadNodes);
      }
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    this.buildFor(this.loadNodes());
  }

  private buildFor(loadNodes: any): void {
    if (loadNodes && loadNodes !== this.builtFor) {
      this.builtFor = loadNodes;
      this.initTree();
    }
  }

  initTree(): void {
    var config: any = {
        core: {
            multiple: false,
            check_callback: true,
            themes: { name: 'proton', responsive: true },
            data: this.loadNodes()
        }
    };

    if (this.enableSearch()) {
        config.plugins = ["search"];
        config.search = {
            case_sensitive: false,
            show_only_matches: true,
            show_only_matches_children: false,
            search_leaves_only: false
        };
        const searchCallback = this.searchCallback();
        if (searchCallback) {
            config.search.search_callback = (searchText: string, node: any) => searchCallback(searchText, node);
        }
    }

    this.treeElement = $('.tb-nav-tree-container', $(this.element.nativeElement))
        .jstree(config);

    this.treeElement.on("changed.jstree", (e?: any, data?: any) => {
        this.onNodeSelected.emit({node: data.instance.get_selected(true)[0], event: e});
    });

    this.treeElement.on("model.jstree", (e?: any, data?: any) => {
        this.onNodesInserted.emit({nodes: data.nodes, parent: data.parent});
    });

    if (this.editCallbacks()) {
        this.editCallbacks().selectNode = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                this.treeElement.jstree('deselect_all', true);
                this.treeElement.jstree('select_node', node);
            }
        };
        this.editCallbacks().deselectAll = () => {
            this.treeElement.jstree('deselect_all');
        };
        this.editCallbacks().getNode = (id?: any) => {
            return this.treeElement.jstree('get_node', id);
        };
        this.editCallbacks().getParentNodeId = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                return this.treeElement.jstree('get_parent', node);
            }
            return undefined;
        };
        this.editCallbacks().openNode = (id?: any, cb?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                this.treeElement.jstree('open_node', node, cb);
            }
        };
        this.editCallbacks().nodeIsOpen = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                return this.treeElement.jstree('is_open', node);
            } else {
                return true;
            }
        };
        this.editCallbacks().nodeIsLoaded = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                return this.treeElement.jstree('is_loaded', node);
            } else {
                return true;
            }
        };
        this.editCallbacks().refreshNode = (id?: any) => {
            if (id === '#') {
                this.treeElement.jstree('refresh');
                this.treeElement.jstree('redraw');
            } else {
                var node: any = this.treeElement.jstree('get_node', id);
                if (node) {
                    var opened: any = this.treeElement.jstree('is_open', node);
                    this.treeElement.jstree('refresh_node', node);
                    this.treeElement.jstree('redraw');
                    if (node.children && opened/* && !node.children.length*/) {
                        this.treeElement.jstree('open_node', node);
                    }
                }
            }
        };
        this.editCallbacks().updateNode = (id?: any, newName?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                this.treeElement.jstree('rename_node', node, newName);
            }
        };
        this.editCallbacks().createNode = (parentId?: any, node?: any, pos?: any) => {
            var parentNode: any = this.treeElement.jstree('get_node', parentId);
            if (parentNode) {
                this.treeElement.jstree('create_node', parentNode, node, pos);
            }
        };
        this.editCallbacks().deleteNode = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                this.treeElement.jstree('delete_node', node);
            }
        };
        this.editCallbacks().disableNode = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                this.treeElement.jstree('disable_node', node);
            }
        };
        this.editCallbacks().enableNode = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                this.treeElement.jstree('enable_node', node);
            }
        };
        this.editCallbacks().setNodeHasChildren = (id?: any, hasChildren?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                if (!node.children || !node.children.length) {
                    node.children = hasChildren;
                    node.state.loaded = !hasChildren;
                    node.state.opened = false;
                    this.treeElement.jstree('_node_changed', node.id);
                    this.treeElement.jstree('redraw');
                }
            }
        };
        this.editCallbacks().search = (searchText?: any) => {
            this.treeElement.jstree('search', searchText);
        };
        this.editCallbacks().clearSearch = () => {
            this.treeElement.jstree('clear_search');
        };
    }
  }
}
