sap.ui.define(["sap/ui/base/Object"],function(t){"use strict";return t.extend("hkmc.ca.zucaz00010.utils.Auth",{sAppID:"",oDataModel:null,bIsAuth:false,sServiceURL:"/sap/opu/odata/sap/ZGWCAZ00010_SRV/",constructor:function(t,s){if(t===undefined){return}var e=this;this.sAppID=t;if(s===true){jQuery.ajax({url:this.sServiceURL+"AuthCodeSet('"+this.sAppID+"')",dataType:"json",type:"GET",async:false,success:function(t,s,u){e.bIsAuth=t.d.AuthType}})}else{jQuery.ajax({url:this.sServiceURL+"AuthSet('"+this.sAppID+"')",dataType:"json",type:"GET",async:false,success:function(t,s,u){e.bIsAuth=t.d.AuthFlag}})}},getAuth:function(){return this.bIsAuth}})});