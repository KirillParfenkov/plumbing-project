define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'text!custom/templates/home.html' 
], function ($, _, Backbone, Events, Queue, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;
			$(this.el).html(_.template(contentTemplate));
		}
	});
	return ContentView;
});