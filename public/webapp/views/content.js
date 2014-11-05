define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/content.html' 
], function ($, _, Backbone, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.contentContainer',
		template : contentTemplate,
		render : function ( src, callback ) {
			console.log('content');
			var view = this;
			$(this.el).html(_.template(contentTemplate, { categories: src.categories }));
		}
	});
	return ContentView;
});