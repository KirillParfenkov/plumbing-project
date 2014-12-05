define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'system',
  'async',
  'moduls/context',
  'models/profile',
  'models/permissionSet',
  'collections/tabs',
  'text!templates/setup/profile/profileView.html'
], function ($, _, Backbone, Events, System, Async, Context, Profile, PermissionSet, Tabs, profileViewTemplate) {
  var ProfileView = Backbone.View.extend({
    profile : null,

    render : function ( src, callback ) {

      var view = this;
      var profile = new Profile( {id: src.id} );

      Async.waterfall([
        function loadProfile ( doneLoadProfile ) {
          profile.fetch( {
            success: function ( profile ) {
              doneLoadProfile( null, profile.toJSON() );
            },
            error: function ( err ) {
              doneLoadProfile( err );
            }
          });
        },
        function loadPermissionData ( profile, doneLoadData ) {

          Async.parallel({

            tabList : function ( done ) {

              var tabs = new Tabs();
              var tabList = [];

              tabs.fetch({
                success: function ( tabs ) {
                  _.each(tabs.toJSON(), function(tab) {
                    if ( typeof (_.find( profile.tabs, function( profTab ) {
                      return (profTab == tab.id);
                    })) != 'undefined') {
                      tabList.push({ id : tab.id, label: tab.label, visible: true});
                    } else {
                      tabList.push({ id : tab.id, label: tab.label, visible: false});
                    }
                  }); 
                  done( null, tabList );
                },
                error: function ( err ) {
                  done( err );
                }
              });
            },

            permissionSet : function ( done ) {

              var permissionSet = new PermissionSet({ id : profile.name });
              permissionSet.fetch({
                success : function ( permissionSet ) {
                  done( null, permissionSet.toJSON() );
                },
                error : function ( err ) {
                  done( err );
                }
              });
            },

            permissionScheme : function ( done ) {
              System.getPermissionScheme( function( err, scheme ) {
                if ( err ) {
                  done( err );
                } else {
                  done( null, scheme );
                }
              });
            }

          }, function( err, results ) {

            if ( err ) doneLoadData( err );

            doneLoadData( null, { 
              tabList : results.tabList,
              permissionSet : results.permissionSet,
              permissionScheme : results.permissionScheme
            });

          });
        }
      ], function( err, result ) {
        if ( err ) {
            console.log(err);
            return false;
        }
        $(view.el).html(_.template( profileViewTemplate, {
          profile : profile.toJSON(),
          tabList : result.tabList,
          permissionSet : result.permissionSet,
          scheme : result.permissionScheme,
          viewHalper : view.viewHalper
        }));
        return true;
      });
    },

    viewHalper : {

      getPermissionValue : function( permission, permissionSet, namespace ) {
        var value;
        if ( namespace == "system" || namespace == "tables" ) {
          if ( (permission.type = "String") && permission.multi && permissionSet[namespace]) {
            value = permissionSet[namespace][permission.name];
            return value ? value.join(', ') : "";
          }
        }
        return "";
      },

      getStyle : function( permission, permissionSet, namespace ) {
        var value;
        if ( namespace == "system" || namespace == "tables" ) {
          if ( (permission.type = "String") && permission.multi && permissionSet[namespace]) {
            var value = permissionSet[namespace][permission.name];
            value = value ? value : [];
            if ( value.length == 0 ) {
              return "danger";  
            } else if ( value.length == permission.values.length ) {
              return "success";
            } else {
              return "warning";
            }
          }
        }
        return "";
      }
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
    }

  });
  return ProfileView;
});