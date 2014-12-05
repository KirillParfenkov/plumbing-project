define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Type = Backbone.Model.extend({
		urlRoot : 'http://localhost:8080/api/types',
		initialize: function(){
    	}
	});

	return Type;
});