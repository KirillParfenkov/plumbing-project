define([
  'jquery',
  'underscore',
  'backbone',
  'async',
  'messager',
  'collections/globalVariables',
  'text!templates/setup/globalVariables/globalVariablesEdit.html',
  'text!templates/error.html',
  'less!templates/setup/globalVariables/globalVariablesEdit.less'
], function ($, _, Backbone, async, Messager, GlobalVariables, template, errorTemplate ) {
  var GlobalVariablesEdit = Backbone.View.extend({

    el : '.content',
    user : null,
    messager : new Messager(),

    render : function ( src, callback ) {
      $(this.el).html(_.template(template));
    },

    save : function() {
    },

    hasPermission : function( systemPermissionSet ) {
      if ( systemPermissionSet && systemPermissionSet.allowEditСonfiguration ) {
        if ( systemPermissionSet.allowEditСonfiguration.indexOf('edit') == -1 ) {
          return false;
        }
      } else {
        return false;
      }
      return true;
    }
  });
  return GlobalVariablesEdit;
});