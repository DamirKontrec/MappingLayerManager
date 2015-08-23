/**
 * Singleton providing utility methods
 */
demo.Util = {
	/**
	 * An immutable method that gets only
	 * unique records from the provided array
	 *
	 * @param {Object[]}
	 * An array that will be checked for duplicates
	 *
	 * @return {Object[]}
	 * A new array with removed duplicates
	 */
	getUnique: function(array) {
		var a = array.concat();

		for (var i = 0; i < a.length; ++i)
			for (var j = i + 1; j < a.length; ++j)
				if (a[i] === a[j])
					a.splice(j--, 1);

		return a;
	},

	/**
	 * Converts a given arguments object
	 * to an array.
	 *
	 * @param {Arguments} args
	 * An arguments object
	 *
	 * @return {Object[]}
	 * A converted array
	 */
	argsToArray: function(args) {
		return Array.prototype.slice.call(args);
	},

	/**
	 * Converts the given object to an
	 * array if not already. If it already
	 * is returns it immidiately
	 *
	 * @param {Object} obj
	 * An object to check if it is an array
	 *
	 * @return {Object[]}
	 * An array
	 */
	normalizeArray: function(obj) {
		if (!$.isArray(obj))
			obj = [obj];

		return obj;
	},

	/**
	 * Converts the given string into sentence case
	 *
	 * @param {String} string
	 * A string to convert to sentence case
	 *
	 * @return {String}
	 * String converted to sentence case
	 */
	stringToSentenceCase: function(string) {
		return string
			.split('')
			.map(function(letter, index) {
				return index === 0 ? letter.toUpperCase() : letter;
			})
			.join('');
	}
};
