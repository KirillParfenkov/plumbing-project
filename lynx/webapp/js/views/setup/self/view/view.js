define([
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'libs/queue/queue',
  'models/user',
  'collections/users',
  'text!templates/setup/self/view/view.html',
  'less!templates/setup/self/view/view.less'
], function ($, _, Backbone, underi18n, Queue, User, Usres, template ) {
	var SelfView = Backbone.View.extend({

		render : function ( src, callback ) {
            var view = this;
            $(view.el).html(_.template( underi18n.template(template, view.i18n), { user : src.context.currentUser, profile : src.context.currentProfile } ));
		},

        loadI18n : function ( i18n, done ) {
            var path = '/templates/setup/self/view/';
            var view = this;
             $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        }
	});
	return SelfView;
});