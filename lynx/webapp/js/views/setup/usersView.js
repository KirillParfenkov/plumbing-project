define([
    'jquery',
    'underscore',
    'backbone',
    'underi18n',
    'libs/queue/queue',
    'models/user',
    'collections/users',
    'text!templates/setup/user/list/list.html',
    'less!templates/setup/user/list/list.less'
], function ($, _, Backbone, underi18n, Queue, User, Usres, usersViewTemplate) {
	var UsersView = Backbone.View.extend({
    users : new Usres(),
		render : function ( src, callback ) {
			var view = this;
            var queue = new Queue([
            function(queue) {
                if ( view.users ) {
                    view.users = new Usres();
                    view.users.fetch({
                        success : function () {
                            queue.next();
                        },
                        error : function( err ) {
                            console.log( err );
                            queue.next();
                        }
                    });
                }
            },
            function(queue) {
                $(view.el).html(_.template( underi18n.template(usersViewTemplate, view.i18n), {users: view.users.toJSON()}));
                if ( callback ) {
                    callback();
                }
            }]);
            queue.start();
		},

        hasPermission : function( systemPermissionSet ) {
            if ( systemPermissionSet && systemPermissionSet.allowEditUsers ) {
                if ( systemPermissionSet.allowEditUsers.indexOf('read') == -1 ) {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        },

        loadI18n : function ( i18n, done ) {
            var path = '/templates/setup/user/list/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        }
    });
	return UsersView;
});