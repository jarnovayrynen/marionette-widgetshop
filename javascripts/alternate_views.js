App.AlternateProducts = Backbone.View.extend({
	tagName: "table",
	className: "table",
	initialize: function(opts) {
		if (opts.parent) this.parent = opts.parent;
		this.template = _.template($('#products-template').html());
		this.on('clickEvent', this.onClickEvent);

		// Marionette CollectionView does rerendering for you when collection changes underneath
		this.listenTo(this.collection, 'add remove reset', this.render);	
	},
	render: function() {
		var header = '<h3>Same with Backbone.View</h3>';
		this.$el.html(header);

		this.collection.each(function(model) {
			var childView = new App.Product({model: model, parent: this});
			this.$el.append(childView.render().el);
			childView.delegateEvents();
		}, this);

		return this;
	},
	onClickEvent: function(childModel) {
		if (this.parent) this.parent.trigger('clickEvent', childModel);
	}
});