define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var File = Backbone.Model.extend({
		urlRoot : 'api/files',
		initialize: function(){
    	}
	});

	return File;
});