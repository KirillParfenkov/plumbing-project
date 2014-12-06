define([
  'jquery',
  'underscore',
  'backbone',
  'text!./moduls/messager/success.html',
  'text!./moduls/messager/info.html',
  'text!./moduls/messager/warning.html',
  'text!./moduls/messager/danger.html'
], function ($, _, Backbone, success, info, warning, danger) {

	var Messager = function( container ) {
		
		this.container = container;

		this.success = function( message ) {
			container.html( _.template(success, { message: message }) );
		}
		this.info = function( message ) {
			container.html( _.template(info, { message: message }) );
		}
		this.warning = function( message ) {
			container.html( _.template(warning, { message: message }) );
		}
		this.danger = function( message ) {
			container.html( _.template(danger, { message: message }) );
		}

		this.clear = function() {
			container.html( '' );	
		}
  }
  return Messager;
});
