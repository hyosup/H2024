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
        "hkmc/ca/zucaz00010/utils/UploadSet"

    ],
    function (Controller,Confirm,UploadSet) {
        "use strict";

        return Controller.extend("hkmc.ca.zucaz00030.controller.Detail", {
            _oUploadSet: null,
            onInit: function () {
                this.initViewConfigModel();
                this._getAuth();
                this.getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
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
                            this._oUploadSet = new UploadSet("idUploadSet", this.byId("idUploadSetContainer"), "{viewConfig>/isEdit}", {
                                beforeUploadStarts: this.onBeforeUploadStarts.bind(this),
                                uploadComplete: this.onUploadComplete.bind(this)
                            });
                            this._oUploadSet.filterItems(this._getAppID(), oData.Guid);

                        }.bind(this)
                    }
                });
            },
            _bindEditor: function (sId, sContent) {
                //Rich Text Editor를 화면 및 모델에 바인딩
                var oContainer = this.getView().byId(sId + "Container");
                var bEdit = this.getViewModel("viewConfig").getProperty("/isEdit");
                this.setRichTextEditor(sId, oContainer, sContent, !bEdit, "{viewConfig>/isEdit}");
            },
            handleEdit: function () {
                this.resetModelChanges();
                //화면 입력/조회 상태를 변경: 입력
                this.setViewConfig("/isEdit", true);
            },
            handleSave: function () {
                var bEdit = this.getViewConfig("/isEdit");
                this._submitSave(!bEdit);
            },
            handleCancel: function (oEvent) {
                //저장하지 않은 변경 내용 리셋
                this.resetModelChanges();
                var oviewConfig = this.getView().getModel("viewConfig");
                //화면 입력/조회 상태를 변경
                oviewConfig.setProperty("/isEdit", !oviewConfig.getProperty("/isEdit"));
            },
            handleDelete: function () {
                //삭제 진행 Confirm 창 열림
                var oConfirm = new Confirm({
                    handleSubmit: this._confirmDelete.bind(this)
                });
                oConfirm.delete();
            },
            _confirmDelete: function () {
                var oModel = this.getView().getModel(),
                    sPath = this.getView().getBindingContext().getPath();
                var oResourceBundle = this.getResourceBundle();
                //데이터 삭제
                oModel.remove(sPath, {
                    success: function (oData, oResponse) {
                        //화면 입력/조회 상태를 변경: 조회
                        this.setViewConfig("/isEdit", false);
                        sap.m.MessageToast.show(oResourceBundle.getText("msgDeleteSuccessfully"));
                        //List View로 이동
                        this.goNavBack();
                    }.bind(this),
                    error: function (oError) {
                        sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
                    }
                });
            }
        });
    }
);
