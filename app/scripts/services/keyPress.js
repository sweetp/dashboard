'use strict';

angular.module('dashboardApp').provider('KeyPress', function () {
	var providedCombosConfig;

	providedCombosConfig = {};

	this.addCombos = function (map) {
		if (!map) {
			return;
		}

		_.assign(providedCombosConfig, map);
	};

	this.$get = function($window, $log) {
		var KeyPress, instance, lib;

		lib = $window.keypress;

		KeyPress = stampit().state({
			lib:lib,
			configuredCombos:providedCombosConfig
		});

		KeyPress.methods({
			createListener:function () {
				return new lib.Listener();
			},
			getConfiguredCombos:function (listener) {
				return _(listener)
					.map(function (configOverride, key) {
						var config;

						if (!this.configuredCombos[key]) {
							$log.error('Keyboard combo found without configuration.', key, this.configuredCombos);
							return null;
						}

						config = _.cloneDeep(this.configuredCombos[key]);
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
		instance = KeyPress.create();

		return instance;
	};
});

