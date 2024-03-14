sap.ui.define([
	"sap/ui/base/Object"
], function(Object) {
	"use strict";
	return Object.extend("hkmc.ca.yyz00010.utils.Auth", {
		sAppID: "",
		oDataModel: null,
		bIsAuth: false,
		sServiceURL: "/sap/opu/odata/sap/ZGWCAZ00010_SRV/",
		constructor: function(sAppID, bCodeFlag) {
			if (sAppID === undefined) {
				return;
			}
			var that = this;
			this.sAppID = sAppID;
		
			if (bCodeFlag === true) {
				jQuery.ajax({
					url: this.sServiceURL + "AuthCodeSet('" + this.sAppID + "')",
					dataType: "json",
					type: "GET",
					async: false,
					success: function(data, textStatus, XMLHttpRequest) {
						that.bIsAuth = data.d.AuthType;
					}
				});
			} else {
				jQuery.ajax({
					url: this.sServiceURL + "AuthSet('" + this.sAppID + "')",
					dataType: "json",
					type: "GET",
					async: false,
					success: function(data, textStatus, XMLHttpRequest) {
						that.bIsAuth = data.d.AuthFlag;
					}
				});
			}
		},

		getAuth: function() {
			return this.bIsAuth;
		}
	});
});