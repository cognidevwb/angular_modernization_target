import { Component, input, model, output } from '@angular/core';
import $ from 'jquery';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function NavTreeController(this: any, $scope?: any, $element?: any, types?: any) {

    var vm: any = this;
    vm.types = types;

    $scope.$onChanges = ($scope.$onChanges || function () {});
    Object.defineProperty(vm, 'loadNodes', {
        get: function () { return vm._loadNodes; },
        set: function (newVal: any) {
            vm._loadNodes = newVal;
            if (newVal) {
                initTree();
            }
        }
    });

    function initTree() {
        var config: any = {
            core: {
                multiple: false,
                check_callback: true,
                themes: { name: 'proton', responsive: true },
                data: vm.loadNodes
            }
        };

        if (vm.enableSearch) {
            config.plugins = ["search"];
            config.search = {
                case_sensitive: false,
                show_only_matches: true,
                show_only_matches_children: false,
                search_leaves_only: false
            };
            if (vm.searchCallback) {
                config.search.search_callback = (searchText?: any, node?: any) => vm.searchCallback({searchText: searchText, node: node});
            }
        }

        vm.treeElement = ($('.tb-nav-tree-container', $element) as any)
            .jstree(config);

        vm.treeElement.on("changed.jstree", function (e?: any, data?: any) {
            if (vm.onNodeSelected) {
                vm.onNodeSelected({node: data.instance.get_selected(true)[0], event: e});
            }
        });

        vm.treeElement.on("model.jstree", function (e?: any, data?: any) {
            if (vm.onNodesInserted) {
                vm.onNodesInserted({nodes: data.nodes, parent: data.parent});
            }
        });

        if (vm.editCallbacks) {
            vm.editCallbacks.selectNode = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    vm.treeElement.jstree('deselect_all', true);
                    vm.treeElement.jstree('select_node', node);
                }
            };
            vm.editCallbacks.deselectAll = () => {
                vm.treeElement.jstree('deselect_all');
            };
            vm.editCallbacks.getNode = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                return node;
            };
            vm.editCallbacks.getParentNodeId = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    return vm.treeElement.jstree('get_parent', node);
                }
                return undefined;
            };
            vm.editCallbacks.openNode = (id?: any, cb?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    vm.treeElement.jstree('open_node', node, cb);
                }
            };
            vm.editCallbacks.nodeIsOpen = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    return vm.treeElement.jstree('is_open', node);
                } else {
                    return true;
                }
                return undefined;
            };
            vm.editCallbacks.nodeIsLoaded = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    return vm.treeElement.jstree('is_loaded', node);
                } else {
                    return true;
                }
                return undefined;
            };
            vm.editCallbacks.refreshNode = (id?: any) => {
                if (id === '#') {
                    vm.treeElement.jstree('refresh');
                    vm.treeElement.jstree('redraw');
                } else {
                    var node: any = vm.treeElement.jstree('get_node', id);
                    if (node) {
                        var opened: any = vm.treeElement.jstree('is_open', node);
                        vm.treeElement.jstree('refresh_node', node);
                        vm.treeElement.jstree('redraw');
                        if (node.children && opened/* && !node.children.length*/) {
                            vm.treeElement.jstree('open_node', node);
                        }
                    }
                }
            };
            vm.editCallbacks.updateNode = (id?: any, newName?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    vm.treeElement.jstree('rename_node', node, newName);
                }
            };
            vm.editCallbacks.createNode = (parentId?: any, node?: any, pos?: any) => {
                var parentNode: any = vm.treeElement.jstree('get_node', parentId);
                if (parentNode) {
                    vm.treeElement.jstree('create_node', parentNode, node, pos);
                }
            };
            vm.editCallbacks.deleteNode = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    vm.treeElement.jstree('delete_node', node);
                }
            };
            vm.editCallbacks.disableNode = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    vm.treeElement.jstree('disable_node', node);
                }
            };
            vm.editCallbacks.enableNode = (id?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    vm.treeElement.jstree('enable_node', node);
                }
            };
            vm.editCallbacks.setNodeHasChildren = (id?: any, hasChildren?: any) => {
                var node: any = vm.treeElement.jstree('get_node', id);
                if (node) {
                    if (!node.children || !node.children.length) {
                        node.children = hasChildren;
                        node.state.loaded = !hasChildren;
                        node.state.opened = false;
                        vm.treeElement.jstree('_node_changed', node.id);
                        vm.treeElement.jstree('redraw');
                    }
                }
            };
            vm.editCallbacks.search = (searchText?: any) => {
                vm.treeElement.jstree('search', searchText);
            };
            vm.editCallbacks.clearSearch = () => {
                vm.treeElement.jstree('clear_search');
            };
        }
    }
}

/**
 * Ported from the AngularJS directive `tbNavTree` (module `thingsboard.directives.navTree`) in src/app/components/nav-tree.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
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

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            loadNodes: '=',
            editCallbacks: '=',
            enableSearch: '@?',
            onNodeSelected: '&',
            onNodesInserted: '&',
            searchCallback: '&?'
        };
  controller: any = NavTreeController;
  controllerAs: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
