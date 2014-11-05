define([
  'jquery',
  'underscore',
  'backbone',
  'models/furniture'
], function( $, _, Backbone, Furniture ) {
	 var Furnitures = Backbone.Collection.extend({
	 	models: Furniture,
	 	url : 'api/furnitures'
	 });
	 return Furnitures;
});