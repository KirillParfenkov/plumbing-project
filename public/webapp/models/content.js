define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Content = Backbone.Model.extend({
		urlRoot : 'api/contents'
	});

	return Content;
});