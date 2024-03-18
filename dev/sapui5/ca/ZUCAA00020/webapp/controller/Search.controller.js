sap.ui.define(["hkmc/ca/zucaa00020/controller/BaseController","hkmc/ca/zucaa00020/model/formatter","sap/ui/model/json/JSONModel"],function(e,t,i){"use strict";return e.extend("hkmc.ca.zucaa00020.controller.Search",{formatter:t,onInit:function(){this.getRoute("RouteSearch").attachPatternMatched(this._onObjectListMatched,this)},_onObjectListMatched:function(e){this._oParameter=e.getParameter("arguments");this._sVersion=this._oParameter.version;this.setViewConfig("/searchLanguage",this._oParameter.spras);var t=decodeURIComponent(this._oParameter["?query"].search_str);this.setViewConfig("/layout",sap.f.LayoutType.OneColumn);this.byId("idVersionComboBox").setSelectedKey(this._sVersion);this.byId("idSearch").setValue(t);this._searchResult(t)},handleSearch:function(e){var t=e.getParameter("query");if(t.length>0){this.getRouter().navTo("RouteSearch",{version:encodeURIComponent(this._sVersion),spras:this.getViewConfig("/searchLanguage"),query:{search_str:encodeURIComponent(t)}},false)}},_searchResult:function(e){var t=this.byId("idList");var i=t.getBinding("items");var a=[];a.push(new sap.ui.model.Filter("Version",sap.ui.model.FilterOperator.EQ,this.byId("idVersionComboBox").getSelectedKey()));a.push(new sap.ui.model.Filter("Spras",sap.ui.model.FilterOperator.EQ,this.getViewConfig("/searchLanguage")));if(e&&e.length>0){a.push(new sap.ui.model.Filter("Content",sap.ui.model.FilterOperator.EQ,encodeURIComponent(e)))}i.filter(a,"Application");var r=this.byId("idIconHeader");var o=r.getBinding("items");o.filter(a,"Application");window.find("angu")},handleItemPress:function(e){var t=e.getSource().getBindingContext().getPath(),i=this.getViewModel().getProperty(t);this._sVersion=i.Version;this.getRouter().navTo("RouteSearchContents",{pnode_id:i.PnodeId,version:encodeURIComponent(this._sVersion),spras:this.getViewConfig("/searchLanguage"),node_id:i.NodeId},false)},handleTabSelect:function(e){var t=this.byId("idList");var i=t.getBinding("items");var a=[];var r=this.byId("idSearch").getValue();a.push(new sap.ui.model.Filter("Version",sap.ui.model.FilterOperator.EQ,this.byId("idVersionComboBox").getSelectedKey()));a.push(new sap.ui.model.Filter("DevArea",sap.ui.model.FilterOperator.EQ,e.getParameter("key")));a.push(new sap.ui.model.Filter("Spras",sap.ui.model.FilterOperator.EQ,this.getViewConfig("/searchLanguage")));if(r&&r.length>0){a.push(new sap.ui.model.Filter("Content",sap.ui.model.FilterOperator.EQ,encodeURIComponent(r)))}i.filter(a,"Application")},handleLanguChange:function(e){this.setViewConfig("/searchLanguage",e.getParameter("selectedItem").getKey());var t=this.byId("idSearch").getValue();this._searchResult(t)}})});