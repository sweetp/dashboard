'use strict';

describe('Service: KeyboardShortcuts', function () {
	var s, p;

	// load the controller's module
	beforeEach(module('keyboardShortcuts', function (KeyboardShortcutsProvider) {
		p = KeyboardShortcutsProvider;
	}));

	beforeEach(inject(function (KeyboardShortcuts) {
        s = KeyboardShortcuts.create();
	}));

	it('can apply scope after event listener was called.', function () {
		var combos, o, $scope;

		o = {
			foo:null
		};

		combos = [{
			on_keydown:function () {
				o.foo = 'bar';
			}
		}, {
			on_keyup:function () {
				o.foo = 'baz';
			}
		}];

		$scope = {
			$apply:sinon.stub()
		};

		s.applyScopeTo($scope, combos);

		combos[0].on_keydown();
		expect(o.foo).toEqual('bar');
		expect($scope.$apply).toHaveBeenCalledOnce();

		combos[1].on_keyup();
		expect(o.foo).toEqual('baz');
		expect($scope.$apply).toHaveBeenCalledTwice();
	});

	it('is able to add combos add configuration time.', inject(function ($window) {
		var saveCombo, quitCombo;

		// create test combos
		saveCombo = {
			keys:"ctrl s",
			is_sequence:true
		};

		quitCombo = {
			keys:"ctrl q",
			is_exclusive:true
		};

		// add combos to provider at configuration time
		p.addCombos('mySection', 'description', {
			save:_.clone(saveCombo),
			quit:_.clone(quitCombo)
		});

		// instantiate service by provider
		s = p.$get($window).create();
		expect(s.configuredCombos.mySection.save).toEqual(saveCombo);
		expect(s.configuredCombos.mySection.quit).toEqual(quitCombo);

		expect(s.sectionDescriptions.mySection).toEqual('description');
	}));

	it('can attach listeners to configured keys.', inject(function ($window) {
		var saveCombo, quitCombo, loadCombo, $log, combos;

		// stub log
		$log = {
			error:sinon.stub()
		};

		// create test combos
		saveCombo = {
			keys:"ctrl s",
			is_sequence:true
		};

		quitCombo = {
			keys:"ctrl q",
			is_exclusive:true
		};

		loadCombo = {
			keys:'ctrl l',
			on_keydown:sinon.stub()
		};

		// add combos to provider at configuration time
		p.addCombos('mySection', 'description', {
			save:saveCombo,
			quit:quitCombo
		});

		// instantiate service by provider
		s = p.$get($window, $log).create();

		// give nothing, get nothing
		combos = s.getConfiguredCombos();
		expect($log.error.callCount).toEqual(0);
		expect(combos).toEqual([]);
		$log.error.reset();

		// not existing section logs error
		combos = s.getConfiguredCombos(null, {
			save:{
				on_keydown:sinon.stub()
			}
		});
		expect($log.error).toHaveBeenCalledOnce();
		expect(combos).toEqual([]);
		$log.error.reset();

		combos = s.getConfiguredCombos('string but still not existing', {
			save:{
				on_keydown:sinon.stub()
			}
		});
		expect($log.error).toHaveBeenCalledOnce();
		expect(combos).toEqual([]);
		$log.error.reset();

		// existing section with some configured and some not configured listeners
		combos = s.getConfiguredCombos('mySection', {
			save:{
				on_keydown:sinon.stub()
			},
			load:loadCombo
		});
		expect($log.error).toHaveBeenCalledOnce();
		expect(combos.length).toBe(1);
		expect(combos[0].keys).toEqual('ctrl s');
		expect(combos[0].on_keydown).toBeDefined();
		$log.error.reset();

		// existing section with only configured listeners
		combos = s.getConfiguredCombos('mySection', {
			save:{
				on_keyup:sinon.stub()
			}
		});
		expect($log.error.callCount).toEqual(0);
		expect(combos.length).toBe(1);
		expect(combos[0].keys).toEqual('ctrl s');
		expect(combos[0].on_keyup).toBeDefined();
		$log.error.reset();
	}));
});


