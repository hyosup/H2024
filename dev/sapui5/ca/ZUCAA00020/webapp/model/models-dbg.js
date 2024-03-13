sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/Device"
],
    /**
     * provide app-view type models (as in the first "V" in MVVC)
     * 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.Device} Device
     * 
     * @returns {Function} createDeviceModel() for providing runtime info for the device the UI5 app is running on
     */
    function (JSONModel, Device) {
        "use strict";

        return {
            createDeviceModel: function () {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            },
            createViewConfigModel: function () {
                var sLangu = sap.ushell.Container.getService("UserInfo").getUser().getLanguage().toUpperCase();
                var oModel = new JSONModel({
                    layout: "OneColumn",
                    fullScreen: "false",
                    previousLayout: "",
                    title: "",
                    listTitle: "",
                    nodePath: "",
                    isNode: false,
                    busyState: true,
                    listErnam: "",
                    listErdat: "",
                    isCreate: true,
                    isAdmin: false,
                    isEdit: true,
                    isAuth: false,
                    listLanguage:sLangu,
                    contentLanguage:sLangu,
                    searchLanguage:sLangu
                });
                oModel.setDefaultBindingMode("TwoWay");
                return oModel;
            }
        };
    });