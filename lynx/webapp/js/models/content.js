define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Content = Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot : '/services/contents'
	});
	return Content;
});