define([
  'jquery',
  'underscore',
  'backbone',
	'vm'
], function ($, _, Backbone, Vm) {
  var viewLoader = {
    views : {},
    basePath : 'custom/views/',
    load : function( viewnName, callback ) {
      views = this.views;
      if ( views[viewnName] ) {
        callback( views[viewnName] );
      } else {

        var name = viewnName;
        while ( name.indexOf('.') != -1 ) {
          name = name.replace('.', '/');
        }

        var path = this.basePath + name;
        require( [path], function( View ) {
          views[viewnName] = new View();
          callback( views[viewnName] );
        });
      }
    }
  }
  return viewLoader;
});
