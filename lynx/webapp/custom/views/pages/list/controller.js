define([
  'module',
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'async',
  'messager',
  'collections/contents',
  'text!./template/page-list.html',
  'text!templates/error.html',
  'less!./css/page-list.less',
  'tinymce'
], function ( module, $, _, Backbone, underi18n, async, Messager, Contents, template, errorTemplate ) {
  var PageEdit = Backbone.View.extend({
    el : '.content',
    contents : null,
    messager : new Messager(),

    events : {
      'click .content-list .deleteLink' : 'delete'
    },

    render : function ( src, callback ) {
      var view = this;
      view.contents = new Contents();
      view.contents.fetch( {
        success : function( contents ) {
          $(view.el).html(_.template(underi18n.template( template, view.i18n ), { contents: contents.toJSON() }));
        },
        error : function() {
          console.log( err );
        }
      });
    },

    delete : function( e ) {
      var view = this;
      e.preventDefault();
      if ( confirm("Are you sure?") ) {
        var id = $( e.target ).attr('id');
        var content = view.contents.get( id );
        content.destroy({
          success : function( model, response ) {
            view.render();
          },
          error : function( err ) {
            console.log( err );
          }
        });
      }
    },

    loadI18n : function ( i18n, done ) {
      var path = module.id + '/../i18n/';
      var view = this;
      $.get( path + i18n + '.json', function( data ) {
          view.i18n = underi18n.MessageFactory( data );
          done( null, view.i18n );
      }).fail( function( err ) {
          done( err );
      });
    }
  });
  return PageEdit;
});