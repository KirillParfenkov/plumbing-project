define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'libs/queue/queue',
  'models/furniture',
  'models/file',
  'models/category',
  'collections/categories',
  'text!custom/templates/furniture/furnitureEdit.html' 
], function ($, _, Backbone, Events, async, Queue, Furniture, Picture, Category, Categories, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		template : contentTemplate,
		events: {
      		'click .furnitureSaveButton' : 'save'
    	},
    furniture : null,
    ui : {},
		render : function ( src, callback ) {
      		var view = this;
      		var furniture;
          //var picture
      		if ( src.id != -1) {
            async.parallel({
              staticContent : function( finish ) {
            		furniture = new Furniture( {id: src.id} );
            		furniture.fetch( {
              			success: function ( result ) {
                			view.furniture = result;
                      console.log('categoryIdList');
                      console.log( result.toJSON() );
                      var categoryIdList = result.toJSON().categories;
                      if ( categoryIdList ) {
                        categoryIdList = categoryIdList.slice(0);
                      } else {
                        categoryIdList = [];
                      }
                      var callList = [];

                      for ( var i = 0; i < categoryIdList.length; i++ ) {
                        callList.push( function( next ) {
                          var categoryId = categoryIdList.pop();
                          var category = new Category( {id : categoryId});
                          category.fetch({
                            success : function( result ) {
                              next( null, result.toJSON() );
                            },
                            error : function( err ) {
                              console.log( err );
                              next( err );
                            }
                          });
                        });
                      }

                      async.parallel( callList, function( err, categories ){
                        if (err) throw err;
                        finish( null, {furniture : result.toJSON(), categories : categories} );
                      });
              			},
              			error: function () {
              				console.log('error!');
              			}
            		});
              },
              scriptContent : function ( finish ) {

                var categoriesVar,
                    categoryTree = [],
                    categoryTreeMap = {},
                    categories = new Categories();

                categories.fetch({
                  success : function( result ) {
                    categories = result.toJSON();

                    for( var i = 0; i < categories.length; i++  ) {
                      categoryTreeMap[ categories[i].id ] = {
                        id: categories[i].id,
                        value : categories[i].name,
                        data : []
                      };
                    }

                    for( var i = 0; i < categories.length; i++  ) {
                      var item;
                      if ( !categories[i].parentId ) {
                        categoryTree.push( categoryTreeMap[categories[i].id] );

                      } else {
                        categoryTreeMap[ categories[i].parentId ].data.push( categoryTreeMap[categories[i].id] );
                      }
                    }
                    finish( null, { categoryTree : categoryTree });
                  },
                  error : function( err ) {
                    console.log( err );
                    finish( err );
                  }
                });
              }
            }, function( err, results ) {
              if (err) throw err;
              console.log(results.staticContent);
              $(view.el).html(_.template(contentTemplate, results.staticContent ));
              view.initUiComponents( results.scriptContent , callback );
            });
      		} else {
        		view.furniture = new Furniture();
        		$(view.el).html(_.template(contentTemplate, {furniture: view.furniture.toJSON()}));
            view.initUiComponents( src, callback );
      		}
		},

    initUiComponents : function ( src,  callback ) {

      $('#addCategoryButton').off('click')
                             .on( 'click', function( event ) {
                                event.preventDefault();
                                $$('addCategoryTreeWen').show();
                             });
      var view = this;


      view.ui.categoryTreeWen = new webix.ui({
        view : "window",
        position : "center",
        move : true,
        modal : true,
        id : "addCategoryTreeWen",
        head : "Add Category",
        height : "400px",
        body : {
              rows : [
                { 
                  id : "categoryTree",
                  view : "tree",
                  select : true,
                  data : src.categoryTree
                },
                { margin : 5, cols : [
                  {
                    view : "button",
                    value : "Add",
                    click : function () {
                      view.addCategoryToFurniture($$('categoryTree').getSelectedItem());
                      $$('addCategoryTreeWen').hide();
                    }
                  },
                  {
                    view : "button",
                    value : "Cancel",
                    click : function () {
                      $$('addCategoryTreeWen').hide();
                    }
                  }
                ]}
              ]
        }
      });

      console.log( view.furniture );

      $('.deleteLink').off().on( 'click', function( event ) {
        event.preventDefault();
        var categoryId = $( event.currentTarget ).attr('categoryId');

        view.deleteCategoryFromFurniture( categoryId, $( event.currentTarget ) );
      });

      if ( callback ) {
        callback();
      }
    },

		save : function () {
      		var furniture = this.furniture;
      		furniture.save({  
        		label : $('#furnitureLabel').val(),
            categories : furniture.get('categories'),
            description : $('#furnitureDesc').val()
      		}, 
      		{
        		success: function ( furniture ) {
          			window.location.hash = '/view/furniture.list';
        	}
      	});
    },

    deleteCategoryFromFurniture : function( id, element ) {

      var categories = this.furniture.attributes.categories;
      categories.splice( categories.indexOf(parseInt(id)), 1 );
      element.parent().remove();

    },

    addCategoryToFurniture : function( item ) {
      if ( !this.furniture.get('categories') ) {
        this.furniture.set('categories', []);
      }
      var categories = this.furniture.get('categories');
      if ( categories.indexOf(item.id) == -1 ) {
        categories.push( item.id );
        $('#addCategoryButton').before('<span class="category label label-info">' + item.value + 
                                       ' <a class="deleteLink" categoryId=" ' + item.id + '" href="">' +
                                       '<span class="glyphicon glyphicon-remove"></span></a></span> ');
      }
    }
	});

	return ContentView;
});