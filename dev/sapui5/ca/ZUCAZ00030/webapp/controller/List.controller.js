sap.ui.define(["hkmc/ca/zucaz00030/controller/BaseController"],function(e){"use strict";return e.extend("hkmc.ca.zucaz00030.controller.List",{onInit:function(){this.initViewConfigModel();this._getAuth()},handleNew:function(){this.getRouter().navTo("RouteCreate")},handleItemPress:function(e){var t=e.getSource();this.getOwnerComponent().getRouter().navTo("RouteDetail",{path:t.getSelectedItem().getBindingContext().getPath().substr(1)},false)},onBeforeRebindTable:function(e){e.getParameter("bindingParams").sorter.push(new sap.ui.model.Sorter("Objid",false));e.getParameter("bindingParams").sorter.push(new sap.ui.model.Sorter("Subobjid",false))}})});