'use strict';

describe('Directive: spKeyboardShortcutsSettings', function () {
	var el, scope, directiveScope, timeout;

	// load the controller's module
	beforeEach(module('keyboardShortcuts', function (KeyboardShortcutsProvider) {
		var saveCombo, quitCombo, p;
		p = KeyboardShortcutsProvider;

		// create test combos
		saveCombo = {
			keys: "ctrl s",
			is_sequence: true
		};

		quitCombo = {
			keys: "ctrl q",
			is_exclusive: true
		};

		// add combos to provider at configuration time
		p.addCombos('mySection', 'description', {
			save: _.clone(saveCombo),
			quit: _.clone(quitCombo)
		});
	}));

	beforeEach(module('scripts/keyboardShortcuts/spKeyboardShortcutsSettings.template.html'));

	beforeEach(inject(function ($rootScope, $compile, $timeout) {
		el = angular.element('<sp-keyboard-shortcuts-settings settings="foo"></sp-keyboard-shortcuts-settings>');

		scope = $rootScope;
		scope.foo = {
			mySection: {
				load: {
					keys: 'l'
				}
			}
		};
		$compile(el)(scope);
		scope.$digest();
		directiveScope = el.isolateScope();
		timeout = $timeout;
	}));

	it('should apply section descriptions to scope.', function () {
		expect(directiveScope.sections.mySection).toBe('description');
	});

	it('should apply configured combo settings as defaults to provided settings.', function () {
		expect(directiveScope.settings.mySection.save.keys).toBe('ctrl s');
		expect(directiveScope.settings.mySection.quit.keys).toBe('ctrl q');
		expect(directiveScope.settings.mySection.load.keys).toBe('l');

		// change provided settings, e.g. user changed this
		scope.foo.mySection.save.keys = 's';
		scope.$digest();

		expect(directiveScope.settings.mySection.save.keys).toBe('s');
		expect(directiveScope.settings.mySection.load.keys).toBe('l');
		expect(directiveScope.settings.mySection.quit.keys).toBe('ctrl q');

		// delete a setting
		delete scope.foo.mySection.load;
		scope.$digest();

		expect(directiveScope.settings.mySection.save.keys).toBe('s');
		expect(directiveScope.settings.mySection.load).toBeUndefined();
		expect(directiveScope.settings.mySection.quit.keys).toBe('ctrl q');
	});
});
