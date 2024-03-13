sap.ui.define([
    "hkmc/ca/zucaa00010/controller/BaseController",
    "hkmc/ca/zucaa00010/model/formatter",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "hkmc/ca/zucaa00010/utils/Confirm",
    "hkmc/ca/zucaa00010/model/models"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, JSONModel, MessageToast, Confirm, models) {
        "use strict";

        return Controller.extend("hkmc.ca.zucaa00010.controller.List", {
            formatter: formatter,
            onInit: function () {
                this._oList = this.byId("idTree");
                this._aDeletedSubsection = [];
                this._aSelectedIndices = [];
                this._sVersion = "";

                this.getModel().setSizeLimit(200);
                this.getRoute("RouteList").attachPatternMatched(this._onObjectTreeListMatched, this);
                this.getRoute("RouteContents").attachPatternMatched(this._onObjectContentListMatched, this);
                this._addTreeContextMenu();

                this._oNodeDialog = this.getView().byId("idNodeDialog");
                this._oNodeDialog.setModel(this.getModel());
                this._oSubsectionDialog = this.getView().byId("idSubsectionDialog");

                this.byId("idLanguComboBox").setSelectedKey(sap.ui.getCore().getConfiguration().getLanguage().toUpperCase());
            },
            _onObjectTreeListMatched: function (oEvent) {
                this._bindTree();
            },
            _onObjectContentListMatched: function (oEvent) {
                this._oParameter = oEvent.getParameter("arguments");
                this._sVersion = this._oParameter.version
                this.setViewConfig("/listLanguage", this._oParameter.spras);
                var oTree = this.byId("idTree");
                if (!oTree.getBinding("items")) {
                    this._bindTree();
                }
                this.setViewConfig("/layout", sap.f.LayoutType.TwoColumnsMidExpanded);
            },
            handleVersionChange: function (oEvt) {
                var sKey = oEvt.getParameter("selectedItem").getKey();
                if (this._sVersion !== sKey) {
                    this._sVersion = sKey;
                    this._bindTree();
                }
            },
            handleLanguChange: function (oEvt) {
                this._bindTree();
            },
            _bindTree: function () {
                var aFilter = [];
                var oTree = this.byId("idTree");

                aFilter.push(new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, this._sVersion));
                aFilter.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, this.getViewConfig("/listLanguage")));
                oTree.bindItems({
                    path: "/TreeSet",
                    mode: "SingleSelectMaster",
                    parameters: {
                        countMode: "Inline",
                        numberOfExpandedLevels: 1
                    },
                    filters: aFilter,
                    template: new sap.m.StandardTreeItem({
                        title: "{Title}",
                        tooltip: {
                            path: "NodeType",
                            formatter: this.formatter.formatTreeTooltip
                        },
                        icon: {
                            parts: [{
                                path: "NodeType"
                            }, {
                                path: "Zdel"
                            }],
                            formatter: this.formatter.formatTreeIcon
                        }
                    })

                });

            },
            _expandTree: function () {
                var oTreeItems = this._oList.getItems();
                var oModel = this.getViewModel();
                this._aSelectedIndices = [];
                for (var i = 0; i < oTreeItems.length; i++) {
                    if (oTreeItems[i].getExpanded()) {
                        var oItem = oModel.getProperty(oTreeItems[i].getBindingContext().getPath());
                        this._aSelectedIndices.push(oItem.NodeId);
                    }
                }
            },
            onUpdateFinished: function (oEvent) {
                var oTreeItems = this._oList.getItems();
                var oModel = this.getViewModel();
                for (var i = 0; i < oTreeItems.length; i++) {
                    var oItem = oModel.getProperty(oTreeItems[i].getBindingContext().getPath());
                    if (this._aSelectedIndices[0] === oItem.NodeId) {
                        this._aSelectedIndices.splice(0, 1);
                        if (!oTreeItems[i].isLeaf()) {
                            this._oList.expand(this._oList.indexOfItem(oTreeItems[i]));
                        }
                        break;
                    }
                }
            },
            _addTreeContextMenu: function () {
                var oResourceBundle = this.getResourceBundle();

                this._oList.setContextMenu(new sap.m.Menu({
                    items: [
                        new sap.m.MenuItem({
                            text: oResourceBundle.getText("createNode"),
                            icon: "sap-icon://create",
                            press: this.handleNodeCreatePress.bind(this)
                        }),
                        new sap.m.MenuItem({
                            text: oResourceBundle.getText("editNode"),
                            icon: "sap-icon://edit",
                            press: this.handleNodeEditPress.bind(this)
                        }),
                        new sap.m.MenuItem({
                            text: oResourceBundle.getText("deleteNode"),
                            icon: "sap-icon://delete",
                            press: this.handleNodeDeletePress.bind(this)
                        }),
                        new sap.m.MenuItem({
                            text: oResourceBundle.getText("recoverNode"),
                            icon: "sap-icon://undo",
                            press: this.handleNodeRecoverPress.bind(this)
                        })
                    ]
                }));
            },
            onBeforeOpenContextMenu: function (oEvent) {
                var oItem = this.getViewModel().getProperty(oEvent.getParameter("listItem").getBindingContextPath());
                var oContextMenuItems = oEvent.getSource().getContextMenu().getItems();
                if (oItem.NodeType === "leaf") {
                    oContextMenuItems[0].setVisible(false);
                } else {
                    oContextMenuItems[0].setVisible(true);
                }

                oContextMenuItems[3].setVisible(oItem.Zdel);

            },
            onDragStart: function (oEvent) {
                var oDragSession = oEvent.getParameter("dragSession");
                var oDraggedItem = oEvent.getParameter("target");
                oDragSession.setComplexData("hierarchymaintenance", {
                    draggedItemContexts: oDraggedItem
                });
            },
            onDrop: function (oEvent) {
                var oTree = this.byId("idTree"),
                    oBinding = oTree.getBinding("items"),
                    oDragSession = oEvent.getParameter("dragSession"),
                    oDroppedItem = oEvent.getParameter("droppedControl"),
                    aDraggedItemContexts = oDragSession.getComplexData("hierarchymaintenance").draggedItemContexts,
                    iDroppedIndex = oTree.indexOfItem(oDroppedItem),
                    oNewParentContext = oBinding.getContextByIndex(iDroppedIndex),
                    oOption = oEvent.getParameter("dropPosition"),
                    oModel = this.getViewModel(),
                    oDraggedItemData = oModel.getProperty(aDraggedItemContexts.getBindingContextPath()),
                    oDroppedItemData = oModel.getProperty(oDroppedItem.getBindingContextPath());

                if (aDraggedItemContexts.length === 0 || !oNewParentContext) {
                    return;
                }
                if (oDraggedItemData.NodeId === oDroppedItemData.NodeId) {
                    return;
                }
                if (oDraggedItemData.NodeId === oDroppedItemData.PnodeId) {
                    return;
                }
                if (oOption === "On" && oDroppedItemData.NodeType !== "expanded") {
                    return;
                }
                var oParentNode = oDroppedItem.getParentNode(),
                    oParentNodeData;
                while (oParentNodeData !== undefined) {
                    oParentNodeData = oModel.getProperty(oParentNode.getBindingContextPath());
                    if (oDraggedItemData.NodeId === oParentNodeData.NodeId) {
                        return;
                    }
                    oParentNode = oParentNode.getParentNode();
                }
                oDraggedItemData.PnodeId = oDroppedItemData.NodeId; //"pnode_id를 target_node_id로 전용하여 전달
                switch (oOption) {
                    case "On":
                        oDraggedItemData.NodeState = "MOVEON";
                        break;
                    case "Before":
                        oDraggedItemData.NodeState = "MOVEBEFORE";
                        break;
                    case "After":
                        oDraggedItemData.NodeState = "MOVEAFTER";
                        break;
                }
                var sPath = oModel.createKey("/TreeSet", {
                    NodeId: oDraggedItemData.NodeId,
                    Version: oDraggedItemData.Version,
                    Spras: oDraggedItemData.Spras
                });
                oModel.update(sPath, oDraggedItemData, {
                    success: function (oData, oResponse) { 
                        this._updateNodePath(oDraggedItemData);                
                    }.bind(this),
                    error: function (oError) {
                        return;
                    }
                });
                
            },
            _updateNodePath:function(oDraggedItemData){
                this.getViewModel().callFunction("/UpdateNodePath", {
                    method: "POST",
                    urlParameters: {
                        "NodeId": oDraggedItemData.NodeId,
                        "Version": oDraggedItemData.Version
                    },
                    success: function (oData, response) { },
                    error: function (oError) { }
                });
            },
            handleRootCreatePress: function () {
                var aItems = this.byId("idLanguComboBox").getItems(),
                    oModel = models.createNodeModel(),
                    aTitles = [];

                for (var i = 0; i < aItems.length; i++) {
                    aTitles.push({
                        Spras: aItems[i].getKey(),
                        Sprast: aItems[i].getText(),
                        Title: ""
                    });
                }

                oModel.setProperty("/titleList", aTitles);
                this.setViewConfig("/isNode", false);

                this.setViewModel(oModel, "localData");
                this._isNew = true;
                this._oNodeDialog.open();
            },
            handleNodeCreatePress: function (oEvent) {
                var oItem = this.getViewModel().getProperty(oEvent.getSource().getBindingContext().getPath());
                var aLangu = this.byId("idLanguComboBox").getItems(),
                    oModel = models.createNodeModel(),
                    aTitles = [];

                for (var i = 0; i < aLangu.length; i++) {
                    aTitles.push({
                        Spras: aLangu[i].getKey(),
                        Sprast: aLangu[i].getText(),
                        Title: ""
                    });
                }

                oModel.setProperty("/PnodeId", oItem.NodeId);
                oModel.setProperty("/NodeType", "expanded");
                oModel.setProperty("/titleList", aTitles);

                this.setViewModel(oModel, "localData");
                this.setViewConfig("/isNode", true);
                this._isNew = true;
                this._oNodeDialog.open();
            },
            handleNodeEditPress: function (oEvent) {
                this._aDeletedSubsection = [];
                var oItem = oEvent.getSource().getBindingContext().getObject(),
                    oModel = models.createNodeModel(),
                    aTitles = [];

                oModel.setProperty("/PnodeId", oItem.PnodeId);
                oModel.setProperty("/NodeId", oItem.NodeId);
                oModel.setProperty("/NodeType", oItem.NodeType);
                oModel.setProperty("/titleList", aTitles);
                this.setViewConfig("/isNode", false);
                this._isNew = false;

                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("NodeId", sap.ui.model.FilterOperator.EQ, oItem.NodeId));
                aFilters.push(new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, oItem.Version));

                this.getModel().read("/NodeSet", {
                    filters: aFilters,
                    success: function (oData, oResp) {
                        oModel.setProperty("/titleList", oData.results);
                    }.bind(this)
                });
                aFilters = [];
                aFilters.push(new sap.ui.model.Filter("PnodeId", sap.ui.model.FilterOperator.EQ, oItem.NodeId));
                aFilters.push(new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, oItem.Version));
                aFilters.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, oItem.Spras));
                this.getModel().read("/SubSectionSet", {
                    filters: aFilters,
                    success: function (oData, oResp) {
                        var aSubsection = [];
                        for (var i = 0; i < oData.results.length; i++) {
                            var aSubsectionItem = JSON.parse(oData.results[i].TitleLangu),
                                sTitle = "";

                            for (var j = 0; j < aSubsectionItem.length; j++) {
                                sTitle += aSubsectionItem[j].sprast + ": " + aSubsectionItem[j].title + "\n";
                            }
                            aSubsection.push({
                                NodeId: oData.results[i].NodeId,
                                Version: oData.results[i].Version,
                                Spras: oData.results[i].Spras,
                                Title: sTitle,
                                items: aSubsectionItem
                            });
                        }
                        oModel.setProperty("/subsectionList", aSubsection);
                    }.bind(this)
                });
                this.setViewModel(oModel, "localData");

                this._oNodeDialog.open();
            },
            handleNodeDeletePress: function (oEvent) {
                this._oSelected = oEvent.getSource().getBindingContext();
                var oConfirm = new Confirm({
                    handleSubmit: this._confirmDelete.bind(this)
                });
                oConfirm.delete();
                this._expandTree();
            },
            _confirmDelete: function () {
                var oModel = this.getViewModel(),
                    oResourceBundle = this.getResourceBundle();
                oModel.remove(this._oSelected.getPath(), {
                    success: function (oData, oResponse) {
                        MessageToast.show(oResourceBundle.getText("deleteSuccessfully"));
                    },
                    error: function (oError) {
                        MessageToast.show(JSON.parse(oError.responseText).error.message.value);
                    }
                });
            },
            handleNodeRecoverPress: function (oEvent) {
                this._oSelected = oEvent.getSource().getBindingContext();
                var oConfirm = new Confirm({
                    handleSubmit: this._confirmRecover.bind(this)
                });
                oConfirm.show();
                this._expandTree();
            },
            _confirmRecover: function () {
                var oModel = this.getViewModel(),
                    oResourceBundle = this.getResourceBundle();
                var oEntity = oModel.getProperty(this._oSelected.getPath());
                oEntity.NodeState = "RECOVER";
                oModel.update(this._oSelected.getPath(), oEntity, {
                    success: function (oData, oResponse) {
                        MessageToast.show(oResourceBundle.getText("saveSuccessfully"));
                    },
                    error: function (oError) {
                        MessageToast.show(JSON.parse(oError.responseText).error.message.value);
                    }
                });
            },
            handleNodeCancelPress: function () {

                this._oNodeDialog.unbindObject();
                var oModel = this._oNodeDialog.getModel();
                if (oModel.hasPendingChanges()) {
                    oModel.resetChanges();
                }
                this._oNodeDialog.close();
            },
            handleNodeSavePress: function () {
                var oModel = this.getViewModel(),
                    oLocalModel = this.getViewModel("localData"),
                    oLocalEntity = oLocalModel.getProperty("/"),
                    oResourceBundle = this.getResourceBundle(),
                    bValidationError = false;

                this._sVersion = this.byId("idVersionComboBox").getSelectedItem().getKey();

                if (oLocalEntity.NodeType === "leaf" && oLocalEntity.subsectionList.length < 1) {
                    bValidationError = true;
                }
                if (bValidationError) {
                    sap.m.MessageBox.error(oResourceBundle.getText("checkMandatory"));
                    return;
                }
                var aNodeList = [],
                    aSubsection = [];
                for (var i = 0; i < oLocalEntity.titleList.length; i++) {
                    aNodeList.push({
                        Title: oLocalEntity.titleList[i].Title,
                        Spras: oLocalEntity.titleList[i].Spras
                    });
                }
                for (var j = 0; j < oLocalEntity.subsectionList.length; j++) {
                    var aSubsectionItem = [];
                    for (var k = 0; k < oLocalEntity.subsectionList[j].items.length; k++) {
                        aSubsectionItem.push({
                            Title: oLocalEntity.subsectionList[j].items[k].title,
                            Spras: oLocalEntity.subsectionList[j].items[k].spras
                        });
                    }
                    aSubsection.push({
                        NodeId: oLocalEntity.subsectionList[j].NodeId,
                        Version: oLocalEntity.subsectionList[j].Version,
                        Title: oLocalEntity.subsectionList[j].Title,
                        to_subsection: aSubsectionItem
                    });
                }
                var oEntity = {
                    NodeId: oLocalEntity.NodeId,
                    PnodeId: oLocalEntity.PnodeId,
                    Version: this._sVersion,
                    NodeType: oLocalEntity.NodeType,
                    to_node: aNodeList,
                    to_subsection: aSubsection
                };

                oModel.create("/TreeSet", oEntity, {
                    success: function (oData, oRep) {
                        var sPath = "";
                        for (i = 0; i < this._aDeletedSubsection.length; i++) {
                            sPath = oModel.createKey("/SubSectionSet", {
                                NodeId: this._aDeletedSubsection[i].NodeId,
                                Version: this._aDeletedSubsection[i].Version,
                                Spras: this._aDeletedSubsection[i].Spras
                            });
                            oModel.remove(sPath);
                        }
                        oModel.refresh();
                        this._bindTree();

                        MessageToast.show(oResourceBundle.getText("saveSuccessfully"));
                        this._oNodeDialog.unbindObject();
                        this._oNodeDialog.close();
                    }.bind(this),
                    error: function (oError) {
                        MessageToast.show(JSON.parse(oError.responseText).error.message.value);
                    }
                });

                this._expandTree();
            },
            handleSubsectionAddPress: function () {
                var aItems = this.byId("idLanguComboBox").getItems(),
                    aSubsection = [];

                for (var i = 0; i < aItems.length; i++) {
                    aSubsection.push({
                        spras: aItems[i].getKey(),
                        sprast: aItems[i].getText(),
                        title: ""
                    });
                }
                this.setViewModel(new JSONModel({
                    ItemList: aSubsection
                }), "subsectionItem");

                this._oSubsectionDialog.open();
            },
            handleSubsectionDelPress: function (oEvt) {
                var oItem = oEvt.getParameter("listItem"),
                    oContext = oItem.getBindingContext("localData"),
                    oEntity = oContext.getObject();
                if (oEntity.NodeId) {
                    this._aDeletedSubsection.push(oEntity);
                }
                var oModel = this.getViewModel("localData"),
                    aSubsection = oModel.getProperty("/subsectionList");
                aSubsection.splice(oEvt.getSource().indexOfItem(oItem), 1);
                oModel.setProperty("/subsectionList", aSubsection);
            },
            handleSubsectionCancelPress: function () {
                this._oSubsectionDialog.close();
            },
            handleSubsectionSavePress: function () {
                var oModel = this.getViewModel(("localData"));
                var aSubsection = oModel.getProperty("/subsectionList"),
                    aSubsectionInput = this.getViewModel("subsectionItem").getProperty("/ItemList"),
                    sTitle = "";

                for (var i = 0; i < aSubsectionInput.length; i++) {
                    sTitle += aSubsectionInput[i].sprast + ": " + aSubsectionInput[i].title + "\n";
                }
                aSubsection.push({
                    Title: sTitle,
                    items: aSubsectionInput
                });
                oModel.setProperty("/subsectionList", aSubsection);
                this._oSubsectionDialog.close();
            },
            handleItemPress: function (oEvent) {
                var sPath = oEvent.getSource().getSelectedItem().getBindingContext().getPath(),
                    oItem = this.getViewModel().getProperty(sPath);
                if (oItem.Zlevel === "0") {
                    this.setViewConfig("/layout", sap.f.LayoutType.OneColumn);
                    return;
                }
                if (oItem.NodeType === "expanded") {
                    this.setViewConfig("/layout", sap.f.LayoutType.OneColumn);
                    return;
                }
                this.setViewConfig("/layout", sap.f.LayoutType.TwoColumnsMidExpanded);
                this._sVersion = oItem.Version;
                this.getRouter().navTo("RouteContents", {
                    node_id: oItem.NodeId,
                    version: encodeURIComponent(this._sVersion),
                    spras: oItem.Spras
                });
            },
            handleVersionPress: function () {
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation");
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: "DevCommunity-version"
                    }
                });
            }
        });
    });
