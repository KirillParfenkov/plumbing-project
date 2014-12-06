define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Profile = Backbone.Model.extend({
		urlRoot : '/system/profiles'
	});
	return Profile;
});