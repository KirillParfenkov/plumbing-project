define([
		'backbone'
], function( Backbone ) {

	var Picture = Backbone.Model.extend({
		urlRoot : '/api/files',
	});

	return Picture;
});