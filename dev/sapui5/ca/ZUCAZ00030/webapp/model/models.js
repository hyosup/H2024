sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,i){"use strict";return{createDeviceModel:function(){var n=new e(i);n.setDefaultBindingMode("OneWay");return n},createViewConfigModel:function(){var i=new e({isEdit:false,isAuth:false,hasHistory:false});i.setDefaultBindingMode("TwoWay");return i}}});