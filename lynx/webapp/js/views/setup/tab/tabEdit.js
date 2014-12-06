define([
  'jquery',
  'underscore',
  'backbone',
  'underi18n',
  'libs/queue/queue',
  'models/tab',
  'text!templates/setup/tab/edit/edit.html'
], function ($, _, Backbone, underi18n, Queue, Tab, template) {
	var TabView = Backbone.View.extend({
        events: {
          'click .tabSaveButton' : 'save'
        },
        tab : null,
        render : function ( src, callback ) {
            var view = this;
            var tab;
            if ( src.id != -1) {
                tab = new Tab( {id: src.id} );
                tab.fetch( {
                    success: function ( tab ) {
                        view.tab = tab;
                        console.log(  view.i18n );
                        $(view.el).html(_.template( underi18n.template(template, view.i18n), {tab: tab.toJSON()}));
                    },
                        error: function () {
                    }
                });
            } else {
                view.tab = new Tab();
                $(view.el).html(_.template( underi18n.template(template, view.i18n), {tab: view.tab.toJSON()}));
            }
        },

        save : function () {
            var tab = this.tab;
            tab.save({
                name : $('#tabName').val(),
                label : $('#tabLabel').val(),
                link : $('#tabLink').val(),
                view : $('#tabView').val()
            },
            {
                success: function (tab) {
                  window.location.hash = '/setup/tabsView';
                }
            });
        },

        hasPermission : function( systemPermissionSet ) {
            if ( systemPermissionSet && systemPermissionSet.allowEditTabs ) {
                if ( systemPermissionSet.allowEditTabs.indexOf('edit') == -1 ) {
                    return false;
                }
            } else {
                return false;
            }
            return true;
        },

        loadI18n : function ( i18n, done ) {
            console.log('test edit strt');
            var path = '/templates/setup/tab/edit/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        }
	});
	return TabView;
});