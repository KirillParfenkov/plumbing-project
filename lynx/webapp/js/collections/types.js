define([
  'jquery',
  'underscore',
  'backbone',
  'models/type'
], function( $, _, Backbone, Type ) {
	 var Types = Backbone.Collection.extend({
	 	models: Type,
	 	url : '/api/types'
	 });
	 return Types;
});