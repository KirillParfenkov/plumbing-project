define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/file',
  'collections/types',
  'text!custom/templates/file/fileEdit.html',
], function ($, _, Backbone, Events, Async, File, Types, contentTemplate) {
	var FileEdit = Backbone.View.extend({
		el : '.content',
		ui : {},
		template : contentTemplate,
		typeMap : null,
		types : null,
		showView : null,
		file : null,
		events : {
			'click .savePictureButton' : 'save',
			'click .cancelPictureButton' : 'cancel'
		},

		initialize : function( src ) {
			this.el = src.el;
			this.showView = src.showView;
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
						view.types = new Types();
						view.types.fetch( {
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
				$(view.el).html(_.template(contentTemplate, { file : view.file.toJSON(), types : view.types.toJSON() }));
				if ( callback ) callback();
 			});
		},

		save : function( e ) {
			var view = this;
			e.preventDefault();
			view.file.save({
				name : $(e.target).parents('form:first').find('[name=name]').val(),
				type : $(e.target).parents('form:first').find('[name=type]').val()
			}, {
				success : function( result ) {
					view.showView.render( { id : view.file.get('id')} );
				},
				error : function( err ) {
					console.log( err );
				}
			});
			
		},

		cancel : function( e ) {
			e.preventDefault();
			this.showView.render( { id : this.file.get('id')} );
		}
	});
	return FileEdit;
});