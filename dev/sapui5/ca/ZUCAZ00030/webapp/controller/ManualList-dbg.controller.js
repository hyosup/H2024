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
    "hkmc/ca/zucaz00030/controller/BaseController",
    "hkmc/ca/zucaz00030/model/formatter"
],
    function (Controller, formatter) {
        "use strict";
        return Controller.extend("hkmc.ca.zucaz00030.controller.ManualList", {
            formatter:formatter,
            onInit: function () {
                this.getRoute("RouteManualList").attachPatternMatched(this._onObjectMatched, this);
            },
            onAfterRendering: function () {
                sap.ui.getCore().byId("shell").setHeaderVisible(false);
                sap.ui.getCore().byId("shell-header").setVisible(false);
            },
            _onObjectMatched: function (oEvent) {
                var aKey = oEvent.getParameter("arguments").key.split("-"),
                    aFilter = [];

                aFilter.push(new sap.ui.model.Filter("Objid", sap.ui.model.FilterOperator.EQ, aKey[0]));
                if (aKey[1]) {
                    aFilter.push(new sap.ui.model.Filter("Subobjid", sap.ui.model.FilterOperator.EQ, aKey[1]));
                }
                this.byId("idList").getBinding("items").filter(aFilter);
            },
            handleItemPress: function (oEvent) {
                var oItem = oEvent.getSource();
                //Detail View로 이동
                this.getOwnerComponent().getRouter().navTo("RouteManualDetail", {
                    //선택한 라인아이템 path의 맨앞 1자리(/값)을 삭제 : Routing시 /는 키워드임
                    path: oItem.getSelectedItem().getBindingContext().getPath().substr(1)
                }, false);
            }
        });
    });
