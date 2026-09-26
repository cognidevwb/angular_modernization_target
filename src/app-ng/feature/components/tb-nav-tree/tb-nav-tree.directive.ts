import { Component, inject, input, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS directive `tbNavTree` (module `thingsboard.directives.navTree`) in src/app/components/nav-tree.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 5 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-nav-tree',
  standalone: true,
  templateUrl: './tb-nav-tree.directive.html',
})
export class TbNavTreeDirective {
  readonly loadNodes = model<any>();
  readonly editCallbacks = model<any>();
  readonly enableSearch = input<any>();
  readonly onNodeSelected = output<any>();
  readonly onNodesInserted = output<any>();
  readonly searchCallback = output<any>();

  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly element = inject(ElementRef);
  protected readonly typesRef: any = types;

  types: any;
  treeElement: any;

  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): `vm.onNodeSelected` was an optional callback; an output is always there, so its check reads `true`
  // TODO(port): `vm.onNodesInserted` was an optional callback; an output is always there, so its check reads `true`
  // TODO(port): `vm.searchCallback(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): `vm.searchCallback` was an optional callback; an output is always there, so its check reads `true`

  constructor() {
    let vm = this;
    this.types = this.typesRef;
    $scope.$watch('vm.loadNodes', (newVal?: any) => {
        if (newVal) {
            this.initTree();
        }
    });
  }

  initTree(...rest: any[]): any {
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
        if (true) {
            config.search.search_callback = (searchText?: any, node?: any) => this.searchCallback.emit({searchText: searchText, node: node});
        }
    }

    this.treeElement = $('.tb-nav-tree-container', $(this.element.nativeElement))
        .jstree(config);

    this.treeElement.on("changed.jstree", (e?: any, data?: any) => {
        if (true) {
            this.onNodeSelected.emit({node: data.instance.get_selected(true)[0], event: e});
        }
    });

    this.treeElement.on("model.jstree", (e?: any, data?: any) => {
        if (true) {
            this.onNodesInserted.emit({nodes: data.nodes, parent: data.parent});
        }
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
            var node: any = this.treeElement.jstree('get_node', id);
            return node;
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
            return undefined;
        };
        this.editCallbacks().nodeIsLoaded = (id?: any) => {
            var node: any = this.treeElement.jstree('get_node', id);
            if (node) {
                return this.treeElement.jstree('is_loaded', node);
            } else {
                return true;
            }
            return undefined;
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
