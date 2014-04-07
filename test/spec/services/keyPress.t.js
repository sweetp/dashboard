'use strict';

describe('Service: KeyPress', function () {
	var s;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (KeyPress) {
        s = KeyPress;
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
});


