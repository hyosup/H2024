/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/odata/v2/ODataModel",
        "com/hmmausa/myhmma/mypay/zuhry000801100/model/models"
    ],
    function (UIComponent, Device, JSONModel,ODataModel, models) {
        "use strict";

        return UIComponent.extend("com.hmmausa.myhmma.mypay.zuhry000801100.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                // this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");

				// set App model
                var sUrl = '/sap/opu/odata/sap/ZGWHRY00080_1100_SRV/';			
                sap.ui.getCore().setModel(
                    new ODataModel(sUrl, {
                        json:true, 
                        useBatch:false, 
                        defaultUpdateMethod:'Put',
                        metadataUrlParams: { 'sap-client': '410' }
                    }
                ), 'ODAT');

                // For UserInfo 
                //sap.ui.getCore().setModel(userModel, "userapi"); //안됨.
                // var userModel = new sap.ui.model.json.JSONModel("/sap/bc/ui2/start_up");
                // this.setModel(userModel, "userapi");
                // https://stackoverflow.com/questions/45728567/openui5-get-data-from-jsonmodel
                // https://stackoverflow.com/questions/38134082/loading-a-model-with-name-in-sapui5
                var userModel = new JSONModel();

                var userSysModel = new sap.ui.model.json.JSONModel("/sap/bc/ui2/start_up");
                var that = this;
                userSysModel.attachRequestCompleted(function(data) { 
                    let userId = userSysModel.getData().id;
                    let userUrl = "/sap/opu/odata/SAP/YTEST_ODATA02_SRV/UserInfoSet?$filter=Input eq '{\"i_employee_number\":\""+userId+"\"}'";

                    var userModel = new sap.ui.model.json.JSONModel(userUrl);
                        userModel.attachRequestCompleted(function(data) { 
                            var oDdata = JSON.parse(userModel.getData().d.results[0].Output);
                            userModel.setData(oDdata);
                            that.setModel(userModel, "userModel");
                        });
                });  
                this.setModel(userSysModel, "userapi");
                sap.ui.getCore().setModel(new sap.ui.model.json.JSONModel({}), 'ROOT');
            }
        });
    }
);