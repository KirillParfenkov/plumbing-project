define([
  'jquery',
  'underscore',
  'backbone',
  'models/picture'
], function( $, _, Backbone, Picture ) {
	 var Pictures = Backbone.Collection.extend({
	 	models: Picture,
	 	url : 'api/files'
	 });
	 return Pictures;
});