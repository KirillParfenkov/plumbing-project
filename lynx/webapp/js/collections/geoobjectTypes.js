define([
  'jquery',
  'underscore',
  'backbone',
  'models/geoobjectType'
], function( $, _, Backbone, GeoobjectType ) {
	 var GeoobjectTypes = Backbone.Collection.extend({
	 	models: GeoobjectType,
	 	url : '/api/geoObjectTypes'
	 });
	 return GeoobjectTypes;
});