define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'async',
  'models/category',
  'text!custom/templates/categories/categoriesEdit.html',
], function ($, _, Backbone, Events, Async, Category, contentTemplate) {
	var ContentView = Backbone.View.extend({
		el : '.content',
		ui : {},
		template : contentTemplate,
		category : null,
		backVuew : null,
		initialize : function( src ) {
			this.el = src.el;
			this.backVuew = src.backVuew;
		},

		render : function ( src, callback ) {
			var view = this;
			view.category  = new Category({id : src.id});
			view.category.fetch({
				success : function( result ) {
					var categoryVar = result.toJSON();
					$(view.el).html(_.template(contentTemplate, { category : categoryVar}));
					view.initUI( { category : categoryVar} );
				},
				error : function( err ) {
					if ( callback ) callback( err );
				}
			});
		},

		initUI : function( src ) {
			var view = this;
			webix.ui({
				view : "form",
				container : "categoryEditFromCont",
				id : "categoryEditFrom",

				elements : [
					{ 
						view:"text", 
						id:"name", 
						label:'Name', 
						name:"name", 
						value : src.category.name},
    				{ 
    					view:"textarea", 
    				 	id:"des", 
    				 	label:'Description', 
    				 	name:"description", 
    				 	value : src.category.description,
    				 	minHeight : 400,
    				 	resize : true },
    				{ 
    					view:"button", 
    					id:"sub", 
    					name:"submit", 
    					value:"Save",
    					click : function() {
    						view.save();
    					}
    				}
				]
			});
		},

		save : function() {
			var view = this;
			view.category.save({
				name : $$('categoryEditFrom').getValues().name,
				description : $$('categoryEditFrom').getValues().description
			}, {
				success : function( result ) {
					view.backVuew.render({id : result.toJSON().id});
				},
				error : function( err ) {
					console.log( err );
				}
			});
		}
	});
	return ContentView;
});