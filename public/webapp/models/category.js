define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var Category = Backbone.Model.extend({
		urlRoot : 'api/categories',
		initialize: function(){
    	}
	});

	return Category;
});