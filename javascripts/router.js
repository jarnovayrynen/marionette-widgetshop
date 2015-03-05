"use strict";


App.MainRouter = Marionette.AppRouter.extend({
	appRoutes: {
		"": "showApp"
	}
});

var API = {
	start: function (opts) {
			this.showApp();
	},
	showApp: function() {
		App.getRegion('app').show(new App.MainLayout());
	}
};

	App.addInitializer(function() {
		API.start();		
		new App.MainRouter({
			controller: API
		});
	});
