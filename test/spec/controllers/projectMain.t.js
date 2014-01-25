'use strict';

describe('Controller: ProjectMain', function () {
	var $scope, $rootScope, createController, sweetpService;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, Sweetp) {
		var $controller;

		sweetpService = Sweetp;

		$rootScope = $injector.get('$rootScope');
		$scope = $rootScope.$new();

		$controller = $injector.get('$controller');
		createController = function () {
			return $controller('ProjectMainCtrl', {
				'$scope': $scope
			});
		};
	}));

	it('saves alread loaded project config in scope after creation.', function () {
		var c;

		runs(function () {
			sinon.stub(sweetpService, 'isProjectLoaded').returns(true);
			sinon.stub(sweetpService, 'getProjectConfig').returns({
				name:'foo'
			});
			c = createController();
		});

		waitsFor(function () {
			return $scope.project;
		});

		runs(function () {
			expect($scope.project.name).toBe('foo');

			// reset
			sweetpService.isProjectLoaded.restore();
			sweetpService.getProjectConfig.restore();
		});
	});

	it('loads projects when project config not loaded already.', function () {
		var c;

		runs(function () {
			sinon.stub(sweetpService, 'isProjectLoaded').returns(false);
			sinon.stub(sweetpService, 'loadProjects', function (cb) {
				return cb();
			});
			sinon.stub(sweetpService, 'getProjectConfig').returns({
				name:'foo'
			});
			c = createController();
		});

		waitsFor(function () {
			return $scope.project;
		});

		runs(function () {
			expect($scope.project.name).toBe('foo');
			expect(sweetpService.loadProjects).toHaveBeenCalledOnce();

			// reset
			sweetpService.loadProjects.restore();
			sweetpService.isProjectLoaded.restore();
			sweetpService.getProjectConfig.restore();
		});
	});
});

