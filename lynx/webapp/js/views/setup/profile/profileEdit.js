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
  'text!templates/setup/profile/profileEdit.html'
], function ($, _, Backbone, Events, System, Async, Context, Profile, PermissionSet, Tabs, profileViewTemplate) {
	var ProfileView = Backbone.View.extend({

    el : '.content',
    profile : null,
    scheme : null,

    events: {
      'click .profileSaveButton' : 'save'
    },

    render : function ( src, callback ) {

      var view = this;
      var profile;
      if ( src.id != -1) {
        this.renderEditProfile( src, callback );
      } else {
        view.profile = new Profile();
        $(view.el).html(_.template(profileEditTemplate, {profile: view.profile.toJSON()}));
      }
    },

    renderEditProfile : function ( src, callback ) {

      var view = this;
      var profile = new Profile( {id: src.id} );

      Async.waterfall([
        function loadProfile ( doneLoadProfile ) {
          profile.fetch( {
            success: function ( profile ) {
              view.profile = profile;
              console.log('profile');
              console.log(  view.profile );
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
        if ( err ) throw err;
        view.scheme = result.permissionScheme;
        $(view.el).html(_.template( profileViewTemplate, {
          profile : profile.toJSON(), 
          tabList : result.tabList, 
          permissionSet : result.permissionSet,
          scheme : result.permissionScheme,
          viewHalper : view.viewHalper
        }));
      });
    },

    viewHalper : {

      getPermissionValue : function( permission, permissionSet, namespace, value ) {
        var userPermissions;
        if ( namespace == "system" || namespace == "tables" ) {
          if ( (permission.type = "String") && permission.multi && permissionSet[namespace]) {
            userPermissions = permissionSet[namespace][permission.name];
            return _.contains( userPermissions, value );
          }
        }
        return "";
      }
    },

    save : function () {
      var profile = this.profile;
      var tabs = [];
      var permissionSet = profile.get('permissionSet');

      _.each( this.scheme.system, function( permission ){
        permissionSet.system[permission.name] = [];
        $('input:checkbox[name=' +  permission.name + '][ns=system]:checked').each( function( ) {
          permissionSet.system[permission.name].push( $(this).val() );
        });
        
      });

      _.each( this.scheme.tables, function( permission ){
        permissionSet.tables[permission.name] = [];
        $('input:checkbox[name=' +  permission.name + '][ns=tables]:checked').each( function( ) {
          permissionSet.tables[permission.name].push( $(this).val() );
        });
        
      });

      $('input:checkbox[name=tabs][ns=tabs]:checked').each(function( ) {
        tabs.push( parseInt($(this).val()) );
      });

      profile.save({
        tabs : tabs,
        permissionSet : permissionSet
      }, 
      {
        success: function ( profile ) {
          window.location.hash = '/setup/profileView/' + profile.id;
        }
      });
    },

    hasPermission : function( systemPermissionSet ) {
      if ( systemPermissionSet && systemPermissionSet.allowEditProfile ) {
        if ( systemPermissionSet.allowEditProfile.indexOf('edit') == -1 ) {
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