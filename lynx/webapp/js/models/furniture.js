define([
		'backbone'
], function( Backbone ) {

	var User = Backbone.Model.extend({
		urlRoot : '/api/furnitures'
	});

	return User;
});