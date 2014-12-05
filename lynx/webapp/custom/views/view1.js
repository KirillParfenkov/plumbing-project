define([
  'jquery',
  'underscore',
  'backbone',
  'events',
  'libs/queue/queue',
  'moduls/context',
  'text!custom/templates/template1.html' 
], function ($, _, Backbone, Events, Queue, context, contentTemplate) {
	var ContentView = Backbone.View.extend({
		elem : '.content',
		template : contentTemplate,
		render : function ( src, callback ) {
			var view = this;

			console.log( 'context' );
			console.log( src.context );

			$(this.elem).html(_.template(contentTemplate));
		}
	});
	return ContentView;
});