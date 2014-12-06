define([
    'jquery',
    'underscore',
    'backbone',
    'messager',
    'underi18n',
    'models/user',
    'collections/users',
    'text!templates/setup/user/change-password/change-password.html',
    'text!templates/error.html',
    'less!templates/setup/user/change-password/change-password.less'
], function ($, _, Backbone, Messager, underi18n, User, Usres, template, errorTemplate) {
    var ChangePassword = Backbone.View.extend({
        events : {
            'click .change-password .userSaveButton' : 'save'
        },
        user : null,
        render : function ( src, callback ) {
            var view = this;

            var systemPermissionSet = src.context.currentProfile.permissionSet.system;
            if ( !this.hasPermission( systemPermissionSet ) ) {
                $(view.el).html( _.template( errorTemplate ) );
                return;
            }

            var user = new User( {id: src.id} );
            user.fetch( {
                success: function ( user ) {
                    view.user = user;
                    $(view.el).html(_.template( underi18n.template( template, view.i18n ), {user: user.toJSON()}));
                    view.messager = new Messager($('.change-password .message-box'));
                },
                error: function ( err ) {
                    console.log( err );
                }
            });
        },

        save : function () {
            var view = this;

            $.post('system/password', {
                id : view.user.id,
                password : $('.change-password').find('.change-form').find('#userPassword').val(),
                repPassword : $('.change-password').find('.change-form').find('#userRepPassword').val()
            }).done( function() {
                window.location.hash = '/setup/userEdit/' + view.user.id;
            }).fail( function( result ) {
                var result = result.responseJSON;
                if ( result ) {
                    if ( result.err == 'emptyField' ) {
                        var fieldName = underi18n.template( '<%_ ' + result.field + ' %>', view.i18n );
                        view.messager.danger( _.template(underi18n.template( '<%_ emptyFieldError %>', view.i18n ), { field : fieldName }) );
                    } else if ( result.err == 'passNotEqual' ){
                        view.messager.danger( underi18n.template( '<%_ passNotEqualError %>', view.i18n ) );
                    } else {
                        view.messager.danger( underi18n.template( '<%_ unknownError %>', view.i18n ) );
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
        },

        loadI18n : function ( i18n, done ) {
            var path = '/templates/setup/user/change-password/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        }
    });
    return ChangePassword;
});