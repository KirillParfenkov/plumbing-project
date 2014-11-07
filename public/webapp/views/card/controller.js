define([
  'module',
  'jquery',
  'underscore',
  'backbone',
  'models/content',
  'text!./template/card.html',
  'less!./css/card.less'
], function ( module, $, _, Backbone, Content, template ) {
  var PageEdit = Backbone.View.extend({

    el : '.cutaway',
    content : null,

    render : function ( src, callback ) {

      var view = this;
      var variablesMap = src.variablesMap;
      var phoneNumber1 = variablesMap['phoneNumber1'];
      var phoneNumber2 = variablesMap['phoneNumber2'];
      var padding = (phoneNumber1 && phoneNumber2) ? '48px' : '72px';

      $(view.el).html(_.template( template, { phoneNumber1 : variablesMap['phoneNumber1'], 
                                              phoneNumber2 : variablesMap['phoneNumber2'],
                                              padding: padding }));
    },

  });
  return PageEdit;
});