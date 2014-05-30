'use strict';

describe('Controller: ProjectMain', function () {
	var $scope, $rootScope, createController, sweetpService, keys;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, Sweetp, KeyboardShortcutsFromSettings) {
		var $controller;

		sweetpService = Sweetp;
		keys = KeyboardShortcutsFromSettings;

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

			keys.getConfiguredCombosFromSettings = sinon.stub();
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

	it('adds keyboard shortcuts.', function () {
		keys.getConfiguredCombosFromSettings = function (sectionKey, config) {
			expect(sectionKey).toBe('viewProject');

			// one to start commit
			//expect(config.commit.on_keydown).toBe($scope.openCommitWindow);

			// one to reload widgets
			expect(config.reload.on_keydown).toBe($scope.reload);
		};
		createController();
	});
});

