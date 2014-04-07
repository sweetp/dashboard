'use strict';

angular.module('dashboardApp').factory('KeyPress', function($window) {
	var KeyPress, instance, lib;

	lib = $window.keypress;

	KeyPress = stampit().state({
		lib:lib
	});

	KeyPress.methods({
		createListener:function () {
			return new lib.Listener();
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
});



