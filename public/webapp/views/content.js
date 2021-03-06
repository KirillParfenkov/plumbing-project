define([
  'jquery',
  'underscore',
  'backbone',
  'text!./template/title.html',
  'less!./css/title.less'
], function ( $, _, Backbone, template ) {
  var PageEdit = Backbone.View.extend({

    el : '.title-content',
    content : null,

    render : function ( src, callback ) {
      $(this.el).html(_.template( template, { title : src.variablesMap['title']}));
    },

  });
  return PageEdit;
});