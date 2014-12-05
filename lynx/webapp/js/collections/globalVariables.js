define([
  'jquery',
  'underscore',
  'backbone',
  'models/globalVariable'
], function( $, _, Backbone, GlobalVariable ) {
	 var GlobalVariables = Backbone.Collection.extend({
	 	models: GlobalVariable,
	 	url : '/system/globalVariables'
	 });
	 return GlobalVariables;
});