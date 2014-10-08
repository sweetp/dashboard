'use strict';

angular.module('dashboardApp').factory('KeyboardShortcutsFromSettings', function (KeyboardShortcuts, AppSettings) {
	var instance, FromSettings;

	FromSettings = stampit().methods({
		getConfiguredCombosFromSettings: function (sectionKey, listeners, callback) {
			// load settings
			AppSettings.load(_.bind(function (settings) {
				// override defaults with shortcuts configs from settings
				_.merge(this.configuredCombos, settings.keyboardShortcuts);

				// call callback with attached listeners
				callback(this.getConfiguredCombos(sectionKey, listeners));
			}, this));
		}
	});

	instance = stampit.compose(KeyboardShortcuts, FromSettings).create();

	return instance;
});
