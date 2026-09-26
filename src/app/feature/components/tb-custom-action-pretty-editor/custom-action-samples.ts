/**
 * The samples a new custom (pretty) action starts with, as written in
 * src/app/components/widget/action/custom-action-pretty-editor.directive.js.
 */

/** The action's JavaScript: delete / edit / add entity examples, commented out. */
export const SAMPLE_JS_FUNCTION = "/*=======================================================================*/\n" +
            "/*=====  There are three examples: for delete, edit and add entity  =====*/\n" +
            "/*=======================================================================*/\n" +
            "/*=======================  Delete entity example  =======================*/\n" +
            "/*=======================================================================*/\n" +
            "//\n" +
            "//var $injector = widgetContext.$scope.$injector;\n" +
            "//var $mdDialog = $injector.get('$mdDialog'),\n" +
            "//    $document = $injector.get('$document'),\n" +
            "//    types = $injector.get('types'),\n" +
            "//    assetService = $injector.get('assetService'),\n" +
            "//    deviceService = $injector.get('deviceService')\n" +
            "//    $rootScope = $injector.get('$rootScope'),\n" +
            "//    $q = $injector.get('$q');\n" +
            "//\n" +
            "//openDeleteEntityDialog();\n" +
            "//\n" +
            "//function openDeleteEntityDialog() {\n" +
            "//    var title = 'Delete ' + entityId.entityType\n" +
            "//        .toLowerCase() + ' ' +\n" +
            "//        entityName;\n" +
            "//    var content = 'Are you sure you want to delete the ' +\n" +
            "//        entityId.entityType.toLowerCase() + ' ' +\n" +
            "//        entityName + '?';\n" +
            "//    var confirm = $mdDialog.confirm()\n" +
            "//        .targetEvent($event)\n" +
            "//        .title(title)\n" +
            "//        .htmlContent(content)\n" +
            "//        .ariaLabel(title)\n" +
            "//        .cancel('Cancel')\n" +
            "//        .ok('Delete');\n" +
            "//    $mdDialog.show(confirm).then(function() {\n" +
            "//        deleteEntity();\n" +
            "//    })\n" +
            "//}\n" +
            "//\n" +
            "//function deleteEntity() {\n" +
            "//    deleteEntityPromise(entityId).then(\n" +
            "//        function success() {\n" +
            "//            updateAliasData();\n" +
            "//        },\n" +
            "//        function fail() {\n" +
            "//            showErrorDialog();\n" +
            "//        }\n" +
            "//    );\n" +
            "//}\n" +
            "//\n" +
            "//function deleteEntityPromise(entityId) {\n" +
            "//    if (entityId.entityType == types.entityType.asset) {\n" +
            "//        return assetService.deleteAsset(entityId.id);\n" +
            "//    } else if (entityId.entityType == types.entityType.device) {\n" +
            "//        return deviceService.deleteDevice(entityId.id);\n" +
            "//    }\n" +
            "//}\n" +
            "//\n" +
            "//function updateAliasData() {\n" +
            "//    var aliasIds = [];\n" +
            "//    for (var id in widgetContext.aliasController.resolvedAliases) {\n" +
            "//        aliasIds.push(id);\n" +
            "//    }\n" +
            "//    var tasks = [];\n" +
            "//    aliasIds.forEach(function(aliasId) {\n" +
            "//        widgetContext.aliasController.setAliasUnresolved(aliasId);\n" +
            "//        tasks.push(widgetContext.aliasController.getAliasInfo(aliasId));\n" +
            "//    });\n" +
            "//    $q.all(tasks).then(function() {\n" +
            "//        $rootScope.$broadcast('entityAliasesChanged', aliasIds);\n" +
            "//    });\n" +
            "//}\n" +
            "//\n" +
            "//function showErrorDialog() {\n" +
            "//    var title = 'Error';\n" +
            "//    var content = 'An error occurred while deleting the entity. Please try again.';\n" +
            "//    var alert = $mdDialog.alert()\n" +
            "//        .title(title)\n" +
            "//        .htmlContent(content)\n" +
            "//        .ariaLabel(title)\n" +
            "//        .parent(angular.element($document[0].body))\n" +
            "//        .targetEvent($event)\n" +
            "//        .multiple(true)\n" +
            "//        .clickOutsideToClose(true)\n" +
            "//        .ok('CLOSE');\n" +
            "//    $mdDialog.show(alert);\n" +
            "//}\n" +
            "//\n" +
            "/*=======================================================================*/\n" +
            "/*========================  Edit entity example  ========================*/\n" +
            "/*=======================================================================*/\n" +
            "//\n" +
            "//var $injector = widgetContext.$scope.$injector;\n" +
            "//var $mdDialog = $injector.get('$mdDialog'),\n" +
            "//    $document = $injector.get('$document'),\n" +
            "//    $q = $injector.get('$q'),\n" +
            "//    types = $injector.get('types'),\n" +
            "//    $rootScope = $injector.get('$rootScope'),\n" +
            "//    entityService = $injector.get('entityService'),\n" +
            "//    attributeService = $injector.get('attributeService'),\n" +
            "//    entityRelationService = $injector.get('entityRelationService');\n" +
            "//\n" +
            "//openEditEntityDialog();\n" +
            "//\n" +
            "//function openEditEntityDialog() {\n" +
            "//    $mdDialog.show({\n" +
            "//        controller: ['$scope','$mdDialog', EditEntityDialogController],\n" +
            "//        controllerAs: 'vm',\n" +
            "//        template: htmlTemplate,\n" +
            "//        locals: {\n" +
            "//            entityId: entityId\n" +
            "//        },\n" +
            "//        parent: angular.element($document[0].body),\n" +
            "//        targetEvent: $event,\n" +
            "//        multiple: true,\n" +
            "//        clickOutsideToClose: false\n" +
            "//    });\n" +
            "//}\n" +
            "//\n" +
            "//function EditEntityDialogController($scope,$mdDialog) {\n" +
            "//    var vm = this;\n" +
            "//    vm.entityId = entityId;\n" +
            "//    vm.entityName = entityName;\n" +
            "//    vm.entityType = entityId.entityType;\n" +
            "//    vm.allowedEntityTypes = [types.entityType.asset, types.entityType.device];\n" +
            "//    vm.allowedRelatedEntityTypes = [];\n" +
            "//    vm.entitySearchDirection = types.entitySearchDirection;\n" +
            "//    vm.attributes = {};\n" +
            "//    vm.serverAttributes = {};\n" +
            "//    vm.relations = [];\n" +
            "//    vm.newRelations = [];\n" +
            "//    vm.relationsToDelete = [];\n" +
            "//    getEntityInfo();\n" +
            "//    \n" +
            "//    vm.addRelation = function() {\n" +
            "//        var relation = {\n" +
            "//            direction: null,\n" +
            "//            relationType: null,\n" +
            "//            relatedEntity: null\n" +
            "//        };\n" +
            "//        vm.newRelations.push(relation);\n" +
            "//        $scope.editEntityForm.$setDirty();\n" +
            "//    };\n" +
            "//    vm.removeRelation = function(index) {\n" +
            "//        if (index > -1) {\n" +
            "//            vm.newRelations.splice(index, 1);\n" +
            "//            $scope.editEntityForm.$setDirty();\n" +
            "//        }\n" +
            "//    };\n" +
            "//    vm.removeOldRelation = function(index, relation) {\n" +
            "//        if (index > -1) {\n" +
            "//            vm.relations.splice(index, 1);\n" +
            "//            vm.relationsToDelete.push(relation);\n" +
            "//            $scope.editEntityForm.$setDirty();\n" +
            "//        }\n" +
            "//    };\n" +
            "//    vm.save = function() {\n" +
            "//        saveAttributes();\n" +
            "//        saveRelations();\n" +
            "//        $scope.editEntityForm.$setPristine();\n" +
            "//    };\n" +
            "//    vm.cancel = function() {\n" +
            "//        $mdDialog.hide();\n" +
            "//    };\n" +
            "//    \n" +
            "//    function getEntityAttributes(attributes) {\n" +
            "//        for (var i = 0; i < attributes.length; i++) {\n" +
            "//              vm.attributes[attributes[i].key] = attributes[i].value; \n" +
            "//        }\n" +
            "//        vm.serverAttributes = angular.copy(vm.attributes);\n" +
            "//    }\n" +
            "//    \n" +
            "//    function getEntityRelations(relations) {\n" +
            "//        var relationsFrom = relations[0];\n" +
            "//        var relationsTo = relations[1];\n" +
            "//        for (var i=0; i < relationsFrom.length; i++) {\n" +
            "//            var relation = {\n" +
            "//                direction: types.entitySearchDirection.from,\n" +
            "//                relationType: relationsFrom[i].type,\n" +
            "//                relatedEntity: relationsFrom[i].to\n" +
            "//            };\n" +
            "//            vm.relations.push(relation);\n" +
            "//        }\n" +
            "//        for (var i=0; i < relationsTo.length; i++) {\n" +
            "//            var relation = {\n" +
            "//                direction: types.entitySearchDirection.to,\n" +
            "//                relationType: relationsTo[i].type,\n" +
            "//                relatedEntity: relationsTo[i].from\n" +
            "//            };\n" +
            "//            vm.relations.push(relation);\n" +
            "//        }\n" +
            "//    }\n" +
            "//    \n" +
            "//    function getEntityInfo() {\n" +
            "//        entityService.getEntity(entityId.entityType, entityId.id).then(\n" +
            "//            function(entity) {\n" +
            "//                vm.entity = entity;\n" +
            "//                vm.type = vm.entity.type;\n" +
            "//            });\n" +
            "//        attributeService.getEntityAttributesValues(entityId.entityType, entityId.id, 'SERVER_SCOPE').then(\n" +
            "//            function(data){\n" +
            "//                if (data.length) {\n" +
            "//                    getEntityAttributes(data);\n" +
            "//                }\n" +
            "//            });\n" +
            "//        $q.all([entityRelationService.findInfoByFrom(entityId.id, entityId.entityType), entityRelationService.findInfoByTo(entityId.id, entityId.entityType)]).then(\n" +
            "//            function(relations){\n" +
            "//                getEntityRelations(relations);\n" +
            "//            });\n" +
            "//    }\n" +
            "//    \n" +
            "//    function saveAttributes() {\n" +
            "//        var attributesArray = [];\n" +
            "//        for (var key in vm.attributes) {\n" +
            "//            if (vm.attributes[key] !== vm.serverAttributes[key]) {\n" +
            "//                attributesArray.push({key: key, value: vm.attributes[key]});\n" +
            "//            }\n" +
            "//        }\n" +
            "//        if (attributesArray.length > 0) {\n" +
            "//            attributeService.saveEntityAttributes(entityId.entityType, entityId.id, \"SERVER_SCOPE\", attributesArray);\n" +
            "//        } \n" +
            "//    }\n" +
            "//    \n" +
            "//    function saveRelations() {\n" +
            "//        var tasks = [];\n" +
            "//        for (var i=0; i < vm.newRelations.length; i++) {\n" +
            "//            var relation = {\n" +
            "//                type: vm.newRelations[i].relationType\n" +
            "//            };\n" +
            "//            if (vm.newRelations[i].direction == types.entitySearchDirection.from) {\n" +
            "//                relation.to = vm.newRelations[i].relatedEntity;\n" +
            "//                relation.from = entityId;\n" +
            "//            } else {\n" +
            "//                relation.to = entityId;\n" +
            "//                relation.from = vm.newRelations[i].relatedEntity;\n" +
            "//            }\n" +
            "//            tasks.push(entityRelationService.saveRelation(relation));\n" +
            "//        }\n" +
            "//        for (var i=0; i < vm.relationsToDelete.length; i++) {\n" +
            "//            var relation = {\n" +
            "//                type: vm.relationsToDelete[i].relationType\n" +
            "//            };\n" +
            "//            if (vm.relationsToDelete[i].direction == types.entitySearchDirection.from) {\n" +
            "//                relation.to = vm.relationsToDelete[i].relatedEntity;\n" +
            "//                relation.from = entityId;\n" +
            "//            } else {\n" +
            "//                relation.to = entityId;\n" +
            "//                relation.from = vm.relationsToDelete[i].relatedEntity;\n" +
            "//            }\n" +
            "//            tasks.push(entityRelationService.deleteRelation(relation.from.id, relation.from.entityType, relation.type, relation.to.id, relation.to.entityType));\n" +
            "//        }\n" +
            "//        $q.all(tasks).then(function(){\n" +
            "//            vm.relations = vm.relations.concat(vm.newRelations);\n" +
            "//            vm.newRelations = [];\n" +
            "//            vm.relationsToDelete = [];\n" +
            "//            updateAliasData();\n" +
            "//        });\n" +
            "//    }\n" +
            "//    \n" +
            "//    function updateAliasData() {\n" +
            "//        var aliasIds = [];\n" +
            "//        for (var id in widgetContext.aliasController.resolvedAliases) {\n" +
            "//            aliasIds.push(id);\n" +
            "//        }\n" +
            "//        var tasks = [];\n" +
            "//        aliasIds.forEach(function(aliasId) {\n" +
            "//            widgetContext.aliasController.setAliasUnresolved(aliasId);\n" +
            "//            tasks.push(widgetContext.aliasController.getAliasInfo(aliasId));\n" +
            "//        });\n" +
            "//        $q.all(tasks).then(function() {\n" +
            "//            $rootScope.$broadcast('entityAliasesChanged', aliasIds);\n" +
            "//        });\n" +
            "//    }\n" +
            "//}\n" +
            "//\n" +
            "/*========================================================================*/\n" +
            "/*=========================  Add entity example  =========================*/\n" +
            "/*========================================================================*/\n" +
            "//\n" +
            "//var $injector = widgetContext.$scope.$injector;\n" +
            "//var $mdDialog = $injector.get('$mdDialog'),\n" +
            "//    $document = $injector.get('$document'),\n" +
            "//    $q = $injector.get('$q'),\n" +
            "//    $rootScope = $injector.get('$rootScope'),\n" +
            "//    types = $injector.get('types'),\n" +
            "//    assetService = $injector.get('assetService'),\n" +
            "//    deviceService = $injector.get('deviceService'),\n" +
            "//    attributeService = $injector.get('attributeService'),\n" +
            "//    entityRelationService = $injector.get('entityRelationService');\n" +
            "//\n" +
            "//openAddEntityDialog();\n" +
            "//\n" +
            "//function openAddEntityDialog() {\n" +
            "//    $mdDialog.show({\n" +
            "//        controller: ['$scope','$mdDialog', AddEntityDialogController],\n" +
            "//        controllerAs: 'vm',\n" +
            "//        template: htmlTemplate,\n" +
            "//        locals: {\n" +
            "//            entityId: entityId\n" +
            "//        },\n" +
            "//        parent: angular.element($document[0].body),\n" +
            "//        targetEvent: $event,\n" +
            "//        multiple: true,\n" +
            "//        clickOutsideToClose: false\n" +
            "//    });\n" +
            "//}\n" +
            "//\n" +
            "//function AddEntityDialogController($scope, $mdDialog) {\n" +
            "//    var vm = this;\n" +
            "//    vm.allowedEntityTypes = [types.entityType.asset, types.entityType.device];\n" +
            "//    vm.allowedRelatedEntityTypes = [];\n" +
            "//    vm.entitySearchDirection = types.entitySearchDirection;\n" +
            "//    vm.attributes = {};\n" +
            "//    vm.relations = [];\n" +
            "//    \n" +
            "//    vm.addRelation = function() {\n" +
            "//        var relation = {\n" +
            "//            direction: null,\n" +
            "//            relationType: null,\n" +
            "//            relatedEntity: null\n" +
            "//        };\n" +
            "//        vm.relations.push(relation);\n" +
            "//    };\n" +
            "//    vm.removeRelation = function(index) {\n" +
            "//        if (index > -1) {\n" +
            "//            vm.relations.splice(index, 1);\n" +
            "//        }\n" +
            "//    };\n" +
            "//    vm.save = function() {\n" +
            "//        $scope.addEntityForm.$setPristine();\n" +
            "//        saveEntityPromise().then(\n" +
            "//            function (entity) {\n" +
            "//                saveAttributes(entity.id);\n" +
            "//                saveRelations(entity.id);\n" +
            "//                $mdDialog.hide();\n" +
            "//            }\n" +
            "//        );\n" +
            "//    };\n" +
            "//    vm.cancel = function() {\n" +
            "//        $mdDialog.hide();\n" +
            "//    };\n" +
            "//    \n" +
            "//    \n" +
            "//    function saveEntityPromise() {\n" +
            "//        var entity = {\n" +
            "//            name: vm.entityName,\n" +
            "//            type: vm.type\n" +
            "//        };\n" +
            "//        if (vm.entityType == types.entityType.asset) {\n" +
            "//            return assetService.saveAsset(entity);\n" +
            "//        } else if (vm.entityType == types.entityType.device) {\n" +
            "//            return deviceService.saveDevice(entity);\n" +
            "//        }\n" +
            "//    }\n" +
            "//    \n" +
            "//    function saveAttributes(entityId) {\n" +
            "//        var attributesArray = [];\n" +
            "//        for (var key in vm.attributes) {\n" +
            "//            attributesArray.push({key: key, value: vm.attributes[key]});\n" +
            "//        }\n" +
            "//        if (attributesArray.length > 0) {\n" +
            "//            attributeService.saveEntityAttributes(entityId.entityType, entityId.id, \"SERVER_SCOPE\", attributesArray);\n" +
            "//        } \n" +
            "//    }\n" +
            "//    \n" +
            "//    function saveRelations(entityId) {\n" +
            "//        var tasks = [];\n" +
            "//        for (var i=0; i < vm.relations.length; i++) {\n" +
            "//            var relation = {\n" +
            "//                type: vm.relations[i].relationType\n" +
            "//            };\n" +
            "//            if (vm.relations[i].direction == types.entitySearchDirection.from) {\n" +
            "//                relation.to = vm.relations[i].relatedEntity;\n" +
            "//                relation.from = entityId;\n" +
            "//            } else {\n" +
            "//                relation.to = entityId;\n" +
            "//                relation.from = vm.relations[i].relatedEntity;\n" +
            "//            }\n" +
            "//            tasks.push(entityRelationService.saveRelation(relation));\n" +
            "//        }\n" +
            "//        $q.all(tasks).then(function(){\n" +
            "//            updateAliasData();\n" +
            "//        });\n" +
            "//    }\n" +
            "//    \n" +
            "//    function updateAliasData() {\n" +
            "//        var aliasIds = [];\n" +
            "//        for (var id in widgetContext.aliasController.resolvedAliases) {\n" +
            "//            aliasIds.push(id);\n" +
            "//        }\n" +
            "//        var tasks = [];\n" +
            "//        aliasIds.forEach(function(aliasId) {\n" +
            "//            widgetContext.aliasController.setAliasUnresolved(aliasId);\n" +
            "//            tasks.push(widgetContext.aliasController.getAliasInfo(aliasId));\n" +
            "//        });\n" +
            "//        $q.all(tasks).then(function() {\n" +
            "//            $rootScope.$broadcast('widgetForceReInit');\n" +
            "//        });\n" +
            "//    }\n" +
            "//}\n";

/** The dialog template the sample function shows. */
export const SAMPLE_HTML_TEMPLATE = '<!--=======================================================================-->\n' +
            '<!--=====  There are two example templates: for edit and add entity   =====-->\n' +
            '<!--=======================================================================-->\n' +
            '<!--========================  Edit entity example  ========================-->\n' +
            '<!--=======================================================================-->\n' +
            '<!-- -->\n' +
            '<!--<md-dialog aria-label="Edit entity">-->\n' +
            '<!--    <form name="editEntityForm" class="edit-entity-form" ng-submit="vm.save()">-->\n' +
            '<!--        <md-toolbar>-->\n' +
            '<!--            <div class="md-toolbar-tools">-->\n' +
            '<!--                <h2>Edit {{vm.entityType.toLowerCase()}} {{vm.entityName}}</h2>-->\n' +
            '<!--                <span flex></span>-->\n' +
            '<!--                <md-button class="md-icon-button" ng-click="vm.cancel()">-->\n' +
            '<!--                    <ng-md-icon icon="close" aria-label="Close"></ng-md-icon>-->\n' +
            '<!--                </md-button>-->\n' +
            '<!--            </div>-->\n' +
            '<!--        </md-toolbar>-->\n' +
            '<!--        <md-dialog-content>-->\n' +
            '<!--            <div class="md-dialog-content">-->\n' +
            '<!--                <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Entity Name</label>-->\n' +
            '<!--                        <input ng-model="vm.entityName" readonly>-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Entity Type</label>-->\n' +
            '<!--                        <input ng-model="vm.entityType" readonly>-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Type</label>-->\n' +
            '<!--                        <input ng-model="vm.type" readonly>-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Latitude</label>-->\n' +
            '<!--                        <input name="latitude" type="number" step="any" ng-model="vm.attributes.latitude">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Longitude</label>-->\n' +
            '<!--                        <input name="longitude" type="number" step="any" ng-model="vm.attributes.longitude">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                 <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Address</label>-->\n' +
            '<!--                        <input ng-model="vm.attributes.address">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Owner</label>-->\n' +
            '<!--                        <input ng-model="vm.attributes.owner">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Integer Value</label>-->\n' +
            '<!--                        <input name="integerNumber" type="number" step="1" ng-pattern="/^-?[0-9]+$/" ng-model="vm.attributes.number">-->\n' +
            '<!--                        <div ng-messages="editEntityForm.integerNumber.$error">-->\n' +
            '<!--                            <div ng-message="pattern">Invalid integer value.</div>-->\n' +
            '<!--                        </div>-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <div class="boolean-value-input" layout="column" layout-align="center start" flex>-->\n' +
            '<!--                        <label class="checkbox-label">Boolean Value</label>-->\n' +
            '<!--                        <md-checkbox ng-model="vm.attributes.booleanValue" style="margin-bottom: 40px;">-->\n' +
            '<!--                            {{ (vm.attributes.booleanValue ? "value.true" : "value.false") | translate }}-->\n' +
            '<!--                        </md-checkbox>-->\n' +
            '<!--                    </div>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                <div class="relations-list old-relations">-->\n' +
            '<!--                    <div class="md-body-1" style="padding-bottom: 10px; color: rgba(0,0,0,0.57);">Relations</div>-->\n' +
            '<!--                    <div class="body" ng-show="vm.relations.length">-->\n' +
            '<!--                        <div class="row" layout="row" layout-align="start center" ng-repeat="relation in vm.relations track by $index">-->\n' +
            '<!--                            <div class="md-whiteframe-1dp" flex layout="row" style="padding-left: 5px; margin-bottom: 3px;">-->\n' +
            '<!--                                <div flex layout="column">-->\n' +
            '<!--                                    <div layout="row">-->\n' +
            '<!--                                        <md-input-container class="md-block" style="min-width: 100px;">-->\n' +
            '<!--                                            <label>Direction</label>-->\n' +
            '<!--                                            <md-select ng-disabled="true" required ng-model="relation.direction">-->\n' +
            '<!--                                                <md-option ng-repeat="direction in vm.entitySearchDirection" ng-value="direction">-->\n' +
            '<!--                                                    {{ ("relation.search-direction." + direction) | translate}}-->\n' +
            '<!--                                                </md-option>-->\n' +
            '<!--                                            </md-select>-->\n' +
            '<!--                                        </md-input-container>-->\n' +
            '<!--                                        <tb-relation-type-autocomplete ng-disabled="true" flex class="md-block"-->\n' +
            '<!--                                           the-form="editEntityForm"-->\n' +
            '<!--                                           ng-model="relation.relationType"-->\n' +
            '<!--                                           tb-required="true">-->\n' +
            '<!--                                        </tb-relation-type-autocomplete>-->\n' +
            '<!--                                    </div>-->\n' +
            '<!--                                    <div layout="row">-->\n' +
            '<!--                                        <tb-entity-select flex class="md-block"-->\n' +
            '<!--                                            the-form="editEntityForm"-->\n' +
            '<!--                                            ng-disabled="true"-->\n' +
            '<!--                                            tb-required="true"-->\n' +
            '<!--                                            ng-model="relation.relatedEntity">-->\n' +
            '<!--                                        </tb-entity-select>-->\n' +
            '<!--                                    </div>-->\n' +
            '<!--                                </div>-->\n' +
            '<!--                                <div layout="column" layout-align="center center">-->\n' +
            '<!--                                    <md-button class="md-icon-button md-primary" style="width: 40px; min-width: 40px;"-->\n' +
            '<!--                                               ng-click="vm.removeOldRelation($index,relation)" aria-label="Remove">-->\n' +
            '<!--                                        <md-tooltip md-direction="top">Remove relation</md-tooltip>-->\n' +
            '<!--                                        <md-icon aria-label="Remove" class="material-icons">-->\n' +
            '<!--                                            close-->\n' +
            '<!--                                        </md-icon>-->\n' +
            '<!--                                    </md-button>-->\n' +
            '<!--                                </div>-->\n' +
            '<!--                            </div>-->\n' +
            '<!--                        </div>-->\n' +
            '<!--                    </div>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                <div class="relations-list">-->\n' +
            '<!--                    <div class="md-body-1" style="padding-bottom: 10px; color: rgba(0,0,0,0.57);">New Relations</div>-->\n' +
            '<!--                    <div class="body" ng-show="vm.newRelations.length">-->\n' +
            '<!--                        <div class="row" layout="row" layout-align="start center" ng-repeat="relation in vm.newRelations track by $index">-->\n' +
            '<!--                            <div class="md-whiteframe-1dp" flex layout="row" style="padding-left: 5px; margin-bottom: 3px;">-->\n' +
            '<!--                                <div flex layout="column">-->\n' +
            '<!--                                    <div layout="row">-->\n' +
            '<!--                                        <md-input-container class="md-block" style="min-width: 100px;">-->\n' +
            '<!--                                            <label>Direction</label>-->\n' +
            '<!--                                            <md-select name="direction" required ng-model="relation.direction">-->\n' +
            '<!--                                                <md-option ng-repeat="direction in vm.entitySearchDirection" ng-value="direction">-->\n' +
            '<!--                                                    {{ ("relation.search-direction." + direction) | translate}}-->\n' +
            '<!--                                                </md-option>-->\n' +
            '<!--                                            </md-select>-->\n' +
            '<!--                                            <div ng-messages="editEntityForm.direction.$error">-->\n' +
            '<!--                                                <div ng-message="required">Relation direction is required.</div>-->\n' +
            '<!--                                            </div>-->\n' +
            '<!--                                        </md-input-container>-->\n' +
            '<!--                                        <tb-relation-type-autocomplete flex class="md-block"-->\n' +
            '<!--                                           the-form="editEntityForm"-->\n' +
            '<!--                                           ng-model="relation.relationType"-->\n' +
            '<!--                                           tb-required="true">-->\n' +
            '<!--                                        </tb-relation-type-autocomplete>-->\n' +
            '<!--                                    </div>-->\n' +
            '<!--                                    <div layout="row">-->\n' +
            '<!--                                        <tb-entity-select flex class="md-block"-->\n' +
            '<!--                                            the-form="editEntityForm"-->\n' +
            '<!--                                            tb-required="true"-->\n' +
            '<!--                                            ng-model="relation.relatedEntity">-->\n' +
            '<!--                                        </tb-entity-select>-->\n' +
            '<!--                                    </div>-->\n' +
            '<!--                                </div>-->\n' +
            '<!--                                <div layout="column" layout-align="center center">-->\n' +
            '<!--                                    <md-button class="md-icon-button md-primary" style="width: 40px; min-width: 40px;"-->\n' +
            '<!--                                               ng-click="vm.removeRelation($index)" aria-label="Remove">-->\n' +
            '<!--                                        <md-tooltip md-direction="top">Remove relation</md-tooltip>-->\n' +
            '<!--                                        <md-icon aria-label="Remove" class="material-icons">-->\n' +
            '<!--                                            close-->\n' +
            '<!--                                        </md-icon>-->\n' +
            '<!--                                    </md-button>-->\n' +
            '<!--                                </div>-->\n' +
            '<!--                            </div>-->\n' +
            '<!--                        </div>-->\n' +
            '<!--                    </div>-->\n' +
            '<!--                   <div>-->\n' +
            '<!--                       <md-button class="md-primary md-raised" ng-click="vm.addRelation()" aria-label="Add">-->\n' +
            '<!--                           <md-tooltip md-direction="top">Add Relation</md-tooltip>-->\n' +
            '<!--                           Add-->\n' +
            '<!--                       </md-button>-->\n' +
            '<!--                   </div> -->\n' +
            '<!--                </div>-->\n' +
            '<!--            </div>-->\n' +
            '<!--        </md-dialog-content>-->\n' +
            '<!--        <md-dialog-actions>-->\n' +
            '<!--            <md-button type="submit" ng-disabled="editEntityForm.$invalid || !editEntityForm.$dirty" class="md-raised md-primary">Save</md-button>-->\n' +
            '<!--            <md-button ng-click="vm.cancel()" class="md-primary">Cancel</md-button>-->\n' +
            '<!--        </md-dialog-actions>-->\n' +
            '<!--    </form>-->\n' +
            '<!--</md-dialog>-->\n' +
            '<!---->\n' +
            '<!--========================================================================-->\n' +
            '<!--=========================  Add entity example  =========================-->\n' +
            '<!--========================================================================-->\n' +
            '<!---->\n' +
            '<!--<md-dialog aria-label="Add entity">-->\n' +
            '<!--    <form name="addEntityForm" class="add-entity-form" ng-submit="vm.save()">-->\n' +
            '<!--        <md-toolbar>-->\n' +
            '<!--            <div class="md-toolbar-tools">-->\n' +
            '<!--                <h2>Add entity</h2>-->\n' +
            '<!--                <span flex></span>-->\n' +
            '<!--                <md-button class="md-icon-button" ng-click="vm.cancel()">-->\n' +
            '<!--                    <ng-md-icon icon="close" aria-label="Close"></ng-md-icon>-->\n' +
            '<!--                </md-button>-->\n' +
            '<!--            </div>-->\n' +
            '<!--        </md-toolbar>-->\n' +
            '<!--        <md-dialog-content>-->\n' +
            '<!--            <div class="md-dialog-content">-->\n' +
            '<!--                <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Entity Name</label>-->\n' +
            '<!--                        <input ng-model="vm.entityName" name=entityName required>-->\n' +
            '<!--                        <div ng-messages="addEntityForm.entityName.$error">-->\n' +
            '<!--                            <div ng-message="required">Entity name is required.</div>-->\n' +
            '<!--                        </div>-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <tb-entity-type-select class="md-block" style="min-width: 100px; width: 100px;"-->\n' +
            '<!--                       the-form="addEntityForm"-->\n' +
            '<!--                       tb-required="true"-->\n' +
            '<!--                       allowed-entity-types="vm.allowedEntityTypes"-->\n' +
            '<!--                       ng-model="vm.entityType">-->\n' +
            '<!--                    </tb-entity-type-select>-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Entity Subtype</label>-->\n' +
            '<!--                        <input ng-model="vm.type" name=type required>-->\n' +
            '<!--                        <div ng-messages="addEntityForm.type.$error">-->\n' +
            '<!--                            <div ng-message="required">Entity subtype is required.</div>-->\n' +
            '<!--                        </div>-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Latitude</label>-->\n' +
            '<!--                        <input name="latitude" type="number" step="any" ng-model="vm.attributes.latitude">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Longitude</label>-->\n' +
            '<!--                        <input name="longitude" type="number" step="any" ng-model="vm.attributes.longitude">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                 <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Address</label>-->\n' +
            '<!--                        <input ng-model="vm.attributes.address">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Owner</label>-->\n' +
            '<!--                        <input ng-model="vm.attributes.owner">-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                <div layout="row">-->\n' +
            '<!--                    <md-input-container flex class="md-block">-->\n' +
            '<!--                        <label>Integer Value</label>-->\n' +
            '<!--                        <input name="integerNumber" type="number" step="1" ng-pattern="/^-?[0-9]+$/" ng-model="vm.attributes.number">-->\n' +
            '<!--                        <div ng-messages="addEntityForm.integerNumber.$error">-->\n' +
            '<!--                            <div ng-message="pattern">Invalid integer value.</div>-->\n' +
            '<!--                        </div>-->\n' +
            '<!--                    </md-input-container>-->\n' +
            '<!--                    <div class="boolean-value-input" layout="column" layout-align="center start" flex>-->\n' +
            '<!--                        <label class="checkbox-label">Boolean Value</label>-->\n' +
            '<!--                        <md-checkbox ng-model="vm.attributes.booleanValue" style="margin-bottom: 40px;">-->\n' +
            '<!--                            {{ (vm.attributes.booleanValue ? "value.true" : "value.false") | translate }}-->\n' +
            '<!--                        </md-checkbox>-->\n' +
            '<!--                    </div>-->\n' +
            '<!--                </div>-->\n' +
            '<!--                <div class="relations-list">-->\n' +
            '<!--                    <div class="md-body-1" style="padding-bottom: 10px; color: rgba(0,0,0,0.57);">Relations</div>-->\n' +
            '<!--                    <div class="body" ng-show="vm.relations.length">-->\n' +
            '<!--                        <div class="row" layout="row" layout-align="start center" ng-repeat="relation in vm.relations track by $index">-->\n' +
            '<!--                            <div class="md-whiteframe-1dp" flex layout="row" style="padding-left: 5px;">-->\n' +
            '<!--                                <div flex layout="column">-->\n' +
            '<!--                                    <div layout="row">-->\n' +
            '<!--                                        <md-input-container class="md-block" style="min-width: 100px;">-->\n' +
            '<!--                                            <label>Direction</label>-->\n' +
            '<!--                                            <md-select name="direction" required ng-model="relation.direction">-->\n' +
            '<!--                                                <md-option ng-repeat="direction in vm.entitySearchDirection" ng-value="direction">-->\n' +
            '<!--                                                    {{ ("relation.search-direction." + direction) | translate}}-->\n' +
            '<!--                                                </md-option>-->\n' +
            '<!--                                            </md-select>-->\n' +
            '<!--                                            <div ng-messages="addEntityForm.direction.$error">-->\n' +
            '<!--                                                <div ng-message="required">Relation direction is required.</div>-->\n' +
            '<!--                                            </div>-->\n' +
            '<!--                                        </md-input-container>-->\n' +
            '<!--                                        <tb-relation-type-autocomplete flex class="md-block"-->\n' +
            '<!--                                           the-form="addEntityForm"-->\n' +
            '<!--                                           ng-model="relation.relationType"-->\n' +
            '<!--                                           tb-required="true">-->\n' +
            '<!--                                        </tb-relation-type-autocomplete>-->\n' +
            '<!--                                    </div>-->\n' +
            '<!--                                    <div layout="row">-->\n' +
            '<!--                                        <tb-entity-select flex class="md-block"-->\n' +
            '<!--                                            the-form="addEntityForm"-->\n' +
            '<!--                                            tb-required="true"-->\n' +
            '<!--                                            ng-model="relation.relatedEntity">-->\n' +
            '<!--                                        </tb-entity-select>-->\n' +
            '<!--                                    </div>-->\n' +
            '<!--                                </div>-->\n' +
            '<!--                                <div layout="column" layout-align="center center">-->\n' +
            '<!--                                    <md-button class="md-icon-button md-primary" style="width: 40px; min-width: 40px;"-->\n' +
            '<!--                                               ng-click="vm.removeRelation($index)" aria-label="Remove">-->\n' +
            '<!--                                        <md-tooltip md-direction="top">Remove relation</md-tooltip>-->\n' +
            '<!--                                        <md-icon aria-label="Remove" class="material-icons">-->\n' +
            '<!--                                            close-->\n' +
            '<!--                                        </md-icon>-->\n' +
            '<!--                                    </md-button>-->\n' +
            '<!--                                </div>-->\n' +
            '<!--                            </div>-->\n' +
            '<!--                        </div>-->\n' +
            '<!--                    </div>-->\n' +
            '<!--                   <div>-->\n' +
            '<!--                       <md-button class="md-primary md-raised" ng-click="vm.addRelation()" aria-label="Add">-->\n' +
            '<!--                           <md-tooltip md-direction="top">Add Relation</md-tooltip>-->\n' +
            '<!--                           Add-->\n' +
            '<!--                       </md-button>-->\n' +
            '<!--                   </div> -->\n' +
            '<!--                </div>-->\n' +
            '<!--            </div>-->\n' +
            '<!--        </md-dialog-content>-->\n' +
            '<!--        <md-dialog-actions>-->\n' +
            '<!--            <md-button type="submit" ng-disabled="addEntityForm.$invalid || !addEntityForm.$dirty" class="md-raised md-primary">Create</md-button>-->\n' +
            '<!--            <md-button ng-click="vm.cancel()" class="md-primary">Cancel</md-button>-->\n' +
            '<!--        </md-dialog-actions>-->\n' +
            '<!--    </form>-->\n' +
            '<!--</md-dialog>-->\n';

/** The sample's CSS. */
export const SAMPLE_CSS = '/*=======================================================================*/\n' +
            '/*==========  There are two examples: for edit and add entity  ==========*/\n' +
            '/*=======================================================================*/\n' +
            '/*========================  Edit entity example  ========================*/\n' +
            '/*=======================================================================*/\n' +
            '/*\n' +
            '.edit-entity-form md-input-container {\n' +
            '    padding-right: 10px;\n' +
            '}\n' +
            '\n' +
            '.edit-entity-form .boolean-value-input {\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.edit-entity-form .boolean-value-input .checkbox-label {\n' +
            '    margin-bottom: 8px;\n' +
            '    color: rgba(0,0,0,0.54);\n' +
            '    font-size: 12px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .header {\n' +
            '    padding-right: 5px;\n' +
            '    padding-bottom: 5px;\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .header .cell {\n' +
            '    padding-right: 5px;\n' +
            '    padding-left: 5px;\n' +
            '    font-size: 12px;\n' +
            '    font-weight: 700;\n' +
            '    color: rgba(0, 0, 0, .54);\n' +
            '    white-space: nowrap;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body {\n' +
            '    padding-right: 5px;\n' +
            '    padding-bottom: 15px;\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body .row {\n' +
            '    padding-top: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body .cell {\n' +
            '    padding-right: 5px;\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body md-autocomplete-wrap md-input-container {\n' +
            '    height: 30px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body .md-button {\n' +
            '    margin: 0;\n' +
            '}\n' +
            '\n' +
            '.relations-list.old-relations tb-entity-select tb-entity-autocomplete button {\n' +
            '    display: none;\n' +
            '} \n' +
            '*/\n' +
            '/*========================================================================*/\n' +
            '/*=========================  Add entity example  =========================*/\n' +
            '/*========================================================================*/\n' +
            '/*\n' +
            '.add-entity-form md-input-container {\n' +
            '    padding-right: 10px;\n' +
            '}\n' +
            '\n' +
            '.add-entity-form .boolean-value-input {\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.add-entity-form .boolean-value-input .checkbox-label {\n' +
            '    margin-bottom: 8px;\n' +
            '    color: rgba(0,0,0,0.54);\n' +
            '    font-size: 12px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .header {\n' +
            '    padding-right: 5px;\n' +
            '    padding-bottom: 5px;\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .header .cell {\n' +
            '    padding-right: 5px;\n' +
            '    padding-left: 5px;\n' +
            '    font-size: 12px;\n' +
            '    font-weight: 700;\n' +
            '    color: rgba(0, 0, 0, .54);\n' +
            '    white-space: nowrap;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body {\n' +
            '    padding-right: 5px;\n' +
            '    padding-bottom: 15px;\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body .row {\n' +
            '    padding-top: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body .cell {\n' +
            '    padding-right: 5px;\n' +
            '    padding-left: 5px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body md-autocomplete-wrap md-input-container {\n' +
            '    height: 30px;\n' +
            '}\n' +
            '\n' +
            '.relations-list .body .md-button {\n' +
            '    margin: 0;\n' +
            '}\n' +
            '*/\n';
