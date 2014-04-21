'use strict';

describe('Service: KeyboardShortcutsFromSettings', function () {
	var s;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	beforeEach(inject(function ($injector, AppSettings) {
		sinon.stub(AppSettings, 'load', function (cb) {
			cb({
				keyboardShortcuts:{
					mySection:{
						save:{
							keys:'s'
						},
						load:{
							keys:'l'
						}
					},
					otherSection:{
						quit:{
							keys:'q'
						}
					}
				}
			});
		});

		s = $injector.get('KeyboardShortcutsFromSettings');
	}));

	afterEach(inject(function(AppSettings) {
		// remove mocked api
		AppSettings.load.restore();
	}));

	it('can get combos with porperties overriden by app settings.', function () {
		var saveCombo, quitCombo, combos;

		// create test combos
		saveCombo = {
			keys:'ctrl s',
			is_sequence:true
		};

		quitCombo = {
			is_exclusive:true
		};

		// override config from directives
		s.configuredCombos = {
			mySection:{
				save:saveCombo,
				quit:quitCombo
			}
		};

		// existing section with only configured listeners
		s.getConfiguredCombosFromSettings('mySection', {
			save:{
				on_keyup:sinon.stub()
			}
		}, function (c) {
			combos = c;
			// it only contains 'save' not 'quit'
			expect(combos.length).toBe(1);
			expect(combos[0].keys).toEqual('s');
			expect(combos[0].on_keyup).toBeDefined();
			// it persists properties which are not defined by settings
			expect(combos[0].is_sequence).toBeTruthy();
		});
	});

});


