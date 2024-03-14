sap.ui.define([
	"sap/ui/model/type/Currency"
], function(Currency) {
	"use strict";

	return {
		
		formatSemanticAction: function(sSemantic, sAction) {
			if(sAction){
				return sSemantic + " / " + sAction;
			}else{
				return sSemantic;
			}
			
		}

	};
});