sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "hkmc/ca/yyz00010/utils/UploadSet"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, UploadSet) {
        "use strict";

        return Controller.extend("hkmc.ca.yyz00010.controller.View1", {
            onInit: function () {
                this._oUploadSet = new UploadSet("idUploadSet", this.byId("idVBox"), true, {});
                // this._oUploadSet.filterItems("ZUCAA00100", "D3458EC37F8C1EDD91A64353CD1A67D7");
                
            },
            handlePress:function(){
                this._oUploadSet.setVisibleRemove(false);
            }
        });
    });
