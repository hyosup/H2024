/*global history */
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History"
], function (Controller, JSONModel, History) {
	"use strict";

	return Controller.extend("hkmc.ca.zucaz00010.controller.BaseController", {
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},
		getRoute: function (sName) {
			return this.getRouter().getRoute(sName);
		},
		getModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},
		goNavBack: function (sName, oParameters, oComponentTargetInfo, bReplace) {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				if (sName) {
					this.getRouter().navTo(sName, oParameters, oComponentTargetInfo, bReplace);
				} else {
					this.getRouter().navTo("RouteList", oParameters, oComponentTargetInfo, bReplace);
				}

			}
		},
		getViewModel: function (sName) {
			return this.getView().getModel(sName);
		},

		setViewModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},
		getById: function (sName) {
			this.getView().byId(sName);
		},
		_validateInput: function (oInput) {
			var sValueState = "None";
			var bValidationError = false;
			if (typeof oInput.getValue === "function" && oInput.getRequired() && oInput.getValue() === "") {
				sValueState = "Error";
				bValidationError = true;
				oInput.setValueState(sValueState);
			}
			return bValidationError;
		},
		setViewConfig: function (sProperty, oValue) {
			this.getModel("viewConfig").setProperty(sProperty, oValue);
		},
		getViewConfig: function (sProperty) {
			return this.getModel("viewConfig").getProperty(sProperty);
		},
		setRichTextEditor: function (sId, oContainer, sContent, bEdit, sEditBindingPath ) {
			if (bEdit) {
				if (oContainer) {
					oContainer.destroyItems();
					sap.ui.require(["hkmc/ca/zucaz00010/utils/RichTextEditor"],
						function (RTE) {
							var oRichTextEditor = new RTE(sId, {
								width: "100%",
								height: "600px",
								visible: true,
								editable: sEditBindingPath,
								value: sContent
							});
							oContainer.addItem(oRichTextEditor);
						}.bind(this)
					);
				}
			} else {
				if (oContainer) {
					oContainer.destroyItems();
					oContainer.addItem(
						new sap.m.ScrollContainer(sId, {
							width: "auto",
							height: "600px",
							vertical: true,
							content: new sap.ui.core.HTML({
								content: sContent
							})
						}).addStyleClass("myHtmlContainer"));
				}
			}
		}
	});

});