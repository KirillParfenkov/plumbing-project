define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Variable = Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot : '/services/variables'
	});
	return Variable;
});