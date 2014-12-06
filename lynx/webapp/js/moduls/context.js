define([
  'jquery',
  'underscore',
  'backbone',
  'vm'
], function ($, _, Backbone, Vm) {
    var WITHOUT_NAMESPACE = "withoutNameSpace"
    var Context = {
        getCurrentUser : function( done ) {
            $.get('/system/currentUser', function( user ) {
                done( null, user );
            }).fail( function() {
                done( { error: "error"} );
            });
        },

        getCurrentProfile : function( done ) {
            $.get('/system/currentProfile', function( profile ) {
                done( null, profile );
            }).fail( function() {
                done( { error: "error"} );
            });
        },

        getGlobalVeriables : function( done ) {
            $.get('/system/globalVariables', function( globalVariables ) {
                var result = {};
                result[WITHOUT_NAMESPACE] = {};
                for ( var i = 0; i < globalVariables.length; i++ ) {
                    variable =  globalVariables[i];
                    if ( !variable.namespace ) {
                        result[WITHOUT_NAMESPACE][variable.name] = variable.value;
                    } else {
                        if (!result[variable.namespace]) {
                            result[variable.namespace] = {};
                        }
                        result[variable.namespace][variable.name] = variable.value;
                    }
                }
                done( null, result );
            }).fail( function(){
                done( { error: "error"} );
            });
        }
  }
  return Context;
});
