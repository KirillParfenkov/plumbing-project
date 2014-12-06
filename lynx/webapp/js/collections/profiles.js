define([
  'jquery',
  'underscore',
  'backbone',
  'models/profile'
], function( $, _, Backbone, Profile ) {
	 var Profiles = Backbone.Collection.extend({
	 	models: Profile,
	 	url : '/system/profiles'
	 });
	 return Profiles;
});