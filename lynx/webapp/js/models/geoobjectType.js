define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var geoobjectType = Backbone.Model.extend({
		urlRoot : '/api/geoObjectTypes'
	});
	return geoobjectType;
});