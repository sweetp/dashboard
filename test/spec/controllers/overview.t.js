'use strict';

describe('Controller: Overview', function () {
	var $scope, $rootScope, createController, sweetpService, appSettingsService;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, Sweetp, AppSettings) {
		var $controller;

		appSettingsService = AppSettings;
		sweetpService = Sweetp;
		sinon.stub(AppSettings, 'load', function (cb) {
			cb({
				foo:'bar'
			});
		});

		$rootScope = $injector.get('$rootScope');
		$scope = $rootScope.$new();

		$controller = $injector.get('$controller');
		createController = function () {
			return $controller('OverviewCtrl', {
				'$scope': $scope
			});
		};
	}));

	it('can load/reload projects from Sweetp server.', function () {
		var c;

		runs(function () {
			sinon.stub(sweetpService, 'loadProjects', function (cb) {
				// scope variables not set yet, test initial values
				expect($scope.projectsLoaded).toBe(false);
				expect($scope.projects).toBe(null);

				// call callback to set properties
				cb(null, [{
					name:"fooproject"
				}]);
			});

			c = createController();
		});

		waitsFor(function () {
			return $scope.projectsLoaded === true;
		});

		runs(function () {
			expect($scope.projects.length).toBe(1);

			// reset
			sweetpService.loadProjects.restore();
		});
	});

	it('can handle errors during loading of projects.', function () {
		var c;

		runs(function () {
			sinon.stub(sweetpService, 'loadProjects', function (cb) {
				var msg;

				// scope variables not set yet, test initial values
				expect($scope.projectsLoaded).toBe(false);
				expect($scope.projects).toBe(null);

				// call callback with error
				msg = 'uh oh';
				expect(function () {
					cb(msg);
				}).toThrow(new Error(msg));
			});

			c = createController();
		});

		waitsFor(function () {
			return $scope.projectsLoaded === true;
		});

		runs(function () {
			expect($scope.projects).toBe(null);

			// reset
			sweetpService.loadProjects.restore();
		});
	});

	it('reloads projects when app settings saved.', function () {
		var c;

		runs(function () {
			sinon.stub(sweetpService, 'loadProjects', function (cb) {
				// call callback to set properties
				cb(null, [{
					name:"fooproject"
				}]);
			});

			c = createController();
		});

		waitsFor(function () {
			return $scope.projectsLoaded === true;
		});

		runs(function () {
			// initial projects loaded
			expect($scope.projects[0].name).toBe("fooproject");

			// change project name
			sweetpService.loadProjects.restore();
			sinon.stub(sweetpService, 'loadProjects', function (cb) {
				cb(null, [{
					name:"barproject"
				}, {
					name:"bazproject"
				}]);
			});

			// fire save event
			appSettingsService.fireEvent('save');
		});

		waitsFor(function () {
			return $scope.projects &&
				$scope.projects.length > 1;
		});

		runs(function () {
			// new project loaded
			expect($scope.projects[0].name).toBe("barproject");

			sweetpService.loadProjects.restore();
		});
	});

	it('loads settings on startup.', function () {
		var c;

		runs(function () {
			c = createController();
		});

		waitsFor(function () {
			return $scope.settings;
		});

		runs(function () {
			expect($scope.settings.foo).toBe('bar');
		});
	});

	it('save settings when form is valid.', function () {
		var c;

		runs(function () {
			c = createController();
		});

		waitsFor(function () {
			return $scope.settings;
		});

		runs(function () {
			$scope.settingsForm = {
				$valid: false
			};
			sinon.stub(appSettingsService, 'save');

			// save method not called when form isn't valid
			$scope.saveSettings();
			expect(appSettingsService.save.callCount).toBe(0);

			// check happy case
			$scope.settingsForm.$valid = true;

			$scope.saveSettings();
			expect(appSettingsService.save).toHaveBeenCalledOnce();
		});
	});
});

