'use strict';

angular.module('dashboardApp').factory('AsyncConfig', function (AppSettings) {
	var AsyncConfig;

	// Usage:
	// provide a method called 'updateConfig' to update config by settings.
	AsyncConfig = stampit({
		getConfig:function (cb) {
			if (this.config) {
				return cb(null, this.config);
			}

			AppSettings.load(_.bind(function (settings) {
				this.updateConfig(settings);
				cb(null, this.config);
			}, this));
		},

		withConfig:function (cb) {
			this.getConfig(_.bind(cb, this));
		}
	});

	AsyncConfig.enclose(function () {
		AppSettings.on('save', _.bind(function () {
			// reset config so it gets updated on next 'get' operation
			this.config = null;
		}, this));
	});

	AsyncConfig.state({
		config:null
	});

	return AsyncConfig;
});


