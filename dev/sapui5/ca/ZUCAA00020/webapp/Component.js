jQuery.sap.registerModulePath("hkmc.ca.zucaz00010","/sap/bc/ui5_ui5/sap/zucaz00010");sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","hkmc/ca/zucaa00020/model/models"],function(e,i,t){"use strict";return e.extend("hkmc.ca.zucaa00020.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device");this.setModel(t.createViewConfigModel(),"viewConfig")}})});