/**
 * @class demo.gis.LayerManager
 * @extends demo.ui.Panel
 *
 * Enables user control of various
 * aspects of layers displayed in
 * provided viwer's map (eg. layer
 * opacity, visibility, position, etc.)
 */
demo.gis.LayerManager = demo.ui.Panel.extend({
	/**
	 * @cfg {giscloud.Viewer} (required)
	 * Viewer this component is associated with
	 */
	viewer: null,

	/**
	 * @cfg {Object}
	 * Optional configuration for demo.gis.Layer
	 * objects that are loaded into this layer
	 * manager
	 */
	layerCfg: {},

	/**
	 * @cfg {String}
	 * CSS class for the HTML list containing the
	 * layers of this Layer manager
	 */
	layerListClass: 'layer-list',

	title: "Layers",

	bodyTemplate: new demo.ui.Template(
		'<ul class="{bodyClass} {layerListClass}">',
		'</ul>'
	),

	cssClass: 'panel layer-manager',

	/**
	 * @property {demo.gis.Layer[]}
	 * List of all the layers currently inside this control
	 */
	layers: [],

	/**
	 * @property {jQuery node}
	 * UI of the layer manager's list
	 */
	$list: null,

	initComponent: function() {
		this._super();

		this.addEvents(
			/**
			 * @event layersAdd
			 * Fired when new layers are added into
			 * this layer manager
			 *
			 * @param {demo.gis.LayerManager} this
			 * A layerManager layers were added to
			 *
			 * @param {demo.gis.Layer[]} layers
			 * A list of added layers
			 */
			'layersAdd',

			/**
			 * @event layersRemove
			 * Fired when layers are removed from
			 * this layer manager
			 *
			 * @param {demo.gis.LayerManager} this
			 * A layerManager layers were removed from
			 *
			 * @param {demo.gis.Layer[]} layers
			 * A list of removed layers
			 */
			'layersRemove'
		);

		this.render();
		this.mask();

		var onLayersLoaded = this.onLayersLoaded.bind(this);
		this.viewer.layersLoading.done(onLayersLoaded);
	},

	render: function() {
		this._super();

		this.$list = this.$body;

	},

	/**
	 * @private
	 * Is run once when all the associated
	 * #viewer layers are loaded.
	 *
	 * @param {giscloud.Layer[]} loadedLayers
	 * Loaded layers that will be added to the list
	 */
	onLayersLoaded: function(loadedLayers) {
		this.addLayers(loadedLayers.reverse());
		this.unmask();
	},

	/**
	 * @private
	 * Creates a demo.gis.Layer, which acts as a
	 * wrapper around the giscloud.Layer object
	 *
	 * @param {giscloud.Layer} gisCloudLayer
	 * GIS Cloud layer that that will be wrapped
	 *
	 * @return {demo.gis.Layer}
	 * Wrapped layer object
	 */
	createSingleLayer: function(gisCloudLayer) {
		var cfg = $.extend({
				gisCloudLayer: gisCloudLayer,
				events: {
					// Because layer update doesn't automatically refresh
					// Leaflet map, the easiest (albeit very resource
					// intensive) way of updating the map is reloading it.
					change: this.reloadMap,
					remove: this.removeLayers,
					scope: this
				}
			}, this.layerCfg),

			layer = new demo.gis.Layer(cfg);

		layer.render(this.$list);
		return layer;
	},

	/**
	 * Reloads the currently loaded map.
	 */
	reloadMap: function() {
		this.viewer.reloadMap();
	},

	/**
	 * Adds layers to this list
	 *
	 * @param {giscloud.Layer|giscloud.Layer[]} layers
	 * Layers to be added to the list
	 *
	 * @return {demo.gis.Layer[]}
	 * Layers that are currently in the list
	 *
	 * @fires layersAdd
	 */
	addLayers: function(layers) {
		layers = demo.Util.normalizeArray(layers);

		layers = layers.map(this.createSingleLayer, this);
		this.layers = demo.Util.getUnique(this.layers.concat(layers));
		this.fireEvent('layersAdd', this, layers);

		return this.layers;
	},

	/**
	 * Removes the given layer(s) from the internal
	 * list of layers.
	 *
	 * @param {giscloud.Layer|giscloud.Layer[]} layers
	 * Layers to be removed from the list
	 *
	 * @fires layersRemove
	 */
	removeLayers: function(layers) {
		layers = demo.Util.normalizeArray(layers);

		var removedLayers = [];

		layers.forEach(function(layer) {
			var removeIndex = this.layers.indexOf(layer),
				layerExistsInList = removeIndex !== -1;

			if (layerExistsInList) {
				removedLayers.push(layer);
				this.layers.splice(removeIndex, 1);
			}
		}, this);

		this.fireEvent('layersRemove', this, removedLayers);
	}
});
