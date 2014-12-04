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
      'click .request-content .newSubmit' : 'renderNewSubmit',
    },

    render : function ( src, callback ) {
      var view = this;
      $(view.el).html(_.template( template ));
    },

    renderNewSubmit : function() {
      event.preventDefault();
      $('.row.reqest').show();
      $('.request-content .newSubmit').hide();
      $('.request-content .submit').show();
    },
 
    submit : function( e ) {
      event.preventDefault();
      var username = $('#reqest-username').val(),
          phone = $('#reqest-phone').val(),
          email = $('#reqest-email').val(),
          message = $('#reqest-body').val();
      $reqestRow = $('.row.reqest');

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
            $('.request-content .newSubmit').show();
            $('.request-content .submit').hide();
            $reqestRow.hide();
          },
          error : function( err ) {
            console.log( err );
          }
      });
    }

  });
  return PageEdit;
});