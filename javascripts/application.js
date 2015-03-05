"use strict";

// How to inject into Underscore templates
_.templateSettings = {
    interpolate: /<-%=(.+?)%>/g, // <-%= variable %>
    evaluate: /<-%(.+?)%>/g, // <-% code %>
    escape: /<--(.+?)->/g // <-- escaped ->
};

var App = new Marionette.Application();

App.addRegions({
	app: '#app'
});

App.on("start", function() {
  if(Backbone.history) {
    Backbone.history.start();
  }
});

$(document).ready(function() {
 	App.start();
});