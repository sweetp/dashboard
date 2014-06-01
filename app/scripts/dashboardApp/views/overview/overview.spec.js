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

	it('can load/reload projects from Sweetp server.', function (done) {
		var c;

		sinon.stub(sweetpService, 'loadProjects', function (cb) {
			// scope variables not set yet, test initial values
			expect($scope.projects.loaded).toBe(false);
			expect($scope.projects.list).toBe(null);

			// call callback to set properties
			cb(null, [{
				name:"fooproject"
			}]);

			// now projects are loaded
			expect($scope.projects.list.length).toBe(1);

			// reset
			sweetpService.loadProjects.restore();

			done();
		});

		c = createController();
	});

	it('can handle errors during loading of projects.', function (done) {
		var c;

		sinon.stub(sweetpService, 'loadProjects', function (cb) {
			var msg;

			// scope variables not set yet, test initial values
			expect($scope.projects.loaded).toBe(false);
			expect($scope.projects.list).toBe(null);

			// call callback with error
			msg = 'uh oh';
			expect(function () {
				cb(msg);
			}).toThrow(new Error(msg));

			expect($scope.projects.list).toBe(null);

			// reset
			sweetpService.loadProjects.restore();

			done();
		});

		c = createController();
	});

	it('reloads projects when app settings saved.', function (done) {
		var c;

		sinon.stub(sweetpService, 'loadProjects', function (cb) {
			// call callback to set properties
			cb(null, [{
				name:"fooproject"
			}]);

			// initial projects loaded
			expect($scope.projects.list[0].name).toBe("fooproject");
		});

		c = createController();

		// now projects stubbed above are loaded into scope and controller
		// listens to app settings changes

		sweetpService.loadProjects.restore();
		sinon.stub(sweetpService, 'loadProjects', function (cb) {
			// return other projects
			cb(null, [{
				name:"barproject"
			}, {
				name:"bazproject"
			}]);

			// new project loaded
			expect($scope.projects.list[0].name).toBe("barproject");

			sweetpService.loadProjects.restore();

			done();
		});

		// fire save event
		appSettingsService.fireEvent('save');
	});

	it('loads settings on startup.', function () {
		var c;

		c = createController();

		expect($scope.settings.foo).toBe('bar');
	});

	it('save settings when form is valid.', function () {
		var c;

		c = createController();

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
		expect(appSettingsService.save.calledOnce).toBe(true);
	});
});

