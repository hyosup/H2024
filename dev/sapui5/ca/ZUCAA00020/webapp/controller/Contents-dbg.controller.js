sap.ui.define([
	"hkmc/ca/zucaa00020/controller/BaseController",
	"hkmc/ca/zucaa00020/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (
	Controller, formatter, JSONModel, MessageToast
) {
	"use strict";

	return Controller.extend("hkmc.ca.zucaa00020.controller.Contents", {
		formatter: formatter,
		onInit: function () {
			this.getRoute("RouteContents").attachPatternMatched(this._onObjectMatched, this);
			this.getRoute("RouteSearchContents").attachPatternMatched(this._onObjectSearchMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this._oParameter = oEvent.getParameter("arguments");
			this.setViewConfig("/contentLanguage", this._oParameter.spras);
			this._bindView(this._oParameter.node_id, "");
		},
		_onObjectSearchMatched: function (oEvent) {
			this._oParameter = oEvent.getParameter("arguments");
			this.setViewConfig("/contentLanguage", this._oParameter.spras);
			this._bindView(this._oParameter.pnode_id, this._oParameter.node_id);
		},
		handleTabSelect: function (oEvt) {
			this._bindHTML(oEvt.getParameter("key"));
		},
		handleLanguChange: function (oEvt) {
			this._bindView(this._oParameter.node_id, "");
		},
		_bindView: function (sNodeId, sSubsectionId) {
			var sPath = this.getModel().createKey("/TreeSet", {
				NodeId: sNodeId,
				Version: this._oParameter.version,
				Spras: this.getViewConfig("/contentLanguage")
			});
			var oTab = this.byId("idTabHeader");
			
			this.getView().bindElement({
				path: sPath,
				parameters: {
					expand: "ToSubSection"
				},
				events: {					
					dataReceived: function(oData) {
						oTab.setSelectedKey(sSubsectionId);
					},
					change: function() {
						oTab.setSelectedKey(sSubsectionId);
					}
				}
			});
	
			this._bindHTML(sSubsectionId);
		},
		_bindHTML: function (sTabKey) {
			var oModel = this.getModel(),
				oContainer = this.byId("idScroll"),
				sPath = this.getModel().createKey("/ContentListSet", {
					NodeId: sTabKey,
					Version: this._oParameter.version,
					PnodeId: this._oParameter.node_id,
					Spras: this.getViewConfig("/contentLanguage")
				});
			oContainer.destroyContent();

			oModel.read(sPath, {
				success: function (oData, oResponse) {
					oContainer.addContent(new sap.ui.core.HTML({
						content: oData.Content
					}));
				}.bind(this)
			});
		},

		handleFullScreenPress: function () {
			if (this.getViewConfig("/layout") === sap.f.LayoutType.MidColumnFullScreen) {
				this.setViewConfig("/layout", sap.f.LayoutType.TwoColumnsMidExpanded);
			} else {
				this.setViewConfig("/layout", sap.f.LayoutType.MidColumnFullScreen);
			}

		}
	});
});