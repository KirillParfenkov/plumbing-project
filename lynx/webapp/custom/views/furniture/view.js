define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'events',
  'libs/queue/queue',
  'models/furniture',
  'models/file',
  'custom/views/file/view',
  'custom/views/file/edit',
  'text!custom/templates/furniture/furnitureView.html' 
], function ($, _, Backbone, async, Events, Queue, Furniture, Picture, FileView, FileEdit, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		furniture : null,
		pictureViews : {},
		pictureEdits : {},
		events : {
			'click .furnitureAddImage' : 'saveImage'
		},
		render : function ( src, callback ) {
			var view = this;

			if ( src.id != -1 ) {
				view.furniture = new Furniture( {id: src.id} );
				view.furniture.fetch({
					success : function( result ) {
						view.furniture = result;
						var furnitureVar = result.toJSON();
						var picturesForLoad = [];
                		var picturesForView = [];
                		var callList = [];
                		if ( furnitureVar.pictures ) {
	                		for ( var i = 0; i < furnitureVar.pictures.length; ++i ) {
			                   	var picture = new Picture({id : furnitureVar.pictures[i]});
			                    picturesForLoad.push( picture );
			                    callList.push( function( back ) {
			                    	var picVar = picturesForLoad.pop();
			                    	picVar.fetch({
			                        	success : function( result ) {
			                        		//picturesForView.push( result.toJSON() );
			                        		back( null, result.toJSON() );
			                        	},
			                        	error : function( err ) {
			                          		back( err );
			                        	}
			                    	});
			                	});
			                }
			            }
		                async.parallel( callList, function( err, results ) {
		                	if (err) throw err;
		                	$(view.el).html(_.template(contentTemplate, {furniture: furnitureVar, pictures: results}));
		                	for( var i = 0; i < results.length; i++ ) {
		                		view.pictureEdits[results[i].id] = new FileEdit({ el : '#picture-' + results[i].id,
		                														  furniture : view.furniture });
		                		view.pictureViews[results[i].id] = new FileView({ el : '#picture-' + results[i].id,
		                														  editView : view.pictureEdits[results[i].id],
		                														  furniture : view.furniture });
		                		view.pictureEdits[results[i].id].showView = view.pictureViews[results[i].id];
		                		view.pictureViews[results[i].id].render( { id : results[i].id} );
		                	}
		                });
					},
					error : function() {
						console.log('error!');
					}
				});
			}
		},

		saveImage : function( e ) {
			var view = this;
			var formData = new FormData($('#addImageForm')[0]);
			/*
				xhr : function() {
					var myXhr = $.ajaxSettings.xhr();
					if ( myXhr.upload ) {
						//myXhr.upload.addEventListener('progress', progressHandlingFunction, false);
					}
				}
			*/
			$.ajax({
				url : '/file/furnitures/' + view.furniture.id,
				type : 'POST',
				success : function( file ) {
					var pictures = view.furniture.get('pictures');
					if ( !pictures ) {
						pictures = [];
					}
					pictures.push( file.id );
					view.furniture.save({ pictures : pictures },
						{
							success: function( newFurniture ) {
								view.render({ id : newFurniture.id });
							},
							error : function() {
								console.log('error!');
							}
						});
				},
				data : formData,
				cache : false,
				contentType : false,
				processData : false
			});
		},

		editPicture : function( e ) {
			var view = this;

		},

		deletePicture : function( e ) {
			var view = this;
		}
	});
	return ContentView;
});