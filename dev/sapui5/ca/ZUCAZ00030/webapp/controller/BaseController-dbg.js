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
    "hkmc/ca/zucaz00010/controller/BaseController",
    "sap/ui/model/json/JSONModel",
    "hkmc/ca/zucaz00010/utils/Auth"
],
    function (Controller, JSONModel, Auth) {
        "use strict";

        return Controller.extend("hkmc.ca.zucaz00030.controller.BaseController", {     
            _getAppID: function () {
                //App ID 반환
                return "ZUCAZ00030";
            },
            _getAuth: function () {
                //권한 확인
                var that = this;
                var oAuth = new Auth(this._getAppID());
                if (!this.getViewModel("viewConfig")) {
                    this.setViewModel(this.getModel("viewConfig"), "viewConfig");
                }
                that.getViewModel("viewConfig").setProperty("/isAuth", oAuth.getAuth());
            },
            getResourceBundle: function () {
                //i18n 데이터 반환
                return this.getOwnerComponent().getModel("i18n").getResourceBundle();
            },
            resetModelChanges: function () {
                //저장하지 않은 변경 내용 리셋
                var oModel = this.getView().getModel();
                if (oModel.hasPendingChanges()) {
                    oModel.resetChanges();
                }
            },
            initViewConfigModel: function () {
                //viewConfig 모델을 View 모델로 설정
                this.getView().setModel(this.getOwnerComponent().getModel("viewConfig"),"viewConfig");
            },
            onBeforeUploadStarts: function (oEvent) {
                //업로드 프로세스 시작 직전에 동작
                var sToken = this.getModel().getSecurityToken(),
                    oUpload = oEvent.getSource(),
                    oItem = oEvent.getParameter("item");
                    oUpload.setBusy(true);
                //UploadSet 헤더 데이터 삽입
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "slug", text: encodeURIComponent(oItem.getFileName()) }), 1); //첨부파일명
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "x-csrf-token", text: sToken }), 1); //Security Token
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "appid", text: this._getAppID() }), 1); //App ID
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "cbokey", text: this._sFileKey }), 1); //File key(Guid를 키로 지정함)
    
            },
            onUploadComplete: function (oEvent) {      
                //업로드 프로세스 끝난 직후 동작      
                oEvent.getSource().setBusy(false);
            },
            _submitSave: function(bEdit) {
                var oResourceBundle = this.getResourceBundle(),
                    oView = this.getView(),
                    oModel = oView.getModel(),
                    oSmartForm = oView.byId("idForm");
                //smartform validation check
                if (oSmartForm.check().length > 0) {
                    sap.m.MessageBox.error(oResourceBundle.getText("msgCheckMandatory"));
                    return;
                }
                //변경내용 일괄 submit
                oModel.submitChanges({
                    success: function (oData, oResp) {
                        this._sFileKey = oSmartForm.getBindingContext().getProperty('Guid');
                        this._oUploadSet.upload();
                        //화면 입력/조회 상태를 변경
                        this.setViewConfig("/isEdit", bEdit);
                        sap.m.MessageToast.show(oResourceBundle.getText("msgSaveSuccessfully"));
                        //List View로 이동
                        this.goNavBack();
                    }.bind(this),
                    error: function (oError) {
                        if (oError.statusCode === 500) {
                            sap.m.MessageToast.show(oResourceBundle.getText("msgUpdateError"));
                        } else {
                            sap.m.MessageToast.show(JSON.parse(oError.responseText).error.message.value);
                        }
                    }
                }); 
            }
        });
    }
);
