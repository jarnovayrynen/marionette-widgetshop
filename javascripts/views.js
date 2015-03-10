App.Product = Marionette.ItemView.extend({
	template: "#product-template",
	templateHelpers: function() {
		return {
			getPrice: function() {
				if (!this.price) return "";
				var html = '';
				if (this.price.amount && this.price.currency) {
					html += this.price.amount + " " + this.price.currency;
				}
				
				return html;
			},
			getAvgRating: function() {
				if (!this.reviews || this.reviews.length == 0) return "No reviews";
				var html = "",
				ratingSum = 0,
				ratingCount = 0;
				_.each(this.reviews, function(r) {
					ratingSum += r.stars;
					ratingCount++;
				});
				var avgRating = ratingSum/ratingCount;
				for (i=0; i < avgRating; i++) {
					html += '<span aria-hidden="true" class="glyphicon glyphicon-star"></span>';
				}
				return html;
			}
		}
	},
	tagName: "tr",
	events: {
		'click .show-details-btn': 'onShowDetailsBtn'
	},
	onShowDetailsBtn: function () {
		this.triggerMethod('show:details');
	}
});

App.Products = Marionette.CompositeView.extend({
	template: "#products-template",
	tagName: "table",
	className: "table",
	childView: App.Product,
	childViewContainer: '#product-list',
	childEvents: {
		'show:details': function (child) {
			// event bubbled up to the parent
			this.triggerMethod('show:details', child);
		}
	}
	});

App.Header = Marionette.ItemView.extend({
	template: "#header-template"
});

App.Review = Marionette.ItemView.extend({
	template: '#review-template',
	templateHelpers: function() {
		return {
			getStars: function() {
				var html = '';
				var stars = this.stars;
				if (stars &&  stars.length == 0 || typeof(stars) != 'number') return "No stars";
				var starClass = '';
				if (stars < 2) starClass = 'red'
					else if (stars == 5) starClass = 'green';
								
				for (var i=0; i < stars; i++) {
					html += '<span class="glyphicon glyphicon-star [star-class]"></span>';
				}
				html = html.replace(/\[star-class\]/g, starClass);

				return html;
			}
		}
	},
	className: 'review-item'
	});

App.NoReviews = Marionette.ItemView.extend({
	template: '#no-reviews-template'
});

App.Reviews = Marionette.CollectionView.extend({
	childView: App.Review,
	emptyView: App.NoReviews
});



App.Details = Marionette.ItemView.extend({
	template: "#details-template",
	templateHelpers: function() {
		return {
			getDetails: function() {
				var html = '<div class="details">\
								<div><b>Name:</b> ' + this.name + '</div>' +
								'<div><b>Description:</b> ' + this.description + '</div>\
							</div>';	
				return html;
			},
			getGallery: function() {
				var html = '<div class="gallery">\
								<span class="glyphicon glyphicon-eur make-it-big box-shadow-primary"></span>\
								<span class="glyphicon glyphicon-plus make-it-big box-shadow-primary"></span>\
								<span class="glyphicon glyphicon-cloud make-it-big box-shadow-primary"></span>\
								<span class="glyphicon glyphicon-glass make-it-big box-shadow-primary"></span>\
							</div>';
			
				return html;
			},
			getReviews: function() {
				var c = new Backbone.Collection(this.reviews);
				return new App.Reviews({collection: c}).render().el.outerHTML;
			}
		}
	},
	modelEvents: {
		'change': 'render' // the data doesn't change yet so event never gets fired
	}
})

App.MainLayout = Marionette.LayoutView.extend({
	template: "#main-layout-template",
	className: 'container',
	regions: {
		header: "#header",
		main: "#main",
		details: "#details"
	},
	initialize: function(o) {
		this.products = new Backbone.Collection(App.data);
		this.productsView = new App.Products({collection: this.products});
		this.listenTo(this.productsView, 'show:details', this.onShowDetails);
	},
	onRender: function() {
		this.header.show(new App.Header());
		this.main.show(this.productsView);
	},
	onShowDetails: function(child) {
		this.details.show(new App.Details({model: child.model}))
	}
});

