define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var User = Backbone.Model.extend({
		urlRoot : '/api/users',
		initialize: function(){
    	}
	});

	return User;
});