define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/file',
  'collections/types',
  'text!custom/templates/file/fileView.html',
  'text!custom/templates/picture/pictureDelete.html'
], function ($, _, Backbone, Events, Async, File, Types, contentTemplate, deleteTemplate) {
	var FileView = Backbone.View.extend({
		el : '.content',
		ui : {},
		template : contentTemplate,
		typeMap : null,
		editView : null,
		file : null,
		events : {
			'click .editLink' : 'editFile',
			'click .deleteLink' : 'delete'
		},

		initialize : function( src ) {
			this.el = src.el;
			this.editView = src.editView;
			this.furniture = src.furniture;
		},

		render : function ( src, callback ) {

			var view = this;
			view.file = new File({id : src.id});

			Async.parallel([
				function loadTypes( finish ) {
					if ( view.typeMap ) {
						finish( null );
					} else {
						var types = new Types();
						types.fetch( {
							success : function( result ) {
								var typesVar = result.toJSON();
								view.typeMap = {};
								for ( var i = 0; i < typesVar.length; i++ ) {
									view.typeMap[typesVar[i].id] = typesVar[i];
								}

								finish( null );
							},
							error : function( err ){
								finish( err );
							}
						});
					}
				},
				function loadFile( finish ) {
					view.file.fetch({
						success : function( result ) {
							finish( null );
							
						},
						error : function( err ) {
							finish( err );
						}
					});
				}
			], function( err, result ) {
				if ( err ) throw err;
				$(view.el).html(_.template(contentTemplate, { file : view.file.toJSON(), types : view.typeMap }));
				if ( callback ) callback();
 			});
		},

		editFile : function( e ) {
			var view = this;
			e.preventDefault();
			this.editView.render( { id : view.file.get('id')} );
		},

		delete : function( e ) {
			e.preventDefault();
			var view = this;
			var pictures = this.furniture.attributes.pictures;
			var delIndex = pictures.indexOf( view.file.id );
			if ( delIndex != -1) {
				pictures.splice( delIndex, 1 );
				this.furniture.save( {
					pictures : pictures
				}, {
					success : function( result ) {
						$(view.el).html(_.template(deleteTemplate, {file : view.file.toJSON()}));
					},
					error : function() {
						console.log('err!');
					}
				});
			}
		}
	});
	return FileView;
});