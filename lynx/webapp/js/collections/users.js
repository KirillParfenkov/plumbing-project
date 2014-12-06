define([
  'jquery',
  'underscore',
  'backbone',
  'models/user'
], function( $, _, Backbone, User ) {
	 var Users = Backbone.Collection.extend({
	 	models: User,
	 	url : '/api/users'
	 });
	 return Users;
});