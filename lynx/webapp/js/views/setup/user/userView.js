define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/user',
  'collections/users',
  'text!templates/setup/user/userView.html'
], function ($, _, Backbone, Events, Queue, User, Usres, userViewTemplate) {
	var UserView = Backbone.View.extend({

	    render : function ( src, callback ) {
            var view = this;
              var user = new User( {id: src.id} );
              user.fetch( {
                success: function ( user ) {
                  $(view.el).html(_.template(userViewTemplate, {user: user.toJSON()}));
                },
                error: function () {
                  console.log('error!');
                }
              });
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
        }
    });
	return UserView;
});