define([
  'jquery',
  'underscore',
  'backbone',
  'models/tab'
], function( $, _, Backbone, Tab ) {
	 var Tabs = Backbone.Collection.extend({
	 	models: Tab,
	 	url : '/visibleTabs'
	 });
	 return Tabs;
});