sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "hkmc/ca/yyz00010/dialog/Confirm",
    "hkmc/ca/yyz00010/utils/UploadSet"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, Confirm, UploadSet) {
        "use strict";

        return Controller.extend("hkmc.ca.yyz00010.controller.View1", {
            onInit: function () {
                // this._oUploadSet = new UploadSet("idUploadSet", this.byId("idVBox"), true, {});
                this._oUploadSet = new UploadSet("idUploadSet", this.byId("idVBox"), "{viewConfig>/isEdit}", {
                    beforeUploadStarts: this.onBeforeUploadStarts.bind(this),
                    uploadComplete: this.onUploadComplete.bind(this),
                    onFileDeleted: this.onFileDeleted.bind(this),
                    afterItemRemoved: this.afterItemRemoved.bind(this)
                    //,removePressed : this.removePressed.bind(this)
                });
                 //this._oUploadSet.filterItems("ZUCAA00100", "D3458EC37F8C1EDD91A64353CD1A67D7");
                 this._oUploadSet.filterItems("YYZ00010", "YYZ00010");
                 
                
            },
            onBeforeUploadStarts: function (oEvent) {
                //업로드 프로세스 시작 직전에 동작
                //var sToken = this.getModel().getSecurityToken(),
                var sToken = this.getView().getModel().getSecurityToken(),
                    oUpload = oEvent.getSource(),
                    oItem = oEvent.getParameter("item");
                    oUpload.setBusy(true);
                //UploadSet 헤더 데이터 삽입
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "slug", text: encodeURIComponent(oItem.getFileName()) }), 1); //첨부파일명
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "x-csrf-token", text: sToken }), 1); //Security Token
                //oUpload.insertHeaderField(new sap.ui.core.Item({ key: "appid", text: this._getAppID() }), 1); //App ID
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "appid", text: "YYZ00010" }), 1); //App ID
                //oUpload.insertHeaderField(new sap.ui.core.Item({ key: "cbokey", text: this._sFileKey }), 1); //File key(Guid를 키로 지정함)
                oUpload.insertHeaderField(new sap.ui.core.Item({ key: "cbokey", text: "YYZ00010" }), 1); //File key(Guid를 키로 지정함)
    
            },
            onUploadComplete: function (oEvent) {    
                //업로드 프로세스 끝난 직후 동작      
                oEvent.getSource().setBusy(false);
            },


            handleDelete: function () {
                //삭제 진행 Confirm 창 열림
                var oConfirm = new Confirm({
                    handleSubmit: this._confirmDelete.bind(this)
                });
                oConfirm.delete();
            },

            afterItemRemoved: function(oEvent) {  
                alert('22');
            },
            onFileDeleted: function(oEvent) {  
                alert('22');
            },
            onTest: function(oEvent) {  
                this._oUploadSet.filterItems("YYZ00010", "YYZ00010");  
            },

            // 바로 삭제 되게 .~~~ 
            // removePressed: function(oEvent) {  
            //     oEvent.preventDefault();  /// 자동이벤트 제거

            //     var oItem = oEvent.getParameter("item");
            //     var sFiliename = oItem.getFileName()
            //     //var sUrl = oEvent.getParameter("item").getUrl();
            //     var sPath = oItem.getBindingContext("attachModel").sPath

            //     var oView = this.getView(),
            //     oModel = oView.getModel();

            //     var that = this;

            //     sap.m.MessageBox.confirm("Do you want to delete ‘"+sFiliename+"’ ?", {
            //         actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
            //         title: "Delete file",
            //         emphasizedAction: sap.m.MessageBox.Action.OK,
            //         onClose: function (sAction) {
            //             if(sAction=='OK'){
            //                 sap.m.MessageToast.show("Action selected: " + sAction);
            //                 oModel.remove(sPath, {
            //                     method: "DELETE",
            //                     success: function (oData, oResponse) {
            //                         that._oUploadSet.filterItems("YYZ00010", "YYZ00010");  
            //                         sap.m.MessageToast.show("Customer deleted Successfully");
            //                     },
            //                     error: function (oError) {
            //                         sap.m.MessageToast.show(Error);
            //                     }
            //                 });

            //             }
                        
            //         }
            //     });
                
            // },


            handlePress:function(){
                alert(111) ;
                this._oUploadSet.setVisibleRemove(false);
            },
            handleSave:function(){
               this._oUploadSet.upload();
               // 1초 뒤에 refresh.~~
               var that = this;
               setTimeout(function() {
                that.onTest();
               }, 1000);
              
               //this._oUploadSet.filterItems("YYZ00010", "YYZ00010");  
               
                // this._aDeleteFiles.forEach(function (oContenxt) {
                //     this._oDataModel.remove(oContenxt.getPath());
                // }.bind(this));
            }

            // filterItems: function (sAppID, sCBOKey) {
            //     var aFilter = [];
            //     aFilter.push(new sap.ui.model.Filter("AppId", sap.ui.model.FilterOperator.EQ, sAppID));
            //     aFilter.push(new sap.ui.model.Filter("CboKey", sap.ui.model.FilterOperator.EQ, sCBOKey));
            //     this._oUploadSet.getBinding("items").filter(aFilter);
            // },


        });
    });
