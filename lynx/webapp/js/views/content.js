define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/user',
  'text!templates/layout.html' 
], function ($, _, Backbone, Events, Queue, User, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		render : function ( src, template, callback ) {
			var view = this;
			
		}
	});
	return ContentView;
});