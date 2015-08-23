/**
 * @class demo.ui.Component
 * @extends demo.Observable
 *
 * Class that represents a component
 * with graphical interface
 */
demo.ui.Component = demo.Observable.extend({
	/**
	 * @property {Boolean}
	 * Specifies that this class
	 * represents a component
	 */
	isComponent: true,

	/**
	 * @cfg {String} containerSelector
	 * A jQuery selector string for getting
	 * the container element.
	 *
	 * If specified, and if the DOM element
	 * fitting the selector exists at the
	 * time of this component's creation,
	 * this component will automatically
	 * be rendered into that container
	 */
	containerSelector: '',

	/**
	 * @cfg {String}
	 * CSS class for this component
	 */
	cssClass: '',

	/**
	 * @cfg {demo.ui.Template}
	 * Template representing the body of this component
	 */
	template: new demo.ui.Template(
		'<div class="{cssClass}">',
		'</div>'
	),

	/**
	 * @cfg {demo.ui.Template}
	 * Template for masking element that will be
	 * overlaid on top of the element while it is
	 * masked
	 */
	maskTemplate: new demo.ui.Template(
		'<div class={cssClass}>',
		'<div class={messageClass}>',
		'<p>{message}</p>',
		'<div>',
		'<div>'
	),

	/**
	 * @cfg {String}
	 * CSS class for this component's mask
	 */
	maskClass: 'mask',

	/**
	 * @cfg {String}
	 * CSS class for this component's mask message
	 */
	maskMessageClass: 'message',

	/**
	 * @cfg {String}
	 * A message to be shown while this
	 * component is masked
	 */
	defaultMaskMessage: 'Loading...',

	/**
	 * @property {jQuery node}
	 * This component's container
	 */
	$container: null,

	/**
	 * @property {jQuery node}
	 * This component's jQuery node
	 */
	$html: null,

	/**
	 * @property {Boolean}
	 * Identifies whether this component
	 * exists in DOM or not
	 */
	rendered: false,

	/**
	 * @property {jQuery node}
	 * Mask that gets overlaid on top of
	 * this element while masked
	 */
	$mask: null,

	init: function(cfg) {
		this._super(cfg);
		this.initComponent();
	},

	/**
	 * Initializes this component.
	 */
	initComponent: function() {
		this.addEvents(
			/**
			 * @event show
			 * Fires when new this component
			 * gets shown
			 *
			 * @param {demo.ui.Component} this
			 * This component
			 */
			'show',

			/**
			 * @event hide
			 * Fires when new this component
			 * gets hidden
			 *
			 * @param {demo.ui.Component} this
			 * This component
			 */
			'hide',

			/**
			 * @event render
			 * Fires when new this component
			 * gets rendered
			 *
			 * @param {demo.ui.Component} this
			 * This component
			 *
			 * @param {jQuery node} $html
			 * This component's HTML
			 *
			 * @param {jQuery node} $container
			 * This component's container
			 */
			'render'
		);
	},

	/**
	 * Creates the component's HTML and inserts
	 * it into  specified $container, if specified
	 *
	 * @param {jQuery node} $container
	 * A container to append this component into
	 *
	 * @return {jQuery node}
	 * A jQuery node that represents this component
	 */
	render: function($container) {
		$container = !!$container
						? $container
						: !!this.containerSelector
							? $(this.containerSelector)
							: null;

		var html = this.template.render(this),
			containerExists = !!$container && $container.length > 0;

		this.$html = $(html)
		this.$html.addClass(this.cssClass);

		if (containerExists) {
			this.insertInto($container);
			this.fireEvent('render', this, this.$html, $container);
		}
	},

	/**
	 * Inserts this component into given container
	 *
	 * @param {jQuery node} $container
	 * A container to append this component into
	 *
	 * @return {jQuery node}
	 * A jQuery node that represents this component
	 */
	insertInto: function($container) {
		this.$container = $container;
		this.$container.append(this.$html);
		this.rendered = true

		return this.$html;
	},

	/**
	 * Shows this component
	 */
	show: function() {
		this.$html.show();
		this.fireEvent('show', this);
	},

	/**
	 * Hides this component
	 */
	hide: function() {
		this.$html.hide();
		this.fireEvent('hide', this);
	},

	/**
	 * Shows mask on top of this component
	 *
	 * @param {String} message
	 * A message to be shown on mask
	 */
	mask: function(message) {
		var maskExists = !!this.$mask;

		message = message || this.defaultMaskMessage;

		maskExists
			? this.setMaskMessage(message) : this.createMask(message);


		this.$mask.show();
	},

	/**
	 * Hides this component's mask
	 */
	unmask: function() {
		this.$mask.hide();
	},

	/**
	 * @private
	 * Gets the part of component that will be
	 * covered by mask
	 *
	 * @return {jQuery node}
	 * Container for the mask
	 */
	getMaskContainer: function() {
		return this.$html;
	},

	/**
	 * @private
	 * Creates this component's mask
	 *
	 * @param {String} message
	 * A message to be shown on mask
	 */
	createMask: function(message) {
		var $maskContainer = this.getMaskContainer(),
			supportedPositioningContexts = ['absolute', 'relative', 'fixed'],
			currentPositioning = $maskContainer.css('position'),
			shouldAddCustomPositioning = supportedPositioningContexts.indexOf(
				currentPositioning) === -1;

		if (shouldAddCustomPositioning)
			$maskContainer.css({
				position: 'relative'
			});

		var maskHtml = this.maskTemplate.render({
			cssClass: this.maskClass,
			messageClass: this.maskMessageClass,
			message: message || ''
		});

		this.$mask = $(maskHtml);

		this.$mask
			.hide()
			.appendTo($maskContainer);

		return this.$mask;
	},

	/**
	 * @private
	 * Sets this component's mask message
	 *
	 * @param {String} message
	 * A message to be shown on mask
	 */
	setMaskMessage: function(message) {
		this.$mask
			.find('.' + this.maskMessageClass)
			.html(message || '');
	}
});
