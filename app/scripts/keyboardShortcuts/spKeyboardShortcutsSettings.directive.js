'use strict';

angular.module('keyboardShortcuts')
	.directive('spKeyboardShortcutsSettings', function(KeyboardShortcuts) {
    return {
        restrict: 'E',
		scope: {
			settings: '=',
		},
		transclude:true,
		replace:true,
		link:function (scope) {
			var keyboardShortcuts = KeyboardShortcuts.create();

			scope.sections = keyboardShortcuts.sectionDescriptions;

			function applyDefaultSettings () {
				var defaults, all;

				// save clone of current defaults
				defaults = _.cloneDeep(keyboardShortcuts.configuredCombos);

				// override defaults with settings from outside
				all = _.merge(defaults, scope.settings);

				// override settings with combined results
				_.merge(scope.settings, all);
			}

			scope.$watchCollection('settings', function () {
				applyDefaultSettings();
			});
		},
        templateUrl: 'scripts/keyboardShortcuts/spKeyboardShortcutsSettings.template.html'
    };
});

