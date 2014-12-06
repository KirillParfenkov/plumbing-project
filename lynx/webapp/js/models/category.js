define([
		'backbone'
], function( Backbone ) {

	var Category = Backbone.Model.extend({
		urlRoot : '/api/categories',

	});

	return Category;
});