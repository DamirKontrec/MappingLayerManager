/**
 * @class demo.gis.Layer
 * @extends demo.ui.Component
 *
 * A control that represents a single layer
 * and exposes its controls (opacity, visibility, etc.)
 */
demo.gis.Layer = demo.ui.Component.extend({
	/**
	 * @cfg {giscloud.Layer} (required)
	 * An original CIS Cloud layer that this class
	 * will wrap
	 */
	gisCloudLayer: null,

	/**
	 * @cfg {Number}
	 * Increments in which the opacity can
	 * be modified.
	 */
	step: 1,

	/**
	 * @cfg {Number}
	 * Minimum opacity value for this layer.
	 */
	minOpacity: 0,

	/**
	 * @cfg {Number}
	 * Maximum opacity value for this layer.
	 */
	maxOpacity: 100,

	/**
	 * @cfg {String}
	 * CSS class for layer name text
	 */
	nameClass: 'layer-name',

	/**
	 * @cfg {String}
	 * CSS class for the opacity slider
	 */
	opacityControlClass: 'opacity-slider',

	/**
	 * @cfg {String}
	 * CSS class for the visibility checkbox
	 */
	visibilityControlClass: 'visibility-checkbox',

	/**
	 * @cfg {String}
	 * CSS class for the remove layer button
	 */
	removeControlClass: 'remove-button',

	/**
	 * @cfg {String}
	 * CSS class for the layer type icon
	 */
	layerTypeControlClass: 'type-icon',

	/**
	 * @cfg {String}
	 * Tooltip assigned to the visibility checkbox
	 */
	visibilityControlTooltip: 'Show or hide the layer',

	/**
	 * @cfg {String}
	 * Tooltip assigned to the remove button checkbox
	 */
	removeControlTooltip: 'Remove layer from the map',

	/**
	 * @cfg {String}
	 * Message that will be shown while saving layer
	 * changes to the GIS Cloud service
	 */
	savingMessage: 'Updating...',

	/**
	 * @cfg {String}
	 * Message that will be shown while removing
	 * layer on the GIS Cloud service
	 */
	removingLayerMessage: 'Removing...',

	/**
	 * @cfg {Boolean}
	 * Will the mask be hidden while making request
	 * to the GIS Cloud service
	 */
	preventMaskOnRequest: false,

	/**
	 * @cfg {Boolean}
	 * Will the layer visibility control be hidden
	 */
	hideVisibilityControl: false,

	/**
	 * @cfg {Boolean}
	 * Will the layer type indicator (icon) be hidden
	 */
	hideLayerTypeControl: false,

	/**
	 * @cfg {Boolean}
	 * Will the layer opacity control be hidden
	 */
	hideOpacityControl: false,

	/**
	 * @cfg {Boolean}
	 * Will the layer remove control be hidden
	 */
	hideRemoveControl: false,

	cssClass: 'layer',

	template: new demo.ui.Template(
		'<li class="{cssClass}">',
		'<input class="{visibilityControlClass}" type="checkbox" checked="{visibility}" title="{visibilityControlTooltip}"></input>',
		'<div class="{layerTypeControlClass} {type}" title="This is a {type} layer"></div>',
		'<p class="{nameClass}" title="{name}">{name}</p>',
		'<input class="{opacityControlClass}" type="range" step="{step}" min="{minOpacity}" max="{maxOpacity}" value="{opacity}"></input>',
		'<div class="{removeControlClass}" title="{removeButtonTooltip}"></div>',
		'</li>'
	),

	/**
	 * @property {String}
	 * ID of this layer. Automatically
	 * created from #giscloudLayer
	 */
	id: null,

	/**
	 * @property {String}
	 * Name of the layer that will be
	 * shown next to it's controls
	 */
	name: null,

	/**
	 * @property {String}
	 * Type of the layer - whether it is
	 * a point, polygon, tile or other
	 * type of layer.
	 */
	type: null,

	/**
	 * @property {Number}
	 * Current opacity of the layer
	 */
	opacity: 0,

	/**
	 * @property {Boolean}
	 * Is the layer currently visible
	 */
	visibility: false,

	/**
	 * @property {jQuery node}
	 * jQuery node representing opacity
	 * slider for this layer
	 */
	$opacityControl: null,

	/**
	 * @property {jQuery node}
	 * jQuery node representing visibility
	 * checkbox for this layer
	 */
	$visibilityControl: null,

	/**
	 * @property {jQuery node}
	 * jQuery node representing remove
	 * button for this layer
	 */
	$removeControl: null,

	/**
	 * @property {jQuery node}
	 * jQuery node representing layer type
	 * icon for this layer
	 */
	$layerTypeControl: null,

	/**
	 * @private
	 * @property {String[]}
	 * List of control names
	 */
	controlNames: [
		'opacity',
		'visibility',
		'remove',
		'layerType'
	],

	initComponent: function() {
		$.extend(this, {
			id: this.gisCloudLayer.id,
			name: this.gisCloudLayer.name,
			type: this.gisCloudLayer.type,
			opacity: parseInt(this.gisCloudLayer.alpha, 10),
			visibility: this.gisCloudLayer.visible === 't'
		});

		this._super();

		this.addEvents(
			/**
			 * @event change
			 * Generic change event fired every time
			 * the change has been made on the GIS
			 * Cloud service
			 *
			 * @param {demo.gis.Layer} this
			 * A layer that was changed
			 *
			 * @param {string} action
			 * Type of change that occured
			 */
			'change',

			/**
			 * @event opacityChange
			 * Fired when this layer's opacity is
			 * changed.
			 *
			 * @param {demo.gis.Layer} this
			 * A layer whose opacity was changed
			 *
			 * @param {Number} opacity
			 * New layer opacity
			 */
			'opacityChange',

			/**
			 * @event visibilityChange
			 * Fired when this layer's visibility is
			 * changed.
			 *
			 * @param {demo.gis.Layer} this
			 * A layer whose visibility was changed
			 *
			 * @param {Boolean} visibility
			 * New layer visibility
			 */
			'visibilityChange',

			/**
			 * @event remove
			 * Fired when this item is removed, that is,
			 * when the user clicks the remove button.
			 *
			 * @param {demo.gis.Layer} this
			 * A layer that was removed.
			 */
			'remove'
		);
	},

	render: function($container) {
		this._super($container);
		this.createControlReferences();
		this.bindElementListeners();

		// Dirty fix for the visibilityCheckbox's checked
		// attribute bug caused by incosistent DOM behavior
		this.$visibilityControl.prop('checked', this.visibility);
	},

	/**
	 * @private
	 * Creates references to controls in this layer,
	 * and hides them if needed
	 */
	createControlReferences: function() {
		this.controlNames.forEach(function(controlName) {
			var property = '$' + controlName + 'Control',
				classProperty = controlName + 'ControlClass',
				className = this[classProperty],
				sentenceCaseControlName = demo.Util.stringToSentenceCase(controlName),
				hideProperty = 'hide' + sentenceCaseControlName + 'Control',
				shouldHide = !!this[hideProperty],
				control = this[property] = this.$html.children('.' + className);

			if (shouldHide) control.hide();
		}, this);
	},

	/**
	 * @private
	 * Binds listeners to this layer's
	 * checkbox, slider and remove button
	 */
	bindElementListeners: function() {
		this.$removeControl.on('click', this.remove.bind(this));
		this.$opacityControl.on('change', this.onOpacityControlChange.bind(this));
		this.$visibilityControl.on('click', this.onVisibilityControlChange.bind(
			this));
	},

	/**
	 * Begins a request to the GIS Cloud service.
	 *
	 * @param {String} action
	 * What kind of action is requested on GIS cloud
	 * service. Posibble values are, for example
	 * update, remove...
	 *
	 * @param {Object} [cfg]
	 * Additional configuration for the request
	 *
	 * @param {Boolean} cfg.hideMask
	 * Should hide mask while the request is pending
	 *
	 * @param {String} cfg.maskMessage
	 * Message to be shown while request is pending
	 *
	 * @param {Function} cfg.success
	 * Success callback
	 *
	 * @param {Function} cfg.failure
	 * Failure callback
	 *
	 * @param {Object[]} cfg.successParams
	 * Arguments for success callback
	 *
	 * @param {Object[]} cfg.failureParams
	 * Arguments for failure callback
	 *
	 * @param {Object} [cfg.scope=this]
	 * Scope for callbacks
	 */
	request: function(action, cfg) {
		var defaults = {
			hideMask: this.preventMaskOnRequest,
			maskMessage: this.savingMessage,
			success: function() {},
			failure: function() {},
			successParams: [],
			failureParams: [],
			scope: this
		};

		cfg = $.extend({}, defaults, cfg);

		var successCallback = cfg.success.bind(cfg.scope, cfg.successParams),
			failureCallback = cfg.failure.bind(cfg.scope, cfg.failureParams),
			fireGenericChangeEventCallback = this.fireEvent.bind(this, 'change', this,
				action),
			unmask = this.unmask.bind(this);

		if (!cfg.hideMask)
			this.mask(cfg.maskMessage);

		this.gisCloudLayer[action]()
			.done(successCallback, fireGenericChangeEventCallback)
			.fail(failureCallback)
			.always(unmask);
	},

	/**
	 * Sets whether the layer is visible on map or not
	 *
	 * @param {Boolean} visibility
	 * Should the layer be shown or hidden
	 *
	 * @param {Boolean} silent (optional)
	 * Will the change be propagated to
	 * map and GIS Cloud service
	 */
	setVisibility: function(visibility, silent) {
		var oldVisibility = this.visibility;

		this.gisCloudLayer.visible = visibility ? 't' : 'f';
		this.$visibilityControl.attr('checked', visibility);
		this.visibility = visibility;

		if (silent) return;

		var onSetVisibilitySuccess = this.fireEvent.bind(this, 'visibilityChange',
				this, visibility),
			onSetVisibilityFailure = this.setVisibility.bind(this, oldVisibility,
				true);

		this.request('update', {
			success: onSetVisibilitySuccess,
			failure: onSetVisibilityFailure
		});
	},

	/**
	 * Checks whether the layer is visible or not
	 *
	 * @return {Boolean}
	 * Is the layer visible
	 */
	getVisibility: function() {
		return this.$visibilityControl.attr('checked');
	},

	/**
	 * Sets the layer opacity
	 *
	 * @param {Number} opacity
	 * New layer opacity. Provided value should
	 * be between 0 and 1
	 *
	 * @param {Boolean} silent (optional)
	 * Will the change be propagated to
	 * map and GIS Cloud service
	 */
	setOpacity: function(opacity, silent) {
		var oldOpacity = this.opacity;

		opacity = opacity > this.maxOpacity ? this.maxOpacity : opacity < this.minOpacity ?
			this.minOpacity : parseInt(opacity, 10);

		this.gisCloudLayer.alpha = opacity + '';
		this.$opacityControl.val(opacity);
		this.opacity = opacity;

		if (silent) return;

		var onSetOpacitySuccess = this.fireEvent.bind(this, 'opacityChange', this,
				opacity),
			onSetOpacityFailure = this.setOpacity.bind(this, oldOpacity, true);

		this.request('update', {
			success: onSetOpacitySuccess,
			failure: onSetOpacityFailure
		});
	},

	/**
	 * Gets the layer opacity
	 *
	 * @return {Number} opacity
	 * Layer's opacity
	 */
	getOpacity: function() {
		var stringValue = this.$opacityControl.attr('value'),
			numberValue = parseFloat(stringValue);

		return numberValue;
	},

	/**
	 * Removes the layer from map and list
	 */
	remove: function() {
		this.request('remove', {
			success: this.onRemoveSuccess,
			maskMessage: this.removingLayerMessage
		});
	},

	/**
	 * @private
	 * Gets run when the layer is successfuly
	 * removed from the GIS Cloud service
	 *
	 * @fires remove
	 */
	onRemoveSuccess: function() {
		this.$html.remove();
		this.fireEvent('remove', this);
	},

	/**
	 * @private
	 * Triggered when the opacity slider
	 * has been manipulated.
	 */
	onOpacityControlChange: function() {
		var newValue = this.$opacityControl.val();
		this.setOpacity(newValue);
	},

	/**
	 * @private
	 * Triggered when the visibility checkbox
	 * has been manipulated.
	 */
	onVisibilityControlChange: function() {
		var newValue = this.$visibilityControl.is(':checked');
		this.setVisibility(newValue);
	}
});
