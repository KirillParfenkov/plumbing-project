// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'moduls/view-loader',
  'moduls/context',
  'views/setup/setupMenu',
  'views/setup/usersView',
  'views/setup/profilesView',
  'views/setup/tabsView',
  'views/setup/user/userEdit',
  'views/setup/user/userView',
  'views/setup/user/userAdd',
  'views/setup/user/changePassword',
  'views/setup/tab/tabEdit',
  'views/setup/tab/tabView',
  'views/setup/globalVariables/globalVariablesView',
  'views/setup/globalVariables/globalVariablesEdit',
  'views/setup/profile/profileEdit',
  'views/setup/profile/profileView',
  'views/setup/self/view/view',
  'text!templates/error.html'
], function ($, _, Backbone, Async, viewLoader, context, SetupMenu, UsersView, ProfilesView,
             TabsView, UserEdit, UserView, UserAdd, ChangePassword, TabEdit, TabView, GlobalVariablesView,
             GlobalVariablesEdit, ProfileEdit, ProfileView, SelfView, errorTemplate) {
  var AppRouter = Backbone.Router.extend({
    viewList : [],
    tabViewMap : {},
    setupMenu : {},
    setupViews : [],
    context : {},
    routes: {
      'tab/:tabName' : 'selectTab',
      'setup' : 'selectSetup',
      'setup/:itemName' : 'selectSetupItem',
      'setup/:itemName/:id' : 'selectSetupItemWithId',
      'view/:name' : 'selectView',
      'view/:name/:id' : 'selectView'
    },

    initialize : function (options, doneInit) {
      var router = this;
      var tabs = options.tabs;
      this.appView = options.appView;
      var views =[];
      for ( var i = 0; i < tabs.length; i++) {
        views.push( tabs[i].view );
      }

      Async.parallel({

        setupViews : function( doneSetuoViews ) {

          router.setupMenu = new SetupMenu();
          router.setupViews['usersView'] = new UsersView();
          router.setupViews['profilesView'] = new ProfilesView();
          router.setupViews['tabsView'] = new TabsView();
          router.setupViews['userEdit'] = new UserEdit();
          router.setupViews['userView'] = new UserView();
          router.setupViews['userAdd'] = new UserAdd();
          router.setupViews['changePassword'] = new ChangePassword();
          router.setupViews['tabEdit'] = new TabEdit();
          router.setupViews['tabView'] = new TabView();
          router.setupViews['profileEdit'] = new ProfileEdit();
          router.setupViews['profileView'] = new ProfileView();
          router.setupViews['globalVariablesEdit'] = new GlobalVariablesEdit();
          router.setupViews['globalVariablesView'] = new GlobalVariablesView();
          router.setupViews['selfView'] = new SelfView();

          doneSetuoViews( null, router.setupViews );
        },

        context : function( doneLoadContext ) {

          Async.parallel( {

            currentUser : function( done ) {
              context.getCurrentUser( function( err, user ) {
                if ( err ) {
                  done( err );
                } else {
                  done( null, user );
                }
              });
            },

            currentProfile : function( done ) {
              context.getCurrentProfile( function( err, profile ) {
                if ( err ) {
                  done( err );
                } else {
                  done( null, profile );
                }
              });
            },

            globalVariables : function( done ) {
              context.getGlobalVeriables( function( err, globalVariables) {
                if ( err ) {
                  done( err );
                } else {

                  done( null, globalVariables );
                }
              });
            }

          }, function( err, results ) {

            if ( err ) {
              console.log( err ); 
              return;
            }

            for( var index in router.setupViews ) {
                router.setupViews[index].setElement('.content');
            }
            router.setupMenu.setElement('.header-menu-container');

            doneLoadContext( null, {
              currentUser    : results.currentUser,
              currentProfile : results.currentProfile,
              globalVariables : results.globalVariables
            });
          });
        }

      }, function( err, results ) {
        router.context = results.context;
        doneInit( err );
      });
    },

    selectSetup: function() {
      var view = this;
      var context = this.context;
      var i18nVar = context.globalVariables['system']['i18n'];
      view.setupMenu.loadI18n( i18nVar, function( err ) {
        view.setupMenu.render( { context: context } );
      });
    },

    selectSetupItem: function( view ) {

      var router = this;
      var context = this.context;

      var handler = function() {
        var i18nVar = context.globalVariables['system']['i18n'];
        if ( router.setupViews[view].loadI18n ) {
          router.setupViews[view].loadI18n( i18nVar, function( err ) {
            router.setupViews[view].render( { context: context } );
            router.appView.cleanSelectTab();
          });
        } else {
          router.setupViews[view].render( { context: context } );
          router.appView.cleanSelectTab();
        }
      };


      if ( this.setupViews[view].hasPermission ) {
        var systemPermissionSet = this.context.currentProfile.permissionSet.system;
        if ( this.setupViews[view].hasPermission( systemPermissionSet ) ) {
          handler();
        } else {
          $(this.setupViews[view].el).html(_.template( errorTemplate ));
        }
      } else {
        handler();
      }
      this.clearHeaderMenu();
    },

    selectSetupItemWithId: function( view, id ) {
      var router = this;
      var context = this.context;
      var handler = function() {
          var i18nVar = context.globalVariables['system']['i18n'];
          if ( router.setupViews[view].loadI18n ) {
              router.setupViews[view].loadI18n( i18nVar, function( err ) {
                  router.setupViews[view].render({id: id, context: context} );
              });
          } else {
              router.setupViews[view].render( {id: id, context: context} );
          }
      };

      if ( this.setupViews[view].hasPermission ) {
        var systemPermissionSet = this.context.currentProfile.permissionSet.system;
        if ( this.setupViews[view].hasPermission( systemPermissionSet ) ) {
          handler();
        } else {
          $(this.setupViews[view].el).html(_.template( errorTemplate ));
        }
      } else {
        handler();
      }
    },

    clearHeaderMenu: function() {
      $('.header-menu-container').html('');
    },

    renderView : function( view, src, i18nVar ) {
      if ( view.loadI18n ) {
        console.log( 'view.loadI18n' );
        view.loadI18n( i18nVar, function( err ) {
          console.log('render');
          view.render( src );
        });
      } else {
        console.log( '!view.loadI18n' );
        view.render( src );
      }
    },

    selectView: function( name, id ) {
      var router = this;

      var i18nVar = router.context.globalVariables['system']['i18n'];

      viewLoader.load( name, function( view ) {

        var src = { context: router.context, id: id };

        if ( view.hasPermission ) {
          console.log( 'view.hasPermission' );
          var systemPermissionSet = router.context.currentProfile.permissionSet.system;

          if ( view.hasPermission( systemPermissionSet ) ) {
            console.log( 'view.hasPermission( systemPermissionSet )' );
            router.renderView( view, src, i18nVar );

          } else {
            console.log( '!view.hasPermission( systemPermissionSet )' );
            $(view.el).html(_.template( errorTemplate ));

          }
        } else {
          console.log( '!view.hasPermission' );
          router.renderView( view, src, i18nVar );
        }
      });
    }
  }); 

  var initialize = function(options, callback){
		var appView = options.appView;
    var router = new AppRouter(options, callback);    
  };
  return {
    initialize: initialize
  };
});
