
/*******************************************************************************************************
* Task ID     :  [개발항목 번호]
* Request No  :  [요구사항 번호]
* Process No  :  [5 Level Process No]
* App ID      :  hkmc.ca.zucaz00030
* Writer      :  GICSDV05
* Date        :  2023.01.26
* Type        :  Free Style
* Description :  GSI Template 용도로 사용할 Freestyle List Report 프로그램
********************************************************************************************************
* Change History
*&------------------------------------------------------------------------------------------------------
*   Ver. No       Change Date        Writer             Request No.              
*   Description
*&------------------------------------------------------------------------------------------------------
*   1             2023.01.26         GICSDV05           [요구사항 번호]                       
*   최초 개발
********************************************************************************************************
*/
jQuery.sap.registerModulePath("hkmc.ca.zucaz00010", "/sap/bc/ui5_ui5/sap/zucaz00010");

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "hkmc/ca/zucaz00030/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("hkmc.ca.zucaz00030.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                // 화면 입력/조회 상태 변경 모델
                this.setModel(models.createViewConfigModel(),"viewConfig")

            }
        });
    }
);