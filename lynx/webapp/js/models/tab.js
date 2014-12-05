define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Tab = Backbone.Model.extend({
		urlRoot : '/api/tabs'
	});
	return Tab;
});