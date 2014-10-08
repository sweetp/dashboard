'use strict';

describe('Directive: spErrorList', function () {
	var el, scope;

	// load the controller's module
	beforeEach(module('dashboardApp'));
	beforeEach(module('scripts/dashboardApp/common/spErrorList.template.html'));

	beforeEach(inject(function ($rootScope, $compile) {
		el = angular.element('<sp-error-list error-message="My Error Message:">content</sp-error-list>');

		scope = $rootScope;
		scope.state = {};
		$compile(el)(scope);
		scope.$digest();
	}));

	it('should show content when no error is in state model.', function () {
		expect(el).toContainText('content');
	});
});
