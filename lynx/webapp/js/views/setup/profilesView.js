define([
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'libs/queue/queue',
  'models/profile',
  'collections/profiles',
  'text!templates/setup/profile/list/profilesView.html',
  'less!templates/setup/profile/list/profilesView.less'
], function ($, _, Backbone, underi18n, Queue, Profile, Profiles, profilesViewTemplate) {
	var ProfilesView = Backbone.View.extend({
		render : function ( src, callback ) {
            var view = this;
            var profiles = null;
            var queue = new Queue([
            function(queue) {
                profiles = new Profiles();
                profiles.fetch({
                    success : function () {
                        queue.next();
                    },
                    error : function() {
                        console.log('error!');
                        queue.next();
                    }
                });
            },
            function(queue) {
                console.log( profiles.toJSON() );
                $(view.el).html(_.template(underi18n.template(profilesViewTemplate, view.i18n), {profiles: profiles.toJSON()}));
                if ( callback ) {
                    callback();
                }
            }]);
            queue.start();
		},

        hasPermission : function( systemPermissionSet ) {
            if ( systemPermissionSet && systemPermissionSet.allowEditProfile ) {
                if ( systemPermissionSet.allowEditProfile.indexOf('read') == -1 ) {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        },

        loadI18n : function ( i18n, done ) {
            var path = '/templates/setup/profile/list/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        }
	});
	return ProfilesView;
});