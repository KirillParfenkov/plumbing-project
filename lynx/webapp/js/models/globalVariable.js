define(['jquery',
		'underscore',
		'backbone'
], function($, _, Backbone) {
	var GlobalVariable = Backbone.Model.extend({
		idAttribute: "_id",
		urlRoot : '/system/globalVariables'
	});
	return GlobalVariable;
});