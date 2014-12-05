// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'collections/variables',
  'views/header/controller',
  'views/content/controller',
  'views/card/controller',
  'views/title/controller',
  'views/request/controller'
], function ($, _, Backbone, Variables, Header, Content, Card, Title, Request ) {
  var AppRouter = Backbone.Router.extend({

    views : [],
    variables : [],
    variablesMap : {},

    routes: {
      'content/:contentId' : 'renderContent',
      'request' : 'renderRequestPage',
      '' : 'start'
    },

    initialize : function ( options, callback ) {

      var router = this;
      var header = new Header();
      var card = new Card();
      var title = new Title();
      router.variables = new Variables();

      router.variables.fetch({
        success : function( variables ) {
          var variables = variables.toJSON();
          for( var i = 0; i < variables.length; i++ ) {
            router.variablesMap[variables[i].name] = variables[i].value;
          }

          title.render({
            variables : variables,
            variablesMap : router.variablesMap
          });

          card.render({
            variables : variables,
            variablesMap : router.variablesMap
          });
        },
        error : function( err ) {
          console.log( err );
        }
      });

      header.render();

      router.views['header'] = header;
      router.views['card'] = card;
      router.views['title'] = title;
      router.views['content'] = new Content();
      router.views['request'] = new Request();
      callback();
    },

    renderContent : function ( id ) { 
      this.views['content'].render( { id : id });
    },

    renderRequestPage : function () {
      this.views['request'].render();
    },

    start : function() {
      this.views['content'].render( { id : '548197007058b30e0bb1149a' });
    }
  }); 

  var initialize = function( options, callback ){
    var router = new AppRouter(options, callback);    
  };
  return {
    initialize: initialize
  };
});
