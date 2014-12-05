define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'messager',
  'models/user',
  'collections/users',
  'collections/profiles',
  'text!templates/setup/user/userAdd.html',
  'text!templates/error.html',
  'less!templates/setup/user/userAdd.less'
], function ($, _, Backbone, async, Messager, User, Usres, Profiles, template, errorTemplate ) {
	var UserAdd = Backbone.View.extend({
        events: {
          'click .user-add .userSaveButton' : 'save'
        },
        user : null,
        messager : new Messager(),
        render : function ( src, callback ) {

          var view = this;

          var profiles = new Profiles();

          async.waterfall([
            function loadProfiles( next ) {
              profiles.fetch( {
                success : function( profiles ) {
                  next( null, profiles.toJSON() );
                },
                error : function() {
                  next( err );
                }
              });
            }
          ], function( err, profiles ) {
            if ( err ) {
              console.log( err );
            } else {
              $(view.el).html(_.template(template, { profiles : profiles }));
              view.messager = new Messager($('.user-add .mesage-box'));
            }
          });
            },

        save : function() {
          var view = this;
          $.post( '/system/users', {
              email : $('#userEmail').val(),
              firstName : $('#userFirstName').val(),
              lastName : $('#userLastName').val(),
              password : $('#userPassword').val(),
              repPassword : $('#userRepPassword').val(),
              profile : $('#userProfile').val()
          }).done( function( user ) {
            window.location.hash = '#/setup/usersView';
          }).fail( function( result ) {
            var result = result.responseJSON;
            if ( result ) {
              if ( result.err == 'emptyField' ) {
                view.messager.danger( 'Поле <b>' + result.field + '</b> Не Заполнено.' );
              } else if ( result.err == 'passNotEqual' ){
                view.messager.danger( 'Пароли не совподают.' );
              } else if ( result.err == 'emailExist' ) {
                view.messager.danger( 'Такой почтовый адресс уже зарегестрирован.' );
              } else {
                view.messager.danger( 'Неизвестная ошибка.' );
              }
            }
          });
        },

        hasPermission : function( systemPermissionSet ) {
          if ( systemPermissionSet && systemPermissionSet.allowEditUsers ) {
            if ( systemPermissionSet.allowEditUsers.indexOf('edit') == -1 ) {
              return false;
            }
          } else {
            return false;
          }
          return true;
        }
	});
	return UserAdd;
});