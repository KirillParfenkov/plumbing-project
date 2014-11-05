define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'models/category',
  'models/file',
  'collections/categories',
  'collections/furnitures',
  'text!templates/categoryView.html',
], function ($, _, Backbone, Async, Category, File, Categories, Furnitures, contentTemplate ) {
	var ContentView = Backbone.View.extend({
		el : '.contentContainer',
		template : contentTemplate,
		render : function( src, callback ) {
			var collSize = 3;
			var view = this;
			var categoryId = src.categoryId;
			var avatarMap = {};

			Async.parallel({
				furTable : function( finish ) {

					if ( categoryId ) {
						var furnitures = new Furnitures();
						furnitures.url = 'furnituresByCategory/' + categoryId;
						furnitures.fetch({
							success : function( result ) {
								var furnituresVar = result.toJSON();
								var table = [];
								var index = -1;
								var fileIdList = [];
								var callList = [];
								for ( var i = 0; i < furnituresVar.length; i++ ) {
									if ( !(i%collSize) ) {
										++index;
										table[index] = [];
									}

									if ( furnituresVar[i].avatar && furnituresVar[i].pictures.length > 0 ) {
										fileIdList.push( { avatarId : furnituresVar[i].avatar, furnitureId : furnituresVar[i].id } );
										callList.push( function( finish ) {
											var src = fileIdList.pop();
											var file = new File( {id : src.avatarId} );
											file.fetch({
												success : function( result ) {
													finish( null, { furnitureId : src.furnitureId, avatar : result.toJSON() });
												},
												error : function( err ) {
													finish( err );
												}
											});
										});
									}
									table[index].push(furnituresVar[i]);
								}
								Async.parallel( callList, function( err, results ) {
									if (err) finish( err );
									for( var i = 0; i < results.length; i++) {
										avatarMap[results[i].furnitureId] = results[i].avatar;
									}
									finish( null, table );
								});
							},
							error : function( err ) {
								if ( callback ) {
									finish( err );
								}
							}
						});
					} else {
						finish( null, [] );	
					}
				},

				category : function( finish ) {

					var category = new Category({ id : categoryId});
					category.fetch({
						success : function( result ) {
							finish( null, result.toJSON());
						},
						error : function( err ) {
							finish( err );
						}
					});

				}
			},
			function( err, results ) {
				if (err) throw err;
				$(view.el).html(_.template( view.template, { furTable : results.furTable, category : results.category, avatarMap : avatarMap } ));
			});
		}
	});
	return ContentView;
});