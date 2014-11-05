define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'models/category',
  'collections/categories',
  'text!templates/submenu.html',
  'collections/furnitures'
], function ($, _, Backbone, async, Category, Categories, contentTemplate, Furnitures ) {
	var ContentView = Backbone.View.extend({
		el : '.sabmenuContainer',
		template : contentTemplate,
		hierarchy : null,

		render : function ( src, callback ) {
			var view = this;
			var hierarchy = [];
			var categoryId = src.categoryId;

			var categoriesVar;

			async.waterfall([
				function( next ) {
					var categories = new Categories();
					categories.fetch({
						success : function( result ) {
							next( null, result.toJSON() );
						},
						error : function( err ) {
							next( err );
						}
					});

				},
				function( categoriesVar, next ) {
					var categoryTreeMap = {};
					var firstLavel = [];

					for( var i = 0; i < categoriesVar.length; i++  ) {
						categoryTreeMap[ categoriesVar[i].id ] = {
							id: categoriesVar[i].id,
							label : categoriesVar[i].name,
							parentId : categoriesVar[i].parentId,
							data : []
						};
					}

					for( var i = 0; i < categoriesVar.length; i++  ) {
						if ( categoriesVar[i].parentId ) {
							categoryTreeMap[ categoriesVar[i].parentId ].data.push( categoryTreeMap[categoriesVar[i].id] );
						} else {
							firstLavel.push( categoryTreeMap[categoriesVar[i].id] );
						}
					}

					if ( categoryId ) {
						if ( categoryTreeMap[categoryId].data ) {
						hierarchy.push( categoryTreeMap[categoryId].data );
						}

						var parentId = categoryTreeMap[categoryId].parentId;
						while ( parentId ) {
							var currentNode = categoryTreeMap[parentId];
							if ( currentNode.data && currentNode.data.length > 0) {
								hierarchy.push( currentNode.data );
							}
							parentId = currentNode.parentId;
						}
					}

					hierarchy.push( firstLavel );
					hierarchy.reverse();

				    var itemCount = 0;
		        	for( var i = 0; i < hierarchy.length; i++) {
		          		if ( itemCount < hierarchy[i].length ) {
		            		itemCount = hierarchy[i].length;
		          		}
		        	}

				    view.renderSubmenuContainer( itemCount, 19, 5,  function() {
		          		$(view.el).html(_.template(contentTemplate, { hierarchy: hierarchy }));
		          		if ( callback ) {
							callback();
							next( null );
						}
		        	});
				}
			], function() {

			});
		},

		renderSubmenuContainer : function( itemCount, itemSize, padding, callbak ) {  
      		$('.sabmenuContainer').addClass('active');
      		$('.sabmenuContainer').animate({ height: (itemCount * itemSize + padding) }, 500, "linear", callbak);
    	},

    	hideSubmenuContainer : function( callbak ) {
      		$('.sabmenuContainer').removeClass('active');
      		$('.sabmenuContainer').animate( { height: 0 }, 100, "linear", callbak );
    	}
	});
	return ContentView;
});