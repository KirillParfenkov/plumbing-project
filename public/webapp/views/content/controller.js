define([
  'module',
  'jquery',
  'lazyload',
  'underscore',
  'backbone',
  'models/content',
  'text!./templates/content.html',
  'less!./css/content.less'
], function ( module, $, lazyload, _, Backbone, Content, template ) {
  var PageEdit = Backbone.View.extend({

    el : '.context-box',
    content : null,

    render : function ( src, callback ) {
      var view = this;
      var content = new Content( {  id : src.id } );
      content.fetch( {
        success : function( result ) {
          console.log( 'success' );
          $(view.el).html(_.template( template, { content : result.toJSON() } ));
          $("img.lazy").lazyload();
        },
        error : function( err ) {
          content.log( err );
        }
      });
    }
  });
  return PageEdit;
});