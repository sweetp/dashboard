'use strict';

angular.module('dashboardApp').factory('Sweetp', function ($http, AppSettings) {
    var me;

	me = {
		projectConfigs:null,
		updateConfig:function (settings) {
			me.config = {
				urls:{
					projectConfigs:settings.serverUrl + 'configs',
					services:settings.serverUrl + 'services/'
				}
			};
		},
		getConfig:function (cb) {
			if (me.config) {
				return cb(null, me.config);
			}

			AppSettings.load(function (settings) {
				me.updateConfig(settings);
				cb(null, me.config);
			});
		},
        loadProjects:function (callback) {
			me.getConfig(function (err, config) {
				if (err) {
					return callback(err);
				}
				$http.get(config.urls.projectConfigs)
					.success(function (data) {
						me.projectConfigs = data;
						return callback(null, data, status);
					})
					.error(function (data, status) {
						return callback("Tried to load project configs from sweetp server, but an error occured.", data, status);
					})
				;
			});
        },

		areProjectsLoaded:function () {
			return me.projectConfigs !== null;
		},

		isProjectLoaded:function (name) {
			return me.areProjectsLoaded() &&
				me.projectConfigs[name] !== null &&
				me.projectConfigs[name] !== undefined;
		},

		getProjectConfig:function (name) {
			if (!me.isProjectLoaded(name)) {
				return null;
			}

			return me.projectConfigs[name];
		},

		callService:function (callback, path, params) {
			var url, httpConfig;

			me.getConfig(function (err, config) {
				if (err) {
					return callback(err);
				}

				url = config.urls.services + path;
				httpConfig = {
					params:params
				};

				$http.get(url, httpConfig)
					.success(function (data) {
						return callback(null, data, status);
					})
					.error(function (data, status) {
						return callback("Tried to call service on sweetp server, but an error occured.", data, status);
					})
				;
			});
		}
    };

	AppSettings.on('save', function () {
		// reset config so it gets updated on next 'get' operation
		me.config = null;
	});

	return me;
});

