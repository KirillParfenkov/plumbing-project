define([], function() {
	var Queue = function(queue) {
		this.queue = queue;
		this.index = 0;
	}

	Queue.prototype = {
			start: function () {
				this.next();
			},
			next: function () {
				this.queue[this.index++]( this );
			}
		};

	return Queue;
});