define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'models/tab',
  'text!templates/setup/tab/view/view.html'
], function ($, _, Backbone, Events, Queue, Tab, tabViewTemplate) {
    var TabView = Backbone.View.extend({

        el : '.content',
        tab : null,

        render : function ( src, callback ) {
          var view = this;
          var tab = new Tab( {id: src.id} );
          tab.fetch( {
            success: function ( tab ) {
              $(view.el).html(_.template(tabViewTemplate, {tab: tab.toJSON()}));
            },
            error: function () {
            }
          });
        },

        hasPermission : function( systemPermissionSet ) {
          if ( systemPermissionSet && systemPermissionSet.allowEditTabs ) {
            if ( systemPermissionSet.allowEditTabs.indexOf('read') == -1 ) {
              return false;
            }
          } else {
            return false;
          }
          return true;
        }

    });
    return TabView;
});