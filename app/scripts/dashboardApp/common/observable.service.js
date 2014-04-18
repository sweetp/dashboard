'use strict';

angular.module('dashboardApp').factory('Observable', function($log) {
	return stampit().enclose(function () {
		var events;

		events = {};

		this.addEvents = function (names) {
			names.forEach(function(name) {
				events[name] = [];
			}, this);
		};

		this.fireEvent = function (name) {
			if (!events[name]) {
				$log.error("Event " + name + " doesn't exist!");
				return;
			}

			events[name].forEach(function(handler) {
				handler();
			});
		};

		this.on = function (name, handler, scope) {
			if (scope) {
				handler = _.bind(handler, scope);
			}

			if (!events[name]) {
				$log.error("Event " + name + " doesn't exist!");
				return;
			}

			events[name].push(handler);
		};

		this.un = function (name, handler, scope) {
			if (scope) {
				handler = _.bind(handler, scope);
			}

			if (!events[name]) {
				$log.error("Event " + name + " doesn't exist!");
				return;
			}

			_.remove(events[name], function (item) {
				return item === handler;
			});
		};
	});
});



