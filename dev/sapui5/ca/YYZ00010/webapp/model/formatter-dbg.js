sap.ui.define([
	"sap/ui/model/type/Currency"
], function(Currency) {
	"use strict";

	return {
		
		currencyValue: function(sValue) {
			if (!sValue) {
				return "";
			}
			return parseFloat(sValue).toFixed(2);
		},
		formatDate: function(sValue) {
			if (sValue) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd"
				});
				//return oDateFormat.format(new Date(Number(sValue.substring(6,19))));
				return oDateFormat.format(sValue);
			} else {
				return sValue;
			}
		},
		formatDateTime: function(sValue) {
			if (sValue) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "yyyy-MM-dd HH:mm:ss"
				});
				return oDateFormat.format(sValue);
			} else {
				return sValue;
			}
		},
		formatFileSize:function(sValue){
			var newValue = 0;
			if (sValue >= 1048576) {
				newValue = sValue / 1024 / 1024;
				return newValue.toFixed(1) + "MB";
			} else {
				newValue = sValue / 1024;
				return newValue.toFixed() + "KB";
			}
		},
		formatFileIcon: function(sValue) {
			if (sValue === null || sValue === undefined || sValue === "") {
				return "sap-icon://document";
			} else {
				switch (sValue) {
					case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
						return "sap-icon://ppt-attachment";
					case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
						return "sap-icon://excel-attachment";
					case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
						return "sap-icon://doc-attachment";
					case "application/pdf":
						return "sap-icon://pdf-attachment";
					default:
						return "sap-icon://document";
				}
			}
		}

	};
});