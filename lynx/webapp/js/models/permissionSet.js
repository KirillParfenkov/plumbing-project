define([
		'backbone'
], function( Backbone ) {

	var PermissionSet = Backbone.Model.extend({
		urlRoot : '/system/getPermissionSets'
	});

	return PermissionSet;
});