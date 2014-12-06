define([
  'jquery',
  'underscore',
  'backbone',
  'models/variable'
], function( $, _, Backbone, Variable ) {
	 var Variables = Backbone.Collection.extend({
	 	models: Variable,
	 	url : '/services/variables'
	 });
	 return Variables;
});