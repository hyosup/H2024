sap.ui.define(["hkmc/ca/zucaz00030/controller/BaseController","hkmc/ca/zucaz00030/model/formatter"],function(e,t){"use strict";return e.extend("hkmc.ca.zucaz00030.controller.ManualList",{formatter:t,onInit:function(){this.getRoute("RouteManualList").attachPatternMatched(this._onObjectMatched,this)},onAfterRendering:function(){sap.ui.getCore().byId("shell").setHeaderVisible(false);sap.ui.getCore().byId("shell-header").setVisible(false)},_onObjectMatched:function(e){var t=e.getParameter("arguments").key.split("-"),a=[];a.push(new sap.ui.model.Filter("Objid",sap.ui.model.FilterOperator.EQ,t[0]));if(t[1]){a.push(new sap.ui.model.Filter("Subobjid",sap.ui.model.FilterOperator.EQ,t[1]))}this.byId("idList").getBinding("items").filter(a)},handleItemPress:function(e){var t=e.getSource();this.getOwnerComponent().getRouter().navTo("RouteManualDetail",{path:t.getSelectedItem().getBindingContext().getPath().substr(1)},false)}})});