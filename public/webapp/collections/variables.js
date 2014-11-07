define([
  'jquery',
  'underscore',
  'backbone',
  'models/content'
], function( $, _, Backbone, Content ) {
	 var Variables = Backbone.Collection.extend({
	 	models: Content,
	 	url : 'api/variables.js'
	 });
	 return Variables;
});