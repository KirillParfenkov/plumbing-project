define([
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'vm',
  'libs/queue/queue',
  'models/user',
  'text!templates/layout/layout.html',
  'less!templates/layout/layout.less',
], function($, _, Backbone, underi18n, Vm, Queue, User, layoutTemplate){
  var AppView = Backbone.View.extend({
    el: '.container',
    events : {
      'click .tabLink__sys' : 'selectTab'
    },
    i18n : null,
    template: layoutTemplate,
    tabs : [],
    render: function ( tabs, currentUser, globalVariables, callback ) {
      var view = this;
      var queue = new Queue([
        function(queue) {
          queue.next();
        },
        function(queue) {
          view.loadI18n( globalVariables['system']['i18n'], function( err ) {
            queue.next();
          });
        },
        function(queue) {
          view.renderWithData( tabs, currentUser );
          if ( callback ) {
            callback();
          }
        }]);
      queue.start();
		},

    loadI18n : function ( i18n, done ) {
      var path = '/templates/layout/';
      var view = this;
      $.get( path + i18n + '.json', function( data ) {
        view.i18n = underi18n.MessageFactory( data );
        done( null, view.i18n );
      }).fail( function( err ) {
        done( err );
      });
    },

    cleanSelectTab : function() {
      $( '#tabMenu' ).find('li').removeClass( 'active' );
    },

    selectTab : function ( e ) {
      this.cleanSelectTab();
      $(e.currentTarget).parent().addClass( 'active' );
    },

    renderWithData : function ( tabs, currentUser ) {
      $(this.el).html(_.template( underi18n.template(layoutTemplate, this.i18n), {tabs : tabs, currentUser: currentUser}));
    }
	});
  return AppView;
});