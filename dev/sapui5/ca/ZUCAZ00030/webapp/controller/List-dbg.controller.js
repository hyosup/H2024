/*******************************************************************************************************
* Change History
*&------------------------------------------------------------------------------------------------------
*   Ver. No       Change Date        Writer             Request No.              
*   Description
*&------------------------------------------------------------------------------------------------------
*   1             2022.12.09         GICSDV05           [요구사항 번호]                       
*   최초 개발 
********************************************************************************************************
*/
sap.ui.define([
    "hkmc/ca/zucaz00030/controller/BaseController"
],
    function (Controller) {
        "use strict";
        return Controller.extend("hkmc.ca.zucaz00030.controller.List", {
            onInit: function() {
                this.initViewConfigModel();
                this._getAuth();
            },
            handleNew: function () {
                //Create View로 이동
               this.getRouter().navTo("RouteCreate");
            },
            handleItemPress: function(oEvent) {
                var oItem = oEvent.getSource();
                //Detail View로 이동
                this.getOwnerComponent().getRouter().navTo("RouteDetail",{
                    //선택한 라인아이템 path의 맨앞 1자리(/값)을 삭제 : Routing시 /는 키워드임
                    path: oItem.getSelectedItem().getBindingContext().getPath().substr(1)
                }, false);
            },
            onBeforeRebindTable: function (oEvent) {
                oEvent.getParameter("bindingParams").sorter.push(new sap.ui.model.Sorter("Objid",false));
                oEvent.getParameter("bindingParams").sorter.push(new sap.ui.model.Sorter("Subobjid",false));
            }
        });
    });
