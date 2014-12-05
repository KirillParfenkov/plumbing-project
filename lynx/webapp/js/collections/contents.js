define([
  'jquery',
  'underscore',
  'backbone',
  'models/content'
], function( $, _, Backbone, Content ) {
	 var Contents = Backbone.Collection.extend({
	 	models: Content,
	 	url : '/services/contents'
	 });
	 return Contents;
});