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
        "hkmc/ca/zucaz00010/utils/UploadSet"

    ],
    function (Controller, UploadSet) {
        "use strict";

        return Controller.extend("hkmc.ca.zucaz00030.controller.Create", {
            _oUploadSet: null,
            onInit: function () {
                this.initViewConfigModel();
                this._getAuth();
                this._sFileKey = "";
                this.getRoute("RouteCreate").attachPatternMatched(this._onObjectMatched, this);

            },

            _onObjectMatched: function (oEvent) {
                var oModel = this.getView().getModel();
                this.resetModelChanges();
                //화면 입력/조회 상태를 변경: 조회
                this.setViewConfig("/isEdit", true);


                oModel.metadataLoaded().then(function () {
                    var oContext = oModel.createEntry("ZVCAZ00010_DDL", null);
                    this.getView().bindElement({
                        path: oContext.getPath(),
                        events: {
                            change: function (oEvt) {
                                var sContent = "{Content}";
                                this._bindEditor("idRTEDetailCreate", sContent);
                            }.bind(this)
                        }
                    });
                }.bind(this));
                this._oUploadSet = new UploadSet("idUploadSet", this.byId("idUploadSetContainer"), "{viewConfig>/isEdit}", {
                    beforeUploadStarts: this.onBeforeUploadStarts.bind(this),
                    uploadComplete: this.onUploadComplete.bind(this)
                });

                this._oUploadSet.filterItems(this._getAppID(), this._sFileKey);
            },
            _bindEditor: function (sId, sContent) {
                //Rich Text Editor를 화면 및 모델에 바인딩
                var oContainer = this.getView().byId(sId + "Container");
                this.setRichTextEditor(sId, oContainer, sContent, this.getViewModel("viewConfig").getProperty("/isEdit"), "{viewConfig>/isEdit}");
            },
            handleCancel: function (oEvent) {
                //저장하지 않은 변경 내용 리셋
                this.resetModelChanges();
                //List View로 이동
                this.goNavBack();
            },
            handleSave: function () {
                var bEdit = this.getViewConfig("/isEdit");
                this._submitSave(bEdit);
            }
        });
    }
);
