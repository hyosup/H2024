sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,t){"use strict";return{createDeviceModel:function(){var n=new e(t);n.setDefaultBindingMode("OneWay");return n},createViewConfigModel:function(){var t=sap.ushell.Container.getService("UserInfo").getUser().getLanguage().toUpperCase();var n=new e({layout:"OneColumn",fullScreen:"false",previousLayout:"",title:"",listTitle:"",nodeType:"",isNode:false,busyState:true,listErnam:"",listErdat:"",subsectionList:[],isCreate:true,isAdmin:false,isEdit:true,isAuth:false,listLanguage:t,contentLanguage:t});n.setDefaultBindingMode("TwoWay");return n},createNodeModel:function(){var t=new e({PnodeId:"",NodeType:"expanded",Version:"",titleList:[],subsectionList:[]});t.setDefaultBindingMode("TwoWay");return t}}});