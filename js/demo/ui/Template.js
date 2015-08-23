/**
 * @class demo.ui.Template
 * @extends demo.Base
 *
 * A simple templating engine without
 * logic. Placeholder values are defined
 * inside curly braces, eg. {someValue}
 */
demo.ui.Template = demo.Base.extend({
	/**
	 * @cfg {String}
	 * The empty value which will be
	 * used when modifying the underlying
	 * template
	 */
	emptyValue: '',

	/**
	 * @cfg {RegExp}
	 * Regular expression that will be used
	 * to find placeholders inside the provided
	 * template string
	 */
	regex: /\{(.*?)\}/g,

	/**
	 * @cfg {RegExp}
	 * Regular expression that will be used
	 * to find remove curly braces inside the
	 * matched placeholders in order to get
	 * the property whose value should be
	 * substituted over the placeholder in the
	 * rendered template
	 */
	stripRegex: /\{|\}/g,

	/**
	 * @property {String}
	 * Internal representation of the template
	 */
	template: '',

	/**
	 * Receives strings as arguments and an optional
	 * configuration that is used to overwrite the
	 * class defaults with instance overrides
	 *
	 * @param {String} (required)
	 * Multiple params that define eg. the lines of
	 * template
	 *
	 * @param {Object} [cfg]
	 * An optional configuration that will overwrite
	 * instance's defaults.
	 */
	init: function() {
		var args = demo.Util.argsToArray(arguments),
			lastArgument = args[args.length - 1],
			isLastArgumentCfg = $.isPlainObject(lastArgument),
			cfg = isLastArgumentCfg ? lastArgument : {},
			template;

		if (args.length === 0)
			template = this.emptyValue;

		else if (args.length === 1)
			template = isLastArgumentCfg ? this.emptyValue : args[0];

		else {
			var templateParts = isLastArgumentCfg ? args.slice(0, -1) : args;
			template = templateParts.join('\n');
		}

		this.template = template;
	},

	/**
	 * Renders this template with provided values and
	 * returns the rendered HTML string.
	 *
	 * @param {Object} values
	 * An object containing the values that will sustitute
	 * placeholders inside the template. Property name inside
	 * this object should match the placeholder string (inside
	 * the curly braces) which it will replace.
	 *
	 * @return {String}
	 * Rendered HTML string with placeholders replaced by
	 * actual passed values.
	 */
	render: function(values) {
		var placeholders = this.template.match(this.regex),
			rendered = this.template;

		placeholders.forEach(function(placeholder) {
			var property = placeholder.replace(this.stripRegex, this.emptyValue),
				placeholderRegex = new RegExp(placeholder, 'g'),
				value = values[property];

			if (value === null || value === undefined)
				value = this.emptyValue;

			rendered = rendered.replace(placeholderRegex, value);
		}, this);

		return rendered;
	}
});
