sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	return Object.extend("hkmc.ca.zucaa00010.utils.Confirm", {
		_fCallBack: null,
		constructor: function(fCallBack) {
			this._fCallBack = fCallBack;
		},
		delete: function() {
			this.show({
				title: "Confirm",
				confirmText: "Delete Confirm"
			});
		},
		show: function(oParam) {
			var that = this;
			var oValues;
			if (oParam === undefined) {
				oValues = {
					title: "Confirm",
					confirmText: "Confirm",
					submitText: "Yes",
					cancelText: "No"
				};
			} else {
				oValues = oParam;
			}
			var dialog = new sap.m.Dialog({
				title: oValues.title === undefined ? "Confirm" : oValues.title,
				type: "Message",
				content: new sap.m.Text({
					text: oValues.confirmText === undefined ? "Confirm" : oValues.confirmText
				}),
				beginButton: new sap.m.Button({
					text: oValues.submitText === undefined ? "Yes" : oValues.submitText,
					press: function() {
						dialog.close();
						if (that._fCallBack && that._fCallBack.handleSubmit) {
							that._fCallBack.handleSubmit();
						}
					}
				}),
				endButton: new sap.m.Button({
					text: oValues.cancelText === undefined ? "No" : oValues.cancelText,
					press: function() {
						dialog.close();
						if (that._fCallBack && that._fCallBack.handleCancel) {
							that._fCallBack.handleCancel();
						}
					}
				}),
				afterClose: function() {
					dialog.destroy();
					if (that._fCallBack && that._fCallBack.handleClose) {
						that._fCallBack.handleClose();
					}
				}
			});
			dialog.open();
		}
	});
});