define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'collections/geoobjects',
  'text!custom/templates/geoobject/view.html'
], function ($, _, Backbone, Events, Async, Geoobjects, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;
			$(view.el).html(_.template(contentTemplate));
		}
	});
	return ContentView;
});