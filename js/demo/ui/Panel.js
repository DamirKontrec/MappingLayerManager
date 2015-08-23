/**
 * @class demo.ui.Panel
 * @extends demo.ui.Component
 *
 * Class that represents a panel. A
 * panel can have a titlebar and a body.
 * Panel is also collapsible. A collapsed
 * panel has a hidden body, but a visible
 * titlebar.
 */
demo.ui.Panel = demo.ui.Component.extend({
	/**
	 * @cfg {String}
	 * CSS class taht will be given to the
	 * control when it's collapsed, and removed
	 * when it gets expanded
	 */
	collapsedClass: 'collapsed',

	/**
	 * @cfg {String}
	 * Title of this panel
	 */
	title: "Panel",

	/**
	 * @cfg {String}
	 * CSS class for the title of this component
	 */
	titlebarClass: 'titlebar',

	/**
	 * @cfg {String}
	 * CSS class for the HTML list containing the
	 * layers of this Layer manager
	 */
	bodyClass: 'body',

	/**
	 * @cfg {String}
	 * CSS class for collapse tool
	 */
	collapseToolClass: 'collapse-tool',

	/**
	 * @cfg {String}
	 * Tooltip for the collapse tool
	 */
	collapseTooltip: 'Collapse or expand this panel',

	/**
	 * @cfg {demo.ui.Template}
	 * Template for creating the panel's titlebar
	 */
	titlebarTemplate: new demo.ui.Template(
		'<div class="{titlebarClass}">',
			'<h3>{title}</h3>',
			'<div class={collapseToolClass} title="{collapseTooltip}"></div>',
		'</div>'
	),

	/**
	 * @cfg {demo.ui.Template}
	 * Template for creating the panel's body
	 */
	bodyTemplate: new demo.ui.Template(
		'<div class="{bodyClass}">',
		'</div>'
	),

	template: new demo.ui.Template(
		'<div class="{cssClass}">',
			'{titlebarHtml}',
			'{bodyHtml}',
		'</div>'
	),

	cssClass: 'panel',

	/**
	 * @property {jQuery node}
	 * UI of the panel's titlebar
	 */
	$titlebar: null,

	/**
	 * @property {jQuery node}
	 * UI of the panel's body
	 */
	$body: null,

	initComponent: function() {
		this.addEvents(
			/**
			 * @event show
			 * Fires when new this component
			 * gets collapsed
			 *
			 * @param {demo.ui.Component} this
			 * This component
			 */
			'collapse',

			/**
			 * @event show
			 * Fires when new this component
			 * gets expanded
			 *
			 * @param {demo.ui.Component} this
			 * This component
			 */
			'expand'
		);
	},

	render: function() {
		this.titlebarHtml = this.titlebarTemplate.render(this),
		this.bodyHtml = this.bodyTemplate.render(this);

		this._super();

		this.$titlebar = this.$html.children('.' + this.titlebarClass);
		this.$body = this.$html.children('.' + this.bodyClass);
		this.$toggleButton = this.$titlebar.children('.' + this.collapseToolClass);

		this.$toggleButton.on('click', this.toggleCollapsed.bind(this));
	},

	getMaskContainer: function() {
		return this.$body;
	},

	/**
	 * Collapses this component. Component
	 * must have proper CSS implemented for
	 * collapse to display properly. This
	 * CSS class is defined in #collapsedClass
	 * property
	 */
	collapse: function() {
		this.$html.addClass(this.collapsedClass);
		this.fireEvent('collapse', this);
	},

	/**
	 * Expands this component by removing
	 * #collapsedClass from this component
	 */
	expand: function() {
		this.$html.removeClass(this.collapsedClass);
		this.fireEvent('expand', this);
	},

	/**
	 * Checks if this panel is collapsed
	 */
	isCollapsed: function() {
		return this.$html.hasClass(this.collapsedClass);
	},

	/**
	 * Expands this panel if it is collapsed
	 * and vice-versa
	 */
	toggleCollapsed: function() {
		this.isCollapsed()
			? this.expand()
			: this.collapse();
	}
});
