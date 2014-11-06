define([
  'module',
  'jquery',
  'underscore',
  'backbone',
  'models/content',
  'text!./templates/menu.html',
  'less!./css/menu.less'
], function ( module, $, _, Backbone, Content, template ) {
  var PageEdit = Backbone.View.extend({

    el : '.menu-box',
    content : null,

    events : {
      'click .menu-content .item' : 'selectButton',
    },

    render : function ( src, callback ) {
      var view = this;
      $(view.el).html(_.template( template ));
    },

    selectButton : function( e ) {
      event.preventDefault();
      var ref = $( e.currentTarget ).find('a').attr('href');
      window.location = ref;
    }

  });
  return PageEdit;
});