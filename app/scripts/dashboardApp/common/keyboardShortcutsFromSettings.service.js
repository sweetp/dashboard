'use strict';

angular.module('dashboardApp').factory('KeyboardShortcutsFromSettings', function(KeyboardShortcuts, AppSettings) {
	var instance, FromSettings;

	FromSettings = stampit().methods({
		getConfiguredCombosFromSettings:function (listeners, callback) {
			// load settings
			AppSettings.load(_.bind(function (settings) {
				// override defaults with shortcuts configs from settings
				_.assign(this.configuredCombos, settings.keyboardShortcuts);

				// call callback with attached listeners
				callback(this.getConfiguredCombos(listeners));
			}, this));
		}
	});

	instance = stampit.compose(KeyboardShortcuts, FromSettings).create();

	return instance;
});



