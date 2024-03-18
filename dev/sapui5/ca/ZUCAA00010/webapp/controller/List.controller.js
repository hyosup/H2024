sap.ui.define(["hkmc/ca/zucaa00010/controller/BaseController","hkmc/ca/zucaa00010/model/formatter","sap/ui/model/json/JSONModel","sap/m/MessageToast","hkmc/ca/zucaa00010/utils/Confirm","hkmc/ca/zucaa00010/model/models"],function(e,t,s,i,o,n){"use strict";return e.extend("hkmc.ca.zucaa00010.controller.List",{formatter:t,onInit:function(){this._oList=this.byId("idTree");this._aDeletedSubsection=[];this._aSelectedIndices=[];this._sVersion="";this.getModel().setSizeLimit(200);this.getRoute("RouteList").attachPatternMatched(this._onObjectTreeListMatched,this);this.getRoute("RouteContents").attachPatternMatched(this._onObjectContentListMatched,this);this._addTreeContextMenu();this._oNodeDialog=this.getView().byId("idNodeDialog");this._oNodeDialog.setModel(this.getModel());this._oSubsectionDialog=this.getView().byId("idSubsectionDialog");this.byId("idLanguComboBox").setSelectedKey(sap.ui.getCore().getConfiguration().getLanguage().toUpperCase())},_onObjectTreeListMatched:function(e){this._bindTree()},_onObjectContentListMatched:function(e){this._oParameter=e.getParameter("arguments");this._sVersion=this._oParameter.version;this.setViewConfig("/listLanguage",this._oParameter.spras);var t=this.byId("idTree");if(!t.getBinding("items")){this._bindTree()}this.setViewConfig("/layout",sap.f.LayoutType.TwoColumnsMidExpanded)},handleVersionChange:function(e){var t=e.getParameter("selectedItem").getKey();if(this._sVersion!==t){this._sVersion=t;this._bindTree()}},handleLanguChange:function(e){this._bindTree()},_bindTree:function(){var e=[];var t=this.byId("idTree");e.push(new sap.ui.model.Filter("Version",sap.ui.model.FilterOperator.EQ,this._sVersion));e.push(new sap.ui.model.Filter("Spras",sap.ui.model.FilterOperator.EQ,this.getViewConfig("/listLanguage")));t.bindItems({path:"/TreeSet",mode:"SingleSelectMaster",parameters:{countMode:"Inline",numberOfExpandedLevels:1},filters:e,template:new sap.m.StandardTreeItem({title:"{Title}",tooltip:{path:"NodeType",formatter:this.formatter.formatTreeTooltip},icon:{parts:[{path:"NodeType"},{path:"Zdel"}],formatter:this.formatter.formatTreeIcon}})})},_expandTree:function(){var e=this._oList.getItems();var t=this.getViewModel();this._aSelectedIndices=[];for(var s=0;s<e.length;s++){if(e[s].getExpanded()){var i=t.getProperty(e[s].getBindingContext().getPath());this._aSelectedIndices.push(i.NodeId)}}},onUpdateFinished:function(e){var t=this._oList.getItems();var s=this.getViewModel();for(var i=0;i<t.length;i++){var o=s.getProperty(t[i].getBindingContext().getPath());if(this._aSelectedIndices[0]===o.NodeId){this._aSelectedIndices.splice(0,1);if(!t[i].isLeaf()){this._oList.expand(this._oList.indexOfItem(t[i]))}break}}},_addTreeContextMenu:function(){var e=this.getResourceBundle();this._oList.setContextMenu(new sap.m.Menu({items:[new sap.m.MenuItem({text:e.getText("createNode"),icon:"sap-icon://create",press:this.handleNodeCreatePress.bind(this)}),new sap.m.MenuItem({text:e.getText("editNode"),icon:"sap-icon://edit",press:this.handleNodeEditPress.bind(this)}),new sap.m.MenuItem({text:e.getText("deleteNode"),icon:"sap-icon://delete",press:this.handleNodeDeletePress.bind(this)}),new sap.m.MenuItem({text:e.getText("recoverNode"),icon:"sap-icon://undo",press:this.handleNodeRecoverPress.bind(this)})]}))},onBeforeOpenContextMenu:function(e){var t=this.getViewModel().getProperty(e.getParameter("listItem").getBindingContextPath());var s=e.getSource().getContextMenu().getItems();if(t.NodeType==="leaf"){s[0].setVisible(false)}else{s[0].setVisible(true)}s[3].setVisible(t.Zdel)},onDragStart:function(e){var t=e.getParameter("dragSession");var s=e.getParameter("target");t.setComplexData("hierarchymaintenance",{draggedItemContexts:s})},onDrop:function(e){var t=this.byId("idTree"),s=t.getBinding("items"),i=e.getParameter("dragSession"),o=e.getParameter("droppedControl"),n=i.getComplexData("hierarchymaintenance").draggedItemContexts,r=t.indexOfItem(o),a=s.getContextByIndex(r),d=e.getParameter("dropPosition"),l=this.getViewModel(),h=l.getProperty(n.getBindingContextPath()),u=l.getProperty(o.getBindingContextPath());if(n.length===0||!a){return}if(h.NodeId===u.NodeId){return}if(h.NodeId===u.PnodeId){return}if(d==="On"&&u.NodeType!=="expanded"){return}var c=o.getParentNode(),g;while(g!==undefined){g=l.getProperty(c.getBindingContextPath());if(h.NodeId===g.NodeId){return}c=c.getParentNode()}h.PnodeId=u.NodeId;switch(d){case"On":h.NodeState="MOVEON";break;case"Before":h.NodeState="MOVEBEFORE";break;case"After":h.NodeState="MOVEAFTER";break}var p=l.createKey("/TreeSet",{NodeId:h.NodeId,Version:h.Version,Spras:h.Spras});l.update(p,h,{success:function(e,t){this._updateNodePath(h)}.bind(this),error:function(e){return}})},_updateNodePath:function(e){this.getViewModel().callFunction("/UpdateNodePath",{method:"POST",urlParameters:{NodeId:e.NodeId,Version:e.Version},success:function(e,t){},error:function(e){}})},handleRootCreatePress:function(){var e=this.byId("idLanguComboBox").getItems(),t=n.createNodeModel(),s=[];for(var i=0;i<e.length;i++){s.push({Spras:e[i].getKey(),Sprast:e[i].getText(),Title:""})}t.setProperty("/titleList",s);this.setViewConfig("/isNode",false);this.setViewModel(t,"localData");this._isNew=true;this._oNodeDialog.open()},handleNodeCreatePress:function(e){var t=this.getViewModel().getProperty(e.getSource().getBindingContext().getPath());var s=this.byId("idLanguComboBox").getItems(),i=n.createNodeModel(),o=[];for(var r=0;r<s.length;r++){o.push({Spras:s[r].getKey(),Sprast:s[r].getText(),Title:""})}i.setProperty("/PnodeId",t.NodeId);i.setProperty("/NodeType","expanded");i.setProperty("/titleList",o);this.setViewModel(i,"localData");this.setViewConfig("/isNode",true);this._isNew=true;this._oNodeDialog.open()},handleNodeEditPress:function(e){this._aDeletedSubsection=[];var t=e.getSource().getBindingContext().getObject(),s=n.createNodeModel(),i=[];s.setProperty("/PnodeId",t.PnodeId);s.setProperty("/NodeId",t.NodeId);s.setProperty("/NodeType",t.NodeType);s.setProperty("/titleList",i);this.setViewConfig("/isNode",false);this._isNew=false;var o=[];o.push(new sap.ui.model.Filter("NodeId",sap.ui.model.FilterOperator.EQ,t.NodeId));o.push(new sap.ui.model.Filter("Version",sap.ui.model.FilterOperator.EQ,t.Version));this.getModel().read("/NodeSet",{filters:o,success:function(e,t){s.setProperty("/titleList",e.results)}.bind(this)});o=[];o.push(new sap.ui.model.Filter("PnodeId",sap.ui.model.FilterOperator.EQ,t.NodeId));o.push(new sap.ui.model.Filter("Version",sap.ui.model.FilterOperator.EQ,t.Version));o.push(new sap.ui.model.Filter("Spras",sap.ui.model.FilterOperator.EQ,t.Spras));this.getModel().read("/SubSectionSet",{filters:o,success:function(e,t){var i=[];for(var o=0;o<e.results.length;o++){var n=JSON.parse(e.results[o].TitleLangu),r="";for(var a=0;a<n.length;a++){r+=n[a].sprast+": "+n[a].title+"\n"}i.push({NodeId:e.results[o].NodeId,Version:e.results[o].Version,Spras:e.results[o].Spras,Title:r,items:n})}s.setProperty("/subsectionList",i)}.bind(this)});this.setViewModel(s,"localData");this._oNodeDialog.open()},handleNodeDeletePress:function(e){this._oSelected=e.getSource().getBindingContext();var t=new o({handleSubmit:this._confirmDelete.bind(this)});t.delete();this._expandTree()},_confirmDelete:function(){var e=this.getViewModel(),t=this.getResourceBundle();e.remove(this._oSelected.getPath(),{success:function(e,s){i.show(t.getText("deleteSuccessfully"))},error:function(e){i.show(JSON.parse(e.responseText).error.message.value)}})},handleNodeRecoverPress:function(e){this._oSelected=e.getSource().getBindingContext();var t=new o({handleSubmit:this._confirmRecover.bind(this)});t.show();this._expandTree()},_confirmRecover:function(){var e=this.getViewModel(),t=this.getResourceBundle();var s=e.getProperty(this._oSelected.getPath());s.NodeState="RECOVER";e.update(this._oSelected.getPath(),s,{success:function(e,s){i.show(t.getText("saveSuccessfully"))},error:function(e){i.show(JSON.parse(e.responseText).error.message.value)}})},handleNodeCancelPress:function(){this._oNodeDialog.unbindObject();var e=this._oNodeDialog.getModel();if(e.hasPendingChanges()){e.resetChanges()}this._oNodeDialog.close()},handleNodeSavePress:function(){var e=this.getViewModel(),t=this.getViewModel("localData"),s=t.getProperty("/"),o=this.getResourceBundle(),n=false;this._sVersion=this.byId("idVersionComboBox").getSelectedItem().getKey();if(s.NodeType==="leaf"&&s.subsectionList.length<1){n=true}if(n){sap.m.MessageBox.error(o.getText("checkMandatory"));return}var r=[],a=[];for(var d=0;d<s.titleList.length;d++){r.push({Title:s.titleList[d].Title,Spras:s.titleList[d].Spras})}for(var l=0;l<s.subsectionList.length;l++){var h=[];for(var u=0;u<s.subsectionList[l].items.length;u++){h.push({Title:s.subsectionList[l].items[u].title,Spras:s.subsectionList[l].items[u].spras})}a.push({NodeId:s.subsectionList[l].NodeId,Version:s.subsectionList[l].Version,Title:s.subsectionList[l].Title,to_subsection:h})}var c={NodeId:s.NodeId,PnodeId:s.PnodeId,Version:this._sVersion,NodeType:s.NodeType,to_node:r,to_subsection:a};e.create("/TreeSet",c,{success:function(t,s){var n="";for(d=0;d<this._aDeletedSubsection.length;d++){n=e.createKey("/SubSectionSet",{NodeId:this._aDeletedSubsection[d].NodeId,Version:this._aDeletedSubsection[d].Version,Spras:this._aDeletedSubsection[d].Spras});e.remove(n)}e.refresh();this._bindTree();i.show(o.getText("saveSuccessfully"));this._oNodeDialog.unbindObject();this._oNodeDialog.close()}.bind(this),error:function(e){i.show(JSON.parse(e.responseText).error.message.value)}});this._expandTree()},handleSubsectionAddPress:function(){var e=this.byId("idLanguComboBox").getItems(),t=[];for(var i=0;i<e.length;i++){t.push({spras:e[i].getKey(),sprast:e[i].getText(),title:""})}this.setViewModel(new s({ItemList:t}),"subsectionItem");this._oSubsectionDialog.open()},handleSubsectionDelPress:function(e){var t=e.getParameter("listItem"),s=t.getBindingContext("localData"),i=s.getObject();if(i.NodeId){this._aDeletedSubsection.push(i)}var o=this.getViewModel("localData"),n=o.getProperty("/subsectionList");n.splice(e.getSource().indexOfItem(t),1);o.setProperty("/subsectionList",n)},handleSubsectionCancelPress:function(){this._oSubsectionDialog.close()},handleSubsectionSavePress:function(){var e=this.getViewModel("localData");var t=e.getProperty("/subsectionList"),s=this.getViewModel("subsectionItem").getProperty("/ItemList"),i="";for(var o=0;o<s.length;o++){i+=s[o].sprast+": "+s[o].title+"\n"}t.push({Title:i,items:s});e.setProperty("/subsectionList",t);this._oSubsectionDialog.close()},handleItemPress:function(e){var t=e.getSource().getSelectedItem().getBindingContext().getPath(),s=this.getViewModel().getProperty(t);if(s.Zlevel==="0"){this.setViewConfig("/layout",sap.f.LayoutType.OneColumn);return}if(s.NodeType==="expanded"){this.setViewConfig("/layout",sap.f.LayoutType.OneColumn);return}this.setViewConfig("/layout",sap.f.LayoutType.TwoColumnsMidExpanded);this._sVersion=s.Version;this.getRouter().navTo("RouteContents",{node_id:s.NodeId,version:encodeURIComponent(this._sVersion),spras:s.Spras})},handleVersionPress:function(){var e=sap.ushell.Container.getService("CrossApplicationNavigation");e.toExternal({target:{shellHash:"DevCommunity-version"}})}})});