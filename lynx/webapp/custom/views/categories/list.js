define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/category',
  'collections/categories',
  'text!custom/templates/categories/categoriesList.html',
  'custom/views/categories/edit',
  'custom/views/categories/view'
], function ($, _, Backbone, Events, Async, Category, Categories, contentTemplate, EditCategory, ViewCategory ) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		contentId : 'contentEditContainer',
		ui : {},
		template : contentTemplate,
		views : {},
		categoryTreeMap : null,
		initialize : function() {
			this.views['view'] = new ViewCategory({ el : '#' + this.contentId });
			this.views['edit'] = new EditCategory({ el : '#' + this.contentId, backVuew : this.views['view'] });
		},
		render : function ( src, callback ) {

			var view = this,
				categoryTree,
				categories = new Categories();

			view.categories = categories;

			Async.waterfall([
				function loadCategories( next ) {
					categories.fetch( {
						success : function( result ) {
							next( null, result.toJSON());
						},
						error : function( err ) {
							next( err );
						}
					});
					
				},
				function bieldCategoryTree( categories, next ) {
					var categoryTree = [],
						categoryTreeMap = {};
					for( var i = 0; i < categories.length; i++  ) {
						categoryTreeMap[ categories[i].id ] = {
							id: categories[i].id,
							value : categories[i].name,
							data : [],
							childs : []
						};
					}

					for( var i = 0; i < categories.length; i++  ) {
						var item;
						if ( !categories[i].parentId ) {
							categoryTree.push( categoryTreeMap[categories[i].id] );

						} else {
							categoryTreeMap[ categories[i].parentId ].data.push( categoryTreeMap[categories[i].id] );
							categoryTreeMap[ categories[i].parentId ].childs.push( categoryTreeMap[categories[i].id] );
						}
					}
					view.categoryTreeMap = categoryTreeMap;
					categoryTreeMap = JSON.parse(JSON.stringify(categoryTreeMap));
					next( null, categoryTree );
				},
				function renderView ( categoryTree, next ) {
					$(view.el).html(_.template(contentTemplate));

					webix.ui({
						view: "form",
						id : "addPrimCategoryForm",
						container : "addPrimCategoryFormCont",
						borderless : true,
						elements:[ {cols : [
							{
								view: "label",
								label : "<b>Categories</b>",
								width : 120
							},
							{
								view:"button", 
								id:"addPrimCategoryButton", 
								value:"Add Promary Category", 
								width:200,
								type : "form",
								click : function() {
									//$$( 'addCategoryWin' ).context = {}};
									$$( 'addCategoryWin' ).show();
								}
							}]}
						]
					})


					view.ui.leyout = new webix.ui({
						type:"head",
						container : 'categoryListLayoutCont',
						id : 'categoryListLayout',
						height : 600,
						cols : [
							{
								view : "tree",
								id : "categoriesTree",
								select : true,
								data : categoryTree,
								onContext : {},
								minWidth : 300
							},
							{
								view : "resizer"
							},
							{
								header: "Category",
								body : "<div id='" + view.contentId + "' ></div>"
							}
						]

					});

					$$('categoriesTree').attachEvent("onAfterSelect", function( categoryId ) {
						view.renderViewCategory( categoryId );
					});

					view.ui.treeContext = new webix.ui({
						view : "contextmenu",
						id : "categoryMenu",
						data : [
							{
								value : "Add"
							},
							{
								value : "Edit"
							},
							{
								value : "Info"
							},
							{
								value : "Delete"
							}
						],
						master : $$('categoriesTree'),
						on : {
							"onItemClick" : function(id) {

								var context = this.getContext();
								var tree = context.obj;
								var treeId = context.id;
								var item = this.getItem( id ).value;

								if ( item == 'Add' ) {
									$$( 'addCategoryWin' ).context = context;
									$$( 'addCategoryWin' ).show();
								} else if ( item == 'Edit' ) {
									view.renderEditCategory( treeId );
								} else if ( item == "Info") {
									view.renderViewCategory( treeId );
								} else if ( item == "Delete") {
									view.deleteCategory( treeId, function( err ) {
										if ( err ) {
											console.log('err!');
										} else {
											$$('categoriesTree').remove( treeId );
										}
									});
								}

							}
						}
					});

					view.ui.addCategoryWin = new webix.ui({
						context : null,
						view : "window",
						position : "center",
						move : true,
						id : "addCategoryWin",
						head : "Add Categoty",
						body : {
							view : "form",
							id : "addCategoryForm",
							elements : [
								{ view : "text", label : "Name", name : "name" },
								{ margin : 5, cols : [
									{
										view : "button", 
										value : "Add", 
										type : 'form',
										click : function () {
											var parentId = $$('addCategoryWin').context ? $$('addCategoryWin').context.id : null;
											var category = new Category();
											category.save(	{ 
																parentId: parentId,
																name : $$('addCategoryForm').getValues().name
														  	},
														  	{
																success : function ( result ) {
																	var category = result.toJSON();
																	webix.message( 'Added category "' + $$('addCategoryForm').getValues().name + '"' );
																	$$('addCategoryWin').hide();
																	$$('categoriesTree').add({
																		id : category.id,
																		value : category.name
																	}, 0, parentId);
																	var node = {
																		id : category.id,
																		value : category.name,
																		parentId : parentId
																	};
																	view.categoryTreeMap[category.id] = node;
																	if ( !view.categoryTreeMap[parentId].data ) {
																		view.categoryTreeMap[parentId].data = [];
																	}
																	if ( !view.categoryTreeMap[parentId].childs ) {
																		view.categoryTreeMap[parentId].childs = [];
																	}
																	view.categoryTreeMap[parentId].data.push( view.categoryTreeMap[category.id] );
																	view.categoryTreeMap[parentId].childs.push( view.categoryTreeMap[category.id] );
																},
																error : function () {
																	webix.message( 'Error' );
																}
															});
										}
									},
									{
										view : "button", 
										value : "Cancel",
										click : function () {
											$$('addCategoryWin').hide();
										}
									}
								]}
							]
						},
						modal : true
					});
					next( null );
				}
			], function( err ) {
				if ( err ) throw err;
			});
		},

		renderViewCategory : function( categoryId ) {
			this.views['view'].render({ id : categoryId });
		},

		renderEditCategory : function( categoryId ) {
			this.views['edit'].render({ id : categoryId });
		},

		deleteCategory : function( categoryId, callback ) {
			var view = this;
			var category = new Category({id: categoryId});

			var delList = [];
			var chekList = [ view.categoryTreeMap[categoryId] ];
			var newChekList;
			while ( true ) {
				newChekList = [];
				for( var i = 0; i < chekList.length; i++ ) {
					delList.push( chekList[i].id);
					newChekList.push.apply( newChekList, chekList[i].childs );
				}
				if ( newChekList.length ) {
					chekList = newChekList;
				} else {
					break;
				}
			}
			var callList = [];
			for ( var i = 0; i < delList.length; i++ ) {
				callList.push( function( finish ) {
					var category = new Category( { id : delList.pop()} );
					category.destroy({
						success : function( result ) {
							finish( null );
						},
						error : function( err ) {
							finish( err );
						}
					});
				});
			}
			Async.parallel( callList, function( err, results ) {
				if ( err ) console.log( err );
				callback( err );
			});
		}
	});
	return ContentView;
});