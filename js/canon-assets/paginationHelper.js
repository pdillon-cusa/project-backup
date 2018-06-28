/**
 * Helper class to handle pagination on a JSON array
 */
var PaginationHelper = (function(){

	var results = [];
	var totalPages = 1;
	var pageSize = 10;
	var options;

	/** 
	 * Initializes the pagination helper.
	 * @param {array}	res				The array of json objects to paginate
	 * @param {object}	optionsParam	An optional object with configuration parameters
	 */
	var initialize = function(res, optionsParam) {		
		results = res;

		options = optionsParam || {};
		pageSize = options.pageSize || 10;

		totalPages = Math.ceil(results.length / pageSize);
	};

	/**
	 * Gets the indicated page of results
	 * @param {number}	pageNr	The page number to retrieve
	 * @return {object}	A JSON object containing the requested results, and some information about the pagination and current page
	 */
	var getPage = function(pageNr) {

		if (pageNr < 1 || pageNr > totalPages) {
			return {};
		}

		var startIndex = (pageNr - 1) * pageSize;
		var endIndex = startIndex + pageSize;

		return {
			resultSet: results.slice(startIndex, endIndex),
			currentPage: pageNr,
			totalPages: totalPages,
			firstResult: startIndex + 1,
			lastResult: endIndex < results.length ? endIndex : results.length,
					totalResults: results.length		
		};		
	};

	return {
		initialize: initialize,
		getPage: getPage
	};

})();