define([
  'jquery',
  'underscore',
  'backbone',
  'models/content'
], function( $, _, Backbone, Content ) {
	 var Contents = Backbone.Collection.extend({
	 	models: Content,
	 	url : 'api/contents'
	 });
	 return Contents;
});