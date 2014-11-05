define([
  'jquery',
  'underscore',
  'backbone',
  'models/category'
], function( $, _, Backbone, Category ) {
	 var Categories = Backbone.Collection.extend({
	 	models: Category,
	 	url : 'api/categories'
	 });
	 return Categories;
});