'use strict';

angular.module('keyboardShortcuts', []).provider('KeyboardShortcuts', function () {
	var providedCombosConfig, sectionDescriptions;

	providedCombosConfig = {};
	sectionDescriptions = {};

	this.addCombos = function (key, description, map) {
		if (!map) {
			return;
		}

		if (!providedCombosConfig[key]) {
			// create section
			providedCombosConfig[key] = {};
		}

		// save description
		sectionDescriptions[key] = description;

		// assign combos
		_.assign(providedCombosConfig[key], map);
	};

	this.$get = function($window, $log) {
		var KeyboardShortcuts, lib;

		lib = $window.keypress;

		KeyboardShortcuts = stampit().state({
			lib:lib,
			configuredCombos:providedCombosConfig,
			sectionDescriptions:sectionDescriptions
		});

		KeyboardShortcuts.methods({
			createListener:function () {
				return new lib.Listener();
			},
			getConfiguredCombos:function (sectionKey, listener) {
				return _(listener)
					.map(function (configOverride, key) {
						var config;

						if (!this.configuredCombos[sectionKey] ||
							!this.configuredCombos[sectionKey][key]) {
							$log.error('Keyboard combo found without configuration.', key, this.configuredCombos);
							return null;
						}

						config = _.cloneDeep(this.configuredCombos[sectionKey][key]);
						return _.assign(config, configOverride);
					}, this)
					.compact()
					.value()
					;
			},
			applyScopeTo:function (scope, combos) {
				combos.forEach(function(combo) {
					var onKeyDown, onKeyUp;

					if (combo.on_keydown) {
						onKeyDown = combo.on_keydown;
						combo.on_keydown = function () {
							onKeyDown();
							scope.$apply();
						};
					}

					if (combo.on_keyup) {
						onKeyUp = combo.on_keyup;
						combo.on_keyup = function () {
							onKeyUp();
							scope.$apply();
						};
					}
				});
			}
		});

		// build singleton
		return KeyboardShortcuts;
	};
});

