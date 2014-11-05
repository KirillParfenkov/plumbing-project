define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var User = Backbone.Model.extend({
		urlRoot : 'api/furnitures',
		initialize: function(){
    	}
	});

	return User;
});