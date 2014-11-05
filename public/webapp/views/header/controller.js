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
      'click .content-new .saveButton' : 'save',
    },

    render : function ( src, callback ) {
      var view = this;
      $(view.el).html(_.template( template ));
    },

    selectButton : function() {
      console.log( 'Wrap!' );
    }

  });
  return PageEdit;
});