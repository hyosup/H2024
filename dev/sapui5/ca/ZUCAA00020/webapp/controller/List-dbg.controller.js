sap.ui.define([
    "hkmc/ca/zucaa00020/controller/BaseController",
    "hkmc/ca/zucaa00020/model/formatter",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, formatter, JSONModel) {
        "use strict";

        return Controller.extend("hkmc.ca.zucaa00020.controller.List", {
            formatter: formatter,
            onInit: function () {
                this._oList = this.byId("idTree");
                this._aSelectedIndices = [];
                this._sVersion = "";

                this.getModel().setSizeLimit(200);
                this.getRoute("RouteList").attachPatternMatched(this._onObjectTreeListMatched, this);
                this.getRoute("RouteContents").attachPatternMatched(this._onObjectContentListMatched, this);
                this.getRoute("RouteSearchContents").attachPatternMatched(this._onObjectSearchListMatched, this);
            },
            _onObjectTreeListMatched: function (oEvent) {
                this._bindTree(2);
            },
            _onObjectContentListMatched: function (oEvent) {
                this._oParameter = oEvent.getParameter("arguments");
                this._sVersion = this._oParameter.version
                this.setViewConfig("/listLanguage", this._oParameter.spras);
                var oTree = this.byId("idTree");
                if (!oTree.getBinding("items")) {
                    this._bindTree(2);
                }
                this.setViewConfig("/layout", sap.f.LayoutType.TwoColumnsMidExpanded);
            },
            _onObjectSearchListMatched: function (oEvent) {
                var oModel = this.getModel();
                this._oParameter = oEvent.getParameter("arguments");
                this._sVersion = this._oParameter.version
                this.setViewConfig("/listLanguage", this._oParameter.spras);
                var oTree = this.byId("idTree"),
                    sPath = this.getModel().createKey("/TreeSet", {
                        NodeId: this._oParameter.node_id,
                        Version: this._sVersion,
                        Spras: this.getViewConfig("/listLanguage")
                    });
                oModel.read(sPath, {
                    success: function (oData, oResp) {
                        this._aSelectedIndices = oData.NodePath.split(">");
                        this._bindTree(0);
                    }.bind(this)
                });

                this.setViewConfig("/layout", sap.f.LayoutType.TwoColumnsMidExpanded);
            },
            handleVersionChange: function (oEvt) {
                var sKey = oEvt.getParameter("selectedItem").getKey();
                if (this._sVersion !== sKey) {
                    this._sVersion = sKey;
                    this._bindTree(2);
                }
            },
            _bindTree: function (i) {
                var aFilter = [];
                var oTree = this.byId("idTree");

                aFilter.push(new sap.ui.model.Filter("Version", sap.ui.model.FilterOperator.EQ, this._sVersion));
                aFilter.push(new sap.ui.model.Filter("Spras", sap.ui.model.FilterOperator.EQ, this.getViewConfig("/listLanguage")));
                oTree.bindItems({
                    path: "/TreeSet",
                    mode: "SingleSelectMaster",
                    parameters: {
                        countMode: "Inline",
                        numberOfExpandedLevels: i
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
                }, false);
            },
            handleSearch: function (oEvent) {
                var oItem = this.byId("idVersionComboBox").getSelectedItem(),
                    sQuery = oEvent.getParameter("query");
                if (sQuery.length > 0) {
                    this.setViewConfig("/layout", sap.f.LayoutType.OneColumn);
                    this._sVersion = oItem ? oItem.getKey() : "";
                    this.getRouter().navTo("RouteSearch", {
                        version: encodeURIComponent(this._sVersion),
                        spras: this.getViewConfig("/listLanguage"),
                        query: {
                            search_str: encodeURIComponent(sQuery)
                        }
                    }, false);
                }
            },
            handleDisplayLog: function () {
                var oResourceBundle = this.getResourceBundle();
                if (!this.oDialog) {
                    this.oDialog = new sap.m.Dialog({
                        type: sap.m.DialogType.Message,
                        title: oResourceBundle.getText("displayLog"),
                        content: [
                            new sap.m.Label(),
                            new sap.m.TextArea("confirmationNote", {
                                width: "100%",
                                editable: false,
                                rows: 10
                            })
                        ],
                        endButton: new sap.m.Button({
                            text: oResourceBundle.getText("close"),
                            press: function () {
                                this.oDialog.close();
                            }.bind(this)
                        })
                    });
                }
                var oItem = this.byId("idVersionComboBox").getSelectedItem(),
                    sPath = this.getModel().createKey("/VersionListSet", {
                        Version: oItem.getKey(),
                        Spras : this.getViewConfig("/listLanguage")
                    });
                this.getModel().read(sPath, {
                    success: function (oData) {
                        this.oDialog.getContent()[0].setText(oItem.getText());
                        this.oDialog.getContent()[1].setValue(oData.Zdesc);
                        this.oDialog.open();
                    }.bind(this)
                })

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
                        else {
                            oTreeItems[i].setSelected(true);
                            var oElem = oTreeItems[i].getDomRef();
                            this.byId("idScroll").scrollTo(0, oElem.getBoundingClientRect().y, 2000);
                        }
                        break;
                    }
                }
            },
            handleLanguChange: function (oEvt) {
                this._bindTree(2);
            }
        });
    });
