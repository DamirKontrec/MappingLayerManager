giscloud.ready(function() {
	window.app = {};

	giscloud.apiKey('bbdbfe7f742c9f1133960f7b913e717e');
	app.viewer = new giscloud.Viewer("mapViewer", 412216);
	app.layerManager = new demo.gis.LayerManager({
		viewer: app.viewer,
		containerSelector: 'body',
		title: 'Map Layers'
	});
});
