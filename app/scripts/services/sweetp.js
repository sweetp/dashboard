'use strict';

angular.module('dashboardApp').factory('Sweetp', function ($http, AppSettings, AsyncConfig) {
    var Sweetp, instance;

	Sweetp = stampit({
		updateConfig:function (settings) {
			this.config = {
				urls:{
					projectConfigs:settings.serverUrl + 'configs',
					services:settings.serverUrl + 'services/'
				}
			};
		},

        loadProjects:function (callback) {
			this.withConfig(function (err, config) {
				if (err) {
					return callback(err);
				}
				$http.get(config.urls.projectConfigs)
					.success(_.bind(function (data) {
						this.projectConfigs = data;
						return callback(null, data, status);
					}, this))
					.error(function (data, status) {
						return callback("Tried to load project configs from sweetp server, but an error occured.", data, status);
					})
				;
			});
        },

		areProjectsLoaded:function () {
			return this.projectConfigs !== null;
		},

		isProjectLoaded:function (name) {
			return this.areProjectsLoaded() &&
				this.projectConfigs[name] !== null &&
				this.projectConfigs[name] !== undefined;
		},

		getProjectConfig:function (name) {
			if (!this.isProjectLoaded(name)) {
				return null;
			}

			return this.projectConfigs[name];
		},

		callService:function (projectName, path, params, callback) {
			var url, httpConfig;

			if (!projectName) {
				callback("Can't call service without project name!");
				return;
			}

			if (!path) {
				callback("Can't call service without path to service!");
				return;
			}

			this.getConfig(_.bind(function (err, config) {
				if (err) {
					return callback(err);
				}

				url = config.urls.services + projectName + '/' + path;
				httpConfig = {
					params:params
				};

				$http.get(url, httpConfig)
					.success(function (data, status) {
						return callback(null, data, status);
					})
					.error(function (data, status) {
						return callback("Tried to call service on sweetp server, but an error occured.", data, status);
					})
				;
			}, this));
		}
    });

	Sweetp.state({
		projectConfigs:null
	});

	instance = stampit.compose(AsyncConfig, Sweetp).create();

	return instance;
});

