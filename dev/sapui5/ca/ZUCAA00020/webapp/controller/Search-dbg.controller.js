sap.ui.define([
    "hkmc/ca/zucaa00020/controller/BaseController",
    "hkmc/ca/zucaa00020/model/formatter",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, JSONModel) {
        "use strict";

        return Controller.extend("hkmc.ca.zucaa00020.controller.Search", {
            formatter: formatter,
            onInit: function () {
                this.getRoute("RouteSearch").attachPatternMatched(this._onObjectListMatched, this);

            },
            _onObjectListMatched: function (oEvent) {
                this._oParameter = oEvent.getParameter("arguments");
                this._sVersion = this._oParameter.version;
                this.setViewConfig("/searchLanguage", this._oParameter.spras);
                var sQuery = decodeURIComponent(this._oParameter["?query"].search_str);
                this.setViewConfig("/layout", sap.f.LayoutType.OneColumn);
                this.byId("idVersionComboBox").setSelectedKey(this._sVersion);
                this.byId("idSearch").setValue(sQuery);
                this._searchResult(sQuery);
            },

            handleSearch: function (oEvent) {                
                var sQuery = oEvent.getParameter("query");
                if (sQuery.length > 0) {
                    this.getRouter().navTo("RouteSearch", {
                        version: encodeURIComponent(this._sVersion),
                        spras: this.getViewConfig("/searchLanguage"),
                        query: {
                            search_str: encodeURIComponent(sQuery)
                        }
                    }, false);
                }
            },
            _searchResult: function (sQuery) {
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, this.byId("idVersionComboBox").getSelectedKey()));
                aFilters.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, this.getViewConfig("/searchLanguage")));
                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new sap.ui.model.Filter("Content", sap.ui.model.FilterOperator.EQ, encodeURIComponent(sQuery)));
                }
                oBinding.filter(aFilters, "Application");

                var oTab = this.byId("idIconHeader");
                var oTabBinding = oTab.getBinding("items");
                oTabBinding.filter(aFilters, "Application");
                window.find("angu");
            },
            handleItemPress: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext().getPath(),
                    oItem = this.getViewModel().getProperty(sPath);

                this._sVersion = oItem.Version;
                this.getRouter().navTo("RouteSearchContents", {
                    pnode_id: oItem.PnodeId,
                    version: encodeURIComponent(this._sVersion),
                    spras: this.getViewConfig("/searchLanguage"),
                    node_id: oItem.NodeId
                }, false);

            },
            handleTabSelect: function (oEvt) {
                var oList = this.byId("idList");
                var oBinding = oList.getBinding("items");
                var aFilters = [];
                var sQuery = this.byId("idSearch").getValue();
                aFilters.push(new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, this.byId("idVersionComboBox").getSelectedKey()));
                aFilters.push(new sap.ui.model.Filter("DevArea", sap.ui.model.FilterOperator.EQ, oEvt.getParameter("key")));
                aFilters.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, this.getViewConfig("/searchLanguage")));

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new sap.ui.model.Filter("Content", sap.ui.model.FilterOperator.EQ, encodeURIComponent(sQuery)));
                }
                oBinding.filter(aFilters, "Application");
            },
            handleLanguChange: function (oEvt) {
                this.setViewConfig("/searchLanguage", oEvt.getParameter("selectedItem").getKey());  
                var sQuery = this.byId("idSearch").getValue();                    
                this._searchResult(sQuery);
            }
        });
    });
