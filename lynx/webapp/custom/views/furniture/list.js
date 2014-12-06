define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/furniture',
  'collections/furnitures',
  'text!custom/templates/furniture/furnitureList.html',
], function ($, _, Backbone, Events, Queue, Furniture, Furnitures, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		furnitures : null,
		events : {
			'click .deleteFurnitureLink' : 'deleteFurniture'
		},
		
		render : function ( src, callback ) {
			var view = this;
			view.furnitures = new Furnitures();
			var furnitures = view.furnitures;

			var queue = new Queue([
				function(queue) {
					furnitures.fetch({
						success : function () {
							queue.next();
						},
						error : function () {
							queue.next();
						}
					});
				},
				function(queue) {
					$(view.el).html(_.template(contentTemplate, { furnitures: furnitures.toJSON()}));
				}
			]);
			queue.start();
		},

		deleteFurniture : function( e ) {
			var view = this;
			e.preventDefault();
			if ( confirm("Are you sure?") ) {
				var furnitureId = $( e.target ).attr('furnitureId');
				var furniture = view.furnitures.get( furnitureId );
				furniture.destroy({
					success : function( model, response ) {
						//location.reload();
						view.render();
					},
					error : function( err ) {
						console.log(err);
					}
				});
			}
		}

	});
	return ContentView;
});