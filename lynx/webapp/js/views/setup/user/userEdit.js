define([
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'libs/queue/queue',
  'models/user',
  'collections/users',
  'text!templates/setup/user/edit/userEdit.html',
  'text!templates/error.html',
  'less!templates/setup/user/edit/userEdit.less'
], function ($, _, Backbone, underi18n, Queue, User, Usres, userEditTemplate) {
	var UserEdit = Backbone.View.extend({
        events: {
          'click .user-edit .userSaveButton' : 'save'
        },
        user : null,
        render : function ( src, callback ) {
          var view = this;

          var view = this;
          var systemPermissionSet = src.context.currentProfile.permissionSet.system;
          if ( !this.hasPermission( systemPermissionSet ) ) {
            $(view.el).html(_.template( errorTemplate ));
            return;
          }

          var user = new User( {id: src.id} );
          user.fetch( {
            success: function ( user ) {
              view.user = user;
              $(view.el).html(_.template( underi18n.template(userEditTemplate, view.i18n), {user: user.toJSON()}));
            },
            error: function () {
            }
          });
            },

        save : function () {
          var user = this.user;
          user.save({
            email : $('#userEmail').val(),
            firstName : $('#userFirstName').val(),
            lastName : $('#userLastName').val()
          },
          {
            success: function (user) {
              window.location.hash = '/setup/usersView';
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
        },

        loadI18n : function ( i18n, done ) {
            var path = '/templates/setup/user/edit/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        }
	});
	return UserEdit;
});