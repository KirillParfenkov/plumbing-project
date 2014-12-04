define([
  'module',
  'jquery',
  'underscore',
  'backbone',
  'models/content',
  'text!./templates/request.html',
  'less!./css/request.less'
], function ( module, $, _, Backbone, Content, template ) {
  var PageEdit = Backbone.View.extend({

    el : '.context-box',
    content : null,

    events : {
      'click .request-content .submit' : 'submit',
    },

    render : function ( src, callback ) {
      var view = this;
      $(view.el).html(_.template( template ));
    },

    submit : function( e ) {
      event.preventDefault();
      var username = $('#reqest-username').val(),
          phone = $('#reqest-phone').val(),
          email = $('#reqest-email').val(),
          message = $('#reqest-body').val();
      $.ajax({
          url: '/api/services/email',
          type: 'post',
          data : {
              username : username,
              message : message,
              phone : phone,
              email : email
          },
          success : function() {
            $('#reqest-body').val('');
          },
          error : function( err ) {
            console.log( err );
          }
      });
    }

  });
  return PageEdit;
});