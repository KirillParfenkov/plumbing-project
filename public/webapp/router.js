// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/header/controller',
  'views/content/controller',
], function ($, _, Backbone, Header, Content ) {
  var AppRouter = Backbone.Router.extend({

    views : [],

    routes: {
      'content/:contentId' : 'renderContent',
      '' : 'test'
    },

    initialize : function ( options, callback ) {

      var header = new Header();
      header.render();

      this.views['header'] = header;
      this.views['content'] = new Content();
      callback();
    },

    renderContent : function ( id ) { 
      this.views['content'].render( { id : id });
    },

    test : function() {
      this.views['content'].render( { id : '5453a8e411c9eb2864fd63fe' });
    }
  }); 

  var initialize = function( options, callback ){
    var router = new AppRouter(options, callback);    
  };
  return {
    initialize: initialize
  };
});
