sap.ui.define([
    "sap/ui/base/ManagedObject",
    "hkmc/ca/yyz00010/model/formatter",
    "sap/m/upload/UploadSet",
    "sap/m/upload/UploadSetItem",
    "sap/m/ObjectAttribute",
    "sap/ui/model/odata/v2/ODataModel"
], function (
    ManagedObject,
    formatter,
    UploadSet,
    UploadSetItem,
    ObjectAttribute,
    ODataModel
) {
    "use strict";

    return ManagedObject.extend("hkmc.ca.yyz00010.utils.UploadSet", {
        formatter: formatter,
        _oUploadSet: null,
        _oDataModel: null,
        _aDeleteFiles: [],
        _sServiceURL: "/sap/opu/odata/sap/YYZ00010_SRV/",
        constructor: function (sId, oContainer, sUploadEnabled, oEvent) {
            if (oContainer) {
                oContainer.destroyItems();
            }
            this._aDeleteFiles = [];
            var oUploadItem = new UploadSetItem({
                enabledEdit: false,
                enabledRemove:sUploadEnabled,
                url: "{attachModel>Downurl}",
                fileName: "{attachModel>FileName}",
                visibleEdit: false,
                visibleRemove: true,
                mediaType: "{attachModel>Mimetype}",
                attributes: [
                    new ObjectAttribute({
                        text: "{attachModel>Erdat}",
                        title: "Created on"
                    }),
                    new ObjectAttribute({
                        text: {
                            path: "attachModel>FileSize",
                            formatter: formatter.formatFileSize
                        },
                        title: "Size"
                    }),
                    new ObjectAttribute({
                        text: {
                            path: "attachModel>Guid"
                        },
                        title: "Guid"
                    })
                ]
            });
            if (oEvent.removePressed) {
                 // alert('233');
                oUploadItem.attachRemovePressed(oEvent.removePressed.bind(this));
            }
            else {
                 // alert('2555');
                oUploadItem.attachRemovePressed(this._handleRemovePressed.bind(this));
            }
            if (sId === "") {
                this._oUploadSet = new UploadSet({
                    maxFileSize: 100,
                    mode: "None",
                    instantUpload: false,
                    uploadEnabled: sUploadEnabled,
                    uploadUrl: "/sap/opu/odata/sap/YYZ00010_SRV/FileSet",
                    items: {
                        path: 'attachModel>/FileListSet',
                        template: oUploadItem
                    }
                });
            } else {
                this._oUploadSet = new UploadSet({
                    id: sId,
                    maxFileSize: 100,
                    mode: "None",
                    instantUpload: false,
                    uploadEnabled: sUploadEnabled,
                    uploadUrl: "/sap/opu/odata/sap/YYZ00010_SRV/FileSet",
                    items: {
                        path: 'attachModel>/FileListSet',
                        template: oUploadItem
                    }
                });
            }
            this._oDataModel = new ODataModel(this._sServiceURL, {
                defaultCountMode: sap.ui.model.odata.CountMode.None
            });
            //  https://stackoverflow.com/questions/41996061/how-to-disable-v2-odata-batch-request-by-default-in-ui5
            // 다중건을 삭제 했을때 batch로 안돌리고 한건씩 삭제.
            this._oDataModel.setUseBatch(false);
            this._oUploadSet.setModel(this._oDataModel, "attachModel");

            if (oEvent.beforeUploadStarts) {
                this._oUploadSet.attachBeforeUploadStarts(oEvent.beforeUploadStarts);
            }
            if (oEvent.uploadComplete) {
                this._oUploadSet.attachUploadCompleted(oEvent.uploadComplete);
            }
            if (oEvent.fileSizeExceeded) {
                this._oUploadSet.attachFileSizeExceeded(oEvent.fileSizeExceeded);
            }
            if (oContainer) {
                oContainer.addItem(this._oUploadSet);
            }
        },
        _handleRemovePressed: function (oEvt) {
            // alert(11);
            var oItem = oEvt.getSource();
            this._aDeleteFiles.push(oItem.getBindingContext("attachModel"));
        },
        setVisibleRemove: function (bFlag) {

            this._oUploadSet.getItems().forEach(function (oItem) {
                oItem.setVisibleRemove(bFlag);
            });
        },
        filterItems: function (sAppID, sCBOKey) {
            var aFilter = [];
            aFilter.push(new sap.ui.model.Filter("AppId", sap.ui.model.FilterOperator.EQ, sAppID));
            aFilter.push(new sap.ui.model.Filter("CboKey", sap.ui.model.FilterOperator.EQ, sCBOKey));
            this._oUploadSet.getBinding("items").filter(aFilter);
        },
        upload: function () {
            this._oUploadSet.upload();

            this._aDeleteFiles.forEach(function (oContenxt) {
                this._oDataModel.remove(oContenxt.getPath());
            }.bind(this));
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
    });
});