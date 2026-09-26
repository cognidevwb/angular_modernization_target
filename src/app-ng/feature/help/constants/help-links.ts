/**
 * Ported from the AngularJS constant `helpLinks` (module `thingsboard.help`) in src/app/help/help-links.constant.js:55.
 * Scaffolded by the playbook.
 */
export const helpLinks = {
            linksMap: {
                outgoingMailSettings: (window as any).helpBaseUrl + "/docs/user-guide/ui/mail-settings",
                securitySettings: (window as any).helpBaseUrl + "/docs/user-guide/ui/security-settings",
                ruleEngine: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/overview/",
                ruleNodeCheckRelation: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/filter-nodes/#check-relation-filter-node",
                ruleNodeJsFilter: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/filter-nodes/#script-filter-node",
                ruleNodeJsSwitch: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/filter-nodes/#switch-node",
                ruleNodeMessageTypeFilter: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/filter-nodes/#message-type-filter-node",
                ruleNodeMessageTypeSwitch: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/filter-nodes/#message-type-switch-node",
                ruleNodeOriginatorTypeFilter: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/filter-nodes/#originator-type-filter-node",
                ruleNodeOriginatorTypeSwitch: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/filter-nodes/#originator-type-switch-node",
                ruleNodeOriginatorAttributes: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/enrichment-nodes/#originator-attributes",
                ruleNodeOriginatorFields: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/enrichment-nodes/#originator-fields",
                ruleNodeCustomerAttributes: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/enrichment-nodes/#customer-attributes",
                ruleNodeDeviceAttributes: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/enrichment-nodes/#device-attributes",
                ruleNodeRelatedAttributes: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/enrichment-nodes/#related-attributes",
                ruleNodeTenantAttributes: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/enrichment-nodes/#tenant-attributes",
                ruleNodeChangeOriginator: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/transformation-nodes/#change-originator",
                ruleNodeTransformMsg: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/transformation-nodes/#script-transformation-node",
                ruleNodeMsgToEmail: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/transformation-nodes/#to-email-node",
                ruleNodeClearAlarm: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#clear-alarm-node",
                ruleNodeCreateAlarm: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#create-alarm-node",
                ruleNodeMsgDelay: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#delay-node",
                ruleNodeMsgGenerator: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#generator-node",
                ruleNodeLog: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#log-node",
                ruleNodeRpcCallReply: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#rpc-call-reply-node",
                ruleNodeRpcCallRequest: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#rpc-call-request-node",
                ruleNodeSaveAttributes: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#save-attributes-node",
                ruleNodeSaveTimeseries: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/action-nodes/#save-timeseries-node",
                ruleNodeRuleChain: (window as any).helpBaseUrl + "/docs/user-guide/ui/rule-chains/",
                ruleNodeAwsSns: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#aws-sns-node",
                ruleNodeAwsSqs: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#aws-sqs-node",
                ruleNodeKafka: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#kafka-node",
                ruleNodeMqtt: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#mqtt-node",
                ruleNodeAzureIotHub: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#azure-iot-hub-node",
                ruleNodeRabbitMq: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#rabbitmq-node",
                ruleNodeRestApiCall: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#rest-api-call-node",
                ruleNodeSendEmail: (window as any).helpBaseUrl + "/docs/user-guide/rule-engine-2-0/external-nodes/#send-email-node",
                rulechains: (window as any).helpBaseUrl + "/docs/user-guide/ui/rule-chains/",
                tenants: (window as any).helpBaseUrl + "/docs/user-guide/ui/tenants",
                customers: (window as any).helpBaseUrl + "/docs/user-guide/ui/customers",
                assets: (window as any).helpBaseUrl + "/docs/user-guide/ui/assets",
                devices: (window as any).helpBaseUrl + "/docs/user-guide/ui/devices",
                entityViews: (window as any).helpBaseUrl + "/docs/user-guide/ui/entity-views",
                entitiesImport: (window as any).helpBaseUrl + "/docs/user-guide/bulk-provisioning",
                dashboards: (window as any).helpBaseUrl + "/docs/user-guide/ui/dashboards",
                users: (window as any).helpBaseUrl + "/docs/user-guide/ui/users",
                widgetsBundles: (window as any).helpBaseUrl + "/docs/user-guide/ui/widget-library#bundles",
                widgetsConfig:  (window as any).helpBaseUrl + "/docs/user-guide/ui/dashboards#widget-configuration",
                widgetsConfigTimeseries:  (window as any).helpBaseUrl + "/docs/user-guide/ui/dashboards#timeseries",
                widgetsConfigLatest: (window as any).helpBaseUrl +  "/docs/user-guide/ui/dashboards#latest",
                widgetsConfigRpc: (window as any).helpBaseUrl +  "/docs/user-guide/ui/dashboards#rpc",
                widgetsConfigAlarm: (window as any).helpBaseUrl +  "/docs/user-guide/ui/dashboards#alarm",
                widgetsConfigStatic: (window as any).helpBaseUrl +  "/docs/user-guide/ui/dashboards#static",
            },
            getRuleNodeLink: function(ruleNode) {
                if (ruleNode && ruleNode.component) {
                    if (ruleNode.component.configurationDescriptor &&
                        ruleNode.component.configurationDescriptor.nodeDefinition &&
                        ruleNode.component.configurationDescriptor.nodeDefinition.docUrl) {
                        return ruleNode.component.configurationDescriptor.nodeDefinition.docUrl;
                    } else if (ruleNode.component.clazz) {
                        if ((window as any).ruleNodeClazzHelpLinkMap[ruleNode.component.clazz]) {
                            return (window as any).ruleNodeClazzHelpLinkMap[ruleNode.component.clazz];
                        }
                    }
                }
                return 'ruleEngine';
            }
        };
