define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Geoobject = Backbone.Model.extend({
		urlRoot : '/api/geoObjects'
	});
	return Geoobject;
});