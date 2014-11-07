define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Variable = Backbone.Model.extend({
		urlRoot : 'api/variables'
	});

	return Variable;
});