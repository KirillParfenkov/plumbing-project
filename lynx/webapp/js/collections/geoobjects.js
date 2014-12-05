define([
  'jquery',
  'underscore',
  'backbone',
  'models/geoobject'
], function( $, _, Backbone, Geoobject ) {
	 var Geoobjects = Backbone.Collection.extend({
	 	models: Geoobject,
	 	url : '/api/geoObjects'
	 });
	 return Geoobjects;
});