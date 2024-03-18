sap.ui.define(["hkmc/ca/zucaa00010/controller/BaseController","hkmc/ca/zucaa00010/model/formatter","sap/ui/model/json/JSONModel","sap/m/MessageToast"],function(e,t,i,n){"use strict";return e.extend("hkmc.ca.zucaa00010.controller.Contents",{formatter:t,onInit:function(){this.getRoute("RouteContents").attachPatternMatched(this._onObjectMatched,this)},_onObjectMatched:function(e){this._oParameter=e.getParameter("arguments");this.setViewConfig("/contentLanguage",this._oParameter.spras);this._bindView()},_bindView:function(){this.getView().bindElement({path:this._getNodeKeyPath()});var e=this.getModel();var t=this.byId("idTabHeader"),i=t.getBinding("items");var n=[];n.push(new sap.ui.model.Filter("PnodeId",sap.ui.model.FilterOperator.EQ,this._oParameter.node_id));n.push(new sap.ui.model.Filter("Version",sap.ui.model.FilterOperator.EQ,this._oParameter.version));n.push(new sap.ui.model.Filter("Spras",sap.ui.model.FilterOperator.EQ,this.getViewConfig("/contentLanguage")));t.bindAggregation("items",{path:"/SubSectionSet",filters:n,template:new sap.m.IconTabFilter({key:"{NodeId}",text:"{Title}"})});t.setSelectedKey("");e.read(this._getKeyPath(),{success:function(e,t){this.bindEditor(e.Content)}.bind(this)})},handleLanguChange:function(e){this._bindView()},handleTabSelect:function(e){var t=this.getModel();t.read(this._getKeyPath(),{success:function(e,t){this.bindEditor(e.Content)}.bind(this)})},bindEditor:function(e){var t=this.getView().byId("idRTEcontainer");if(t.getItems().length>0){t.getItems()[0].setValue(e)}else{sap.ui.require(["hkmc/ca/zucaz00010/utils/RichTextEditor"],function(i){var n=new i("detailRTE",{width:"100%",height:"600px",visible:true,editable:true,value:e});t.addItem(n)}.bind(this))}},_getNodeKeyPath:function(){return this.getModel().createKey("/TreeSet",{NodeId:this._oParameter.node_id,Version:this._oParameter.version,Spras:this.getViewConfig("/contentLanguage")})},_getKeyPath:function(){var e=this.byId("idTabHeader");return this.getModel().createKey("/ContentListSet",{NodeId:e.getSelectedKey(),Version:this._oParameter.version,PnodeId:this._oParameter.node_id,Spras:this.getViewConfig("/contentLanguage")})},handleSavePress:function(){var e=this.byId("idTabHeader"),t=this.getModel(),i=this.getResourceBundle();var a={NodeId:e.getSelectedKey(),Version:this._oParameter.version,PnodeId:this._oParameter.node_id,Spras:this.getViewConfig("/contentLanguage"),Content:this.byId("idRTEcontainer").getItems()[0].getValue()};t.update(this._getKeyPath(),a,{success:function(e,t){n.show(i.getText("saveSuccessfully"))}})},handleFullScreenPress:function(){if(this.getViewConfig("/layout")===sap.f.LayoutType.MidColumnFullScreen){this.setViewConfig("/layout",sap.f.LayoutType.TwoColumnsMidExpanded)}else{this.setViewConfig("/layout",sap.f.LayoutType.MidColumnFullScreen)}}})});