// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/header/controller',
], function ($, _, Backbone, Header ) {
  var AppRouter = Backbone.Router.extend({

    views : [],

    routes: {
      'content/:contentId' : 'renderContent'
    },

    initialize : function (options, callback) {

      var header = new Header();
      header.render();

      this.views['header'] = header;
      callback();
    },

    renderContent : function () {
      console.log('renderContent');
    }
  }); 

  var initialize = function( options, callback ){
    var router = new AppRouter(options, callback);    
  };
  return {
    initialize: initialize
  };
});
