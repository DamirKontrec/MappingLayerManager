/**
 * @class demo.Observable
 * @extends demo.Base
 *
 * Represents an observable class. An
 * observable can fire events that other
 * classes cand bind functions to.
 *
 * This specific implementation was
 * adapted from minievents exmaple
 * and modified to fit the demo library.
 *
 * Minievents example is published under
 * MIT license, and can be found at:
 * https://github.com/allouis/minivents
 */
demo.Observable = demo.Base.extend({
	/**
	 * @property {Boolean}
	 * Specifies that this class
	 * represents an observable
	 */
	isObservable: true,

	/**
	 * @cfg {Object} events
	 * Configuration for this class' components.
	 * An initial set of event listeners can be
	 * defined here, as well as the scope for those
	 * listeners (which is optional, and if left
	 * undefined will default to global object).
 	 *
	 * An example configuration:
	 *
	 *		new demo.Observable({
	 *			events: {
	 *				change: this.onItemChange,
	 * 				someOtherChange: this.onItemSomeOtherChange,
	 *				scope: this
	 * 			}
	 *		});
	 */
	events: {},

	/**
	 * @private
	 * @property {Object} events
	 * An internal representation of listeners
	 * bound to this class' events.
	 */

	init: function(cfg) {
		this._super(cfg);
		this.normalizeEvents();
	},

	/**
	 * @private
	 * Converts the simplified events configuration
	 * (if the user provided it) into full internal
	 * representation of events.
	 */
	normalizeEvents: function() {
		var self = this,
			scope = this.events.scope || window,
			eventsCfg = $.extend({}, this.events),
			hasUserConfiguredEvents = !$.isEmptyObject(this.events);

		this.events = {};

		if (!hasUserConfiguredEvents) return;

		$.each(eventsCfg, function(eventType, fn) {
			if (eventType !== 'scope')
				self.events[eventType] = [{
					fn: fn,
					scope: scope
				}];
		});
	},

	/**
	 * Defines events that this class provides.
	 * This method should be called in an init method
	 * of an observable subclass, to define available
	 * events.
	 *
	 * @param {String, String...} eventTypes
	 * Arbitrary event types that this class provides
	 */
	addEvents: function() {
		var eventTypes = demo.Util.argsToArray(arguments);

		eventTypes.forEach(function(eventType) {
			this.events[eventType] = this.events[eventType] || [];
		}, this);
	},

	/**
	 * Starts listening for a
	 * specific type of events
	 *
	 * @param {String} type
	 * An arbitrary type of an event
	 * to start listening for
	 *
	 * @param {Function} fn
	 * A function that will be run
	 * when an event of specified
	 * type is fired.
	 *
	 * @param {Object} scope (optional)
	 * A scope that the given function
	 * will run in when fired. In not
	 * specified, will default to window.
	 */
	on: function(type, fn, scope) {
		var eventType = this.events[type] = this.events[type] || [];

		eventType.push({
			fn: fn,
			scope: scope
		});
	},

	/**
	 * Stops executing a specific function
	 * after a certain event is fired. If only
	 * the type argument was specified, all
	 * the functions bound to the given event
	 * type will be removed from the event list
	 *
	 * @param {String} type
	 * Type of an event to search the given
	 * function in
	 *
	 * @param {Function} fn (optional)
	 * A specific function to stop executing
	 * after a given type of event is fired.
	 * If this argument is not specified, all
	 * the functions bound to the given event
	 * type will be removed from the event list
	 *
	 * @return {Boolean}
	 * Whether the given function was found in
	 * and removed from the event type list
	 */
	off: function(type, fn) {
		var eventTypeBindings = this.events[type] || [],
			shouldRemoveAll = !fn;

		if (shouldRemoveAll)
			return this.removeAllEvents(type);

		return eventTypeBindings.some(function(currentBinding, index) {
			var shouldRemove = fn === currentBinding.fn;
			if (shouldRemove) eventTypeBindings.splice(index, 1);
			return shouldRemove;
		});
	},

	/**
	 * Stop executing all the functions
	 * bound to the given event type.
	 *
	 * @param {String} type
	 * An event type to remove
	 *
	 * @return {Boolean}
	 * Were there any functions that were
	 * bound to the given event type
	 */
	removeAllEvents: function(type) {
		var eventTypeBindings = this.events[type] || [],
			wereAnyRemoved = eventTypeBindings.length > 0;

		this.events[type] = [];

		return wereAnyRemoved;
	},

	/**
	 * Fires the given event with custom
	 * arguments
	 *
	 * @param {String} type
	 * Type of an event to fire
	 *
	 * @param {Object ...} args
	 * An arbitrary number of arguments to
	 * send to functions bound to this type
	 * of an event.
	 *
	 * @return {Boolean}
	 * If any of the functions bound to the
	 * given type of an event returns false,
	 * the result of this function will be
	 * false. Useful for checking if any
	 * of the functions that were fired by
	 * an event should prevent some code
	 * in this observable from executing
	 */
	fireEvent: function(type) {
		var args = demo.Util.argsToArray(arguments).slice(1)
		eventType = this.events[type] || [],
			result = true;

		eventType.forEach(function(currentBinding) {
			var fnResult = currentBinding.fn.apply(currentBinding.scope, args);
			result = result && fnResult !== false;
		});

		return result;
	}
});
