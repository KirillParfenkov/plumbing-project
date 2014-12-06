define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/category',
  'text!custom/templates/categories/categoriesView.html',
], function ($, _, Backbone, Events, Async, Category, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		ui : {},
		template : contentTemplate,

		initialize : function( src ) {
			this.el = src.el;
		},

		render : function ( src, callback ) {
			console.log( 'el: ' + this.el );
			var view = this;
			var category = new Category({id : src.id});
			category.fetch({
				success : function( result ) {
					var categoryVar = result.toJSON();
					$(view.el).html(_.template(contentTemplate, { category : categoryVar}));
				},
				error : function( err ) {
					console.log( err );
					if ( callback ) callback( err );
				}
			});
		}
	});
	return ContentView;
});