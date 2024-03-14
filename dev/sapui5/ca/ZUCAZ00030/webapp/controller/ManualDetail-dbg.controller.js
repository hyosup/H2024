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
sap.ui.define(
    [
        "hkmc/ca/zucaz00030/controller/BaseController",
        "hkmc/ca/zucaz00010/dialog/Confirm",
        "hkmc/ca/zucaz00010/utils/UploadSet",
        "sap/ui/core/routing/History"
    ],
    function (Controller, Confirm, UploadSet, History) {
        "use strict";

        return Controller.extend("hkmc.ca.zucaz00030.controller.ManualDetail", {
            _oUploadSet: null,
            onInit: function () {
                this.initViewConfigModel();
                this.getRoute("RouteManualDetail").attachPatternMatched(this._onObjectMatched, this);
            },
            _onObjectMatched: function (oEvent) {
                this._sPath = "/" + oEvent.getParameter("arguments").path;
                //화면 입력/조회 상태를 변경: 조회
                this.setViewConfig("/isEdit", false);

                this.getView().bindElement({
                    path: this._sPath,
                    events: {
                        change: function (oEvt) {
                            var oData = oEvt.getSource().getModel().getProperty(oEvt.getSource().getPath());
                            this._bindEditor("idRTEDetailEdit", "{Content}");
                            this._oUploadSet = new UploadSet("idUploadSet", this.byId("idUploadSetContainer"), false, {});
                            this._oUploadSet.filterItems(this._getAppID(), oData.Guid);
                        }.bind(this)
                    }
                });

                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash === undefined) {
                    this.setViewConfig("/hasHistory", false);
                }else{
                    this.setViewConfig("/hasHistory", true);
                }
            },
            onAfterRendering: function () {
                sap.ui.getCore().byId("shell").setHeaderVisible(false);
                sap.ui.getCore().byId("shell-header").setVisible(false);
            },
            _bindEditor: function (sId, sContent) {
                //Rich Text Editor를 화면 및 모델에 바인딩
                var oContainer = this.getView().byId(sId + "Container");
                var bEdit = this.getViewModel("viewConfig").getProperty("/isEdit");
                this.setRichTextEditor(sId, oContainer, sContent, !bEdit, "{viewConfig>/isEdit}");
            },
            handleNavButtonPress: function () {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();
                if (sPreviousHash !== undefined) {
                    this.goNavBack();
                }
            }
        });
    }
);
