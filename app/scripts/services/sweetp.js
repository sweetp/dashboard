'use strict';

angular.module('dashboardApp').factory('Sweetp', function ($http, AppSettings) {
    var me;

	me = {
		projectConfigs:null,
		updateConfig:function (settings) {
			me.config = {
				urls:{
					projectConfigs:settings.serverUrl + 'configs'
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
        loadProjects:function (cb) {
			me.getConfig(function (err, config) {
				$http.get(config.urls.projectConfigs)
					.success(function (data) {
						me.projectConfigs = data;
						return cb(null, data, status);
					})
					.error(function (data, status) {
						return cb("Tried to load project configs from sweetp server, but an error occured.", data, status);
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
		}
    };

	AppSettings.on('save', function () {
		// reset config so it gets updated on next 'get' operation
		me.config = null;
	});

	return me;
});

