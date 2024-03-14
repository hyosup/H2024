/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"hkmc/ca/zucaz00030/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});
