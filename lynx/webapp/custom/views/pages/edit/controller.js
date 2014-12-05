define([
  'module',
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'async',
  'messager',
  'models/content',
  'text!./template/page-edit.html',
  'text!templates/error.html',
  'less!./css/page-edit.less',
  'tinymce'
], function ( module, $, _, Backbone, underi18n, async, Messager, Content, template, errorTemplate ) {
  var PageEdit = Backbone.View.extend({

    el : '.content',
    content : null,
    messager : new Messager(),
    ed: null,

    events : {
      'click .content-edit .saveButton' : 'save',
    },

    render : function ( src, callback ) {
      var view = this;
      console.log( 'src.id: ' + src.id );
      view.content = new Content( { _id : src.id });
      view.content.fetch({
        success : function( content ) {
          $(view.el).html(_.template(underi18n.template( template, view.i18n ), { content: content.toJSON() }));
          console.log( 'tinymce.init' );

          view.ed = new tinymce.Editor( 'page-editor', {
            language: 'ru',
            plugins: [
             "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
             "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
             "save table contextmenu directionality emoticons template paste textcolor"],
            toolbar: "forecolor backcolor"
          }, tinymce.EditorManager);
          view.ed.render();
          console.log( view.ed );
        },
        error : function() {
          console.log( err );
        }
      });
    },

    save : function() {
      this.ed.save();
      var form = $('.content-edit').find('form');
      form.find('input[name="_redirect"]').val('/#/view/pages.list.controller');
      form.submit();
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