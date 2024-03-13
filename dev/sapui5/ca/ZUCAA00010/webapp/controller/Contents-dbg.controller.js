sap.ui.define([
	"hkmc/ca/zucaa00010/controller/BaseController",
	"hkmc/ca/zucaa00010/model/formatter",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast"
], function (
	Controller, formatter, JSONModel, MessageToast
) {
	"use strict";

	return Controller.extend("hkmc.ca.zucaa00010.controller.Contents", {
		formatter: formatter,
		onInit: function () {
			this.getRoute("RouteContents").attachPatternMatched(this._onObjectMatched, this);

		},
		_onObjectMatched: function (oEvent) {
			this._oParameter = oEvent.getParameter("arguments");

			this.setViewConfig("/contentLanguage", this._oParameter.spras);
			this._bindView();

		},
		_bindView: function () {
			this.getView().bindElement({
				path: this._getNodeKeyPath()
			});

			var oModel = this.getModel();
			var oTab = this.byId("idTabHeader"),
				oBinding = oTab.getBinding("items");
			var aFilters = [];
			aFilters.push(new sap.ui.model.Filter("PnodeId", sap.ui.model.FilterOperator.EQ, this._oParameter.node_id));
			aFilters.push(new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, this._oParameter.version));
			aFilters.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, this.getViewConfig("/contentLanguage")));

			oTab.bindAggregation("items", {
				path: "/SubSectionSet",
				filters: aFilters,
				template: new sap.m.IconTabFilter({ key: "{NodeId}", text: "{Title}" })
			});
			oTab.setSelectedKey('');

			oModel.read(this._getKeyPath(), {
				success: function (oData, oResponse) {
					this.bindEditor(oData.Content);
				}.bind(this)
			});
		},
		handleLanguChange: function (oEvt) {
			this._bindView();
		},
		handleTabSelect: function (oEvt) {
			var oModel = this.getModel();
			oModel.read(this._getKeyPath(), {
				success: function (oData, oResponse) {
					this.bindEditor(oData.Content);
				}.bind(this)
			});
		},
		bindEditor: function (sContent) {
			var oContainer = this.getView().byId("idRTEcontainer");
			if (oContainer.getItems().length > 0) {
				oContainer.getItems()[0].setValue(sContent);
			} else {
				sap.ui.require(["hkmc/ca/zucaz00010/utils/RichTextEditor"],
					function (RTE) {
						var oRichTextEditor = new RTE("detailRTE", {
							width: "100%",
							height: "600px",
							visible: true,
							editable: true,
							value: sContent
						});
						oContainer.addItem(oRichTextEditor);
					}.bind(this)
				);
			}
		},
		_getNodeKeyPath: function () {
			return this.getModel().createKey("/TreeSet", {
				NodeId: this._oParameter.node_id,
				Version: this._oParameter.version,
				Spras: this.getViewConfig("/contentLanguage")
			});
		},
		_getKeyPath: function () {
			var oTab = this.byId("idTabHeader");

			return this.getModel().createKey("/ContentListSet", {
				NodeId: oTab.getSelectedKey(),
				Version: this._oParameter.version,
				PnodeId: this._oParameter.node_id,
				Spras: this.getViewConfig("/contentLanguage")
			});
		},
		handleSavePress: function () {
			var oTab = this.byId("idTabHeader"),
				oModel = this.getModel(),
				oResourceBundle = this.getResourceBundle();

			var oEntry = {
				NodeId: oTab.getSelectedKey(),
				Version: this._oParameter.version,
				PnodeId: this._oParameter.node_id,
				Spras: this.getViewConfig("/contentLanguage"),
				Content: this.byId("idRTEcontainer").getItems()[0].getValue()
			}
			oModel.update(this._getKeyPath(), oEntry, {
				success: function (oData, oResponse) {
					MessageToast.show(oResourceBundle.getText("saveSuccessfully"));
				}
			})
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