'use strict';

angular.module('dashboardApp').factory('AppSettings', function (Observable) {
	var AppSettings, instance;

	AppSettings = stampit().enclose(function () {
		var key;

		key = "app.settings";

		this.load = function (callback) {
			chrome.storage.local.get(key, function (data) {
				if (chrome.runtime.lastError) {
					throw new Error(chrome.runtime.lastError.message);
				}

				// set defaults
				if (!data) {
					data = {};
				}

				if (!data[key]) {
					data[key] = {};
				}

				_.defaults(data[key], {
					serverUrl: "http://localhost:7777/",
					standardNotificationDismissDelay: 3000,
					keyboardShortcuts: {}
				});

				callback(data[key]);
			});
		};

		this.save = function (settings, callback) {
			var data;
			data = {};
			data[key] = settings;
			chrome.storage.local.set(data, _.bind(function () {
				if (chrome.runtime.lastError) {
					throw new Error(chrome.runtime.lastError.message);
				}

				this.fireEvent('save');
				callback();
			}, this));
		};
	});

	// build singleton
	instance = stampit.compose(Observable, AppSettings).create();

	// add static events
	instance.addEvents([
		'save'
	]);

	return instance;
});
