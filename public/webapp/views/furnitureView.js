define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'models/category',
  'models/furniture',
  'text!templates/furnitureView.html',
], function ($, _, Backbone, async, Category, Furniture, contentTemplate ) {
	var ContentView = Backbone.View.extend({
		el : '.contentContainer',
		template : contentTemplate,
		render : function( src, callback ) {
			var view = this;
			var furniture = new Furniture({id : src.id});
			furniture.url = '/furnituresWithImages/' + src.id;
			furniture.fetch({
				success : function( result ) {
					var furnitureVar = result.toJSON();
					$(view.el).html(_.template( view.template, { furniture : furnitureVar }));
					if ( furnitureVar.images && (furnitureVar.images.length > 0)) {
						$('.furniture-slider').unslick();
						$('.furniture-slider').slick({
							dots : true,
							speed : 500,
							slidesToScroll: 1,
						});
					}
					if ( callback ) callback();
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