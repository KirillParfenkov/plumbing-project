define([
    'jquery',
    'underscore',
    'backbone',
    'underi18n',
    'messager',
    'libs/queue/queue',
    'models/tab',
    'collections/tabs',
    'text!templates/setup/tab/list/list.html',
    'less!templates/setup/tab/list/list.less'
], function ($, _, Backbone, underi18n, Messager, Queue, Tab, Tabs, template) {
	var TabsView = Backbone.View.extend({
        events: {
            'click .tab-list .tabs .deleteLink' : 'delete'
        },
        tabs : null,
		render : function ( src, callback ) {
            var view = this;
            var queue = new Queue([
                function(queue) {
                    view.tabs = new Tabs();
                    view.tabs.fetch({
                        success : function () {
                            queue.next();
                        },
                         error : function( err ) {
                            console.log( err );
                            queue.next();
                        }
                    });
                },
                function(queue) {
                    $(view.el).html(_.template( underi18n.template(template, view.i18n), {tabs: view.tabs.toJSON()}));
                    if ( callback ) {
                        callback();
                    }
                }]);
            queue.start();
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
        },

        loadI18n : function ( i18n, done ) {
            var path = '/templates/setup/tab/list/';
            var view = this;
            $.get( path + i18n + '.json', function( data ) {
                view.i18n = underi18n.MessageFactory( data );
                done( null, view.i18n );
            }).fail( function( err ) {
                done( err );
            });
        },

        delete : function( event ) {
            var view = this;
            var $link = $(event.currentTarget);
            var id = $link.attr('value');
            var tab = this.tabs.get( id );
            var messager = new Messager( $('.tab-list .mesage-box') );
            if (confirm(_.template(underi18n.template('<%_ deleteConfirm %>', this.i18n), {name : tab.get('name') }))) {
                tab.destroy({
                    success : function(model, response) {
                        messager.success( underi18n.template('<%_ successDeleteMessage %>', view.i18n) );
                        $link.parents('tr').remove();
                    },
                    error : function( err ) {
                        messager.danger(  underi18n.template('<%_ errorDeleteMessage %>', view.i18n) );
                    }
                });
            }
        }
    });
	return TabsView;
});