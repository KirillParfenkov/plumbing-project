define([
  'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {

    var System = {
      getPermissionScheme : function( done ) {
        $.get('/system/permissionScheme', function( scheme ) {
          done( null, scheme );
        }).fail( function() {
          done( {error: "error"} );
        });
      }
  }
  return System;
});
