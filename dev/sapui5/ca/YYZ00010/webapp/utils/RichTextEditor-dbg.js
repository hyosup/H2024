sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/richtexteditor/RichTextEditor"
], function(Control, RichTextEditor) {
	"use strict";
	return RichTextEditor.extend("hkmc.ca.yyz00010.utils.RichTextEditor", {
		metadata: {
			library: "hkmc.ca.yyz00010",
			properties: {
				value: {
					type: "string",
					defaultValue: null
				},
				width: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: "100%"
				},
				height: {
					type: "sap.ui.core.CSSSize",
					group: "Dimension",
					defaultValue: "500px"
				},
				sanitizeValue: {
					type: "boolean",
					group: "Misc",
					defaultValue: false
				}
			},
			events: {}
		},
		init: function() {
			sap.ui.richtexteditor.RichTextEditor.prototype.init.apply(this, arguments);
		},
		onBeforeRendering: function() {
			sap.ui.richtexteditor.RichTextEditor.prototype.onBeforeRendering.apply(this, arguments);
		},
		onAfterRendering: function() {
			sap.ui.richtexteditor.RichTextEditor.prototype.onAfterRendering.apply(this, arguments);
		},
		beforeEditorInit: function(oEvt) {
			// oEvt.getParameters().configuration.content_css = "../css/richtexteditor.css";
			// sap.ui.richtexteditor.RichTextEditor.prototype.beforeEditorInit.apply(this, arguments);
		},
		_createConfigTinyMCE: function(e) {
			var oToolbarWrapper = this.getAggregation("_toolbarWrapper");
			var oPlugin = "code table image link powerpaste preview ";
			oPlugin += "search	replace save lists advlist charmap ";
			var aToolbar = "fullscreen | undo redo ";
			aToolbar += "| formatselect fontselect fontsizeselect ";
			aToolbar += "| bold italic forecolor backcolor styleselect ";
			aToolbar += "| alignleft aligncenter alignright alignjustify ";
			aToolbar += "|	bullist numlist outdent indent ";
			aToolbar += "| link charmap hr ";
			aToolbar += "| table distribute ";
			aToolbar += "| code";

			var r = this.getEditable();
			if (!r) {
				oPlugin = oPlugin.replace(/(,powerpaste|powerpaste,)/gi, "	");
				aToolbar = false;
			}
			var o = this;
			var oConfig = {
				// content_css: "../css/richtexteditor.css",
				directionality: "ltr",
				selector: "#" + this._textAreaId,
				theme: "silver",
				menubar: false,
				language: "en",//sap.ui.richtexteditor.RichTextEditor.prototype._getLanguageTinyMCE4.apply(this, arguments),
				browser_spellcheck: true,
				convert_urls: false,
				plugins: oPlugin,
				toolbar_items_size: "small",
				statusbar: true,
				elementpath: false,
				image_advtab: true,
				resize: true,
				toolbar: aToolbar,
				style_formats_merge: true,
				fontsize_formats: "8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 28pt 36pt 48pt 72pt ",
				paste_data_images: true,
				powerpaste_word_import: "merge",
				powerpaste_html_import: "merge",
				default_link_target: "_blank",
				table_default_attributes: {
					border: "1 "
				},
				table_default_styles: {
					"table-layout ": "fixed",
					"border-collapse": "collapse",
					width: "100%"
				},
				formats: {
					"50%": {
						selector: "p ",
						styles: {
							"line - height": "50%"
						}
					},
					"80%": {
						selector: "p",
						styles: {
							"line - height": "80%"
						}
					},
					"100%": {
						selector: "p",
						styles: {
							"line - height": "100%"
						}
					},
					"120%": {
						selector: "p",
						styles: {
							"line-height": "120%"
						}
					},
					"150%": {
						selector: "p",
						styles: {
							"line-height": "150%"
						}
					},
					"180%": {
						selector: "p",
						styles: {
							"line-height": "180%"
						}
					},
					"200%": {
						selector: "p",
						styles: {
							"line-height": "200%"
						}
					}
				},
				style_formats: [{
					title: "Line Height",
					items: [{
						title: "50%",
						format: "50%"
					}, {
						title: "80%",
						format: "80%"
					}, {
						title: "100%",
						format: "100%"
					}, {
						title: "120%",
						format: "120%"
					}, {
						title: "150%",
						format: "150%"
					}, {
						title: "180%",
						format: "180%"
					}, {
						title: "200%",
						format: "200%"
					}]
				}],
				font_formats: "굴림체=Gulim;돋움체=Dotum;바탕체=Batang;궁서체=Gungsuh;나눔고딕=nanumgothic;나눔바른고딕=nanumbarungothic;나눔붓글씨=nanumbrushscript;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats",
				image_title: true,
				automatic_uploads: true,
				file_picker_types: "image ",
				file_picker_callback: function(e, t, i) {
					var a = document.createElement("input");
					a.setAttribute("type", "file");
					a.setAttribute("accept", "image/*");
					a.onchange = function() {
						var oFile = this.files[0];
						var oFileReader = new FileReader();
						i.onload = function() {
							var a = "blobid" + (new Date()).getTime();
							var r = window.tinymce.activeEditor.editorUpload.blobCache;
							var o = i.result.split(",")[1];
							var l = r.create(a, t, o);
							r.add(l);
							e(l.blobUri(), {
								title: t.name
							});
						};
						oFileReader.readAsDataURL(oFile);
					};
					a.click();
				},
				/*
				setup: function(oEvt) {
					oEvt.addButton("distribute", {
						type: "menubutton",
						text: "Distribute",
						menu: [{
							text: "Distribute Columns",
							onclick: function() {
								o.distributeColumns(oEvt);
							}
						}, {
							text: "Distribute Rows",
							onclick: function() {
								o.distributeRows(oEvt);
							}
						}]
					});
				},
				*/
				readonly: r ? false : true,
				nowrap: !this.getWrapping(),
				init_instance_callback: function(t) {
					this._oEditor = t;
					e();
				}.bind(this)
			};
			if (this._bCustomToolbarRequirementsFullfiled && oToolbarWrapper) {
				oConfig = oToolbarWrapper.modifyRTEToolbarConfig(oConfig);
			}
			this.fireBeforeEditorInit({
				configuration: oConfig
			});
			return oConfig;
		},
		distributeColumns: function(oEvt) {
			var t = oEvt.selection.dom.select("td[data-mce-first-selected]")[0].parentNode.childNodes;
			var i = 0;
			var a = [];
			for (var r = 0; r < t.length; r++) {
				if (t[r].dataset.mceSelected) {
					i = i + t[r].offsetWidth;
					a.push(r);
				}
			}
			var o = oEvt.selection.dom.select("tr");
			for (var l = 0; l < o.length; l++) {
				for (var n = 0; n < a.length; n++) {
					oEvt.dom.setStyle(o[l].childNodes[a[n]], "width", i / a.length);
				}
			}
		},
		distributeRows: function(e) {
			var t = e.selection.dom.select("tr");
			var i = 0;
			var a = [];
			for (var r = 0; r < t.length; r++) {
				for (var o = 0; o < t[r].childNodes.length; o++) {
					if (t[r].childNodes[o].dataset.mceSelected) {
						i = i + t[r].offsetHeight;
						a.push(r);
						break;
					}
				}
			}
			for (var l = 0; l < a.length; l++) {
				e.dom.setStyle(t[a[l]], "height", i / a.length);
				for (var n = 0; +
					n < t[a[l]].childNodes.length; n++) {
					e.dom.setStyle(t[a[l]].childNodes[n], "height", i / a.length);
				}
			}
		},
		renderer: "sap.ui.richtexteditor.RichTextEditorRenderer"
	});
}, true);