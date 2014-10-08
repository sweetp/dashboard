'use strict';

describe('Service: Sweetp', function () {
	var s, appSettingsService, $httpBackend, fakeConfigs;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, Sweetp, AppSettings) {
		s = Sweetp;
		appSettingsService = AppSettings;
		sinon.stub(AppSettings, 'load', function (cb) {
			cb({
				serverUrl: "http://localhost/"
			});
		});

		// Set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');

		// setup fake backend to respond with example configs
		fakeConfigs = {
			foo: {
				name: 'foo',
				dir: 'bar'
			}
		};
		$httpBackend.when('GET', 'http://localhost/configs').respond(fakeConfigs, {});
	}));

	afterEach(inject(function (AppSettings) {
		s.config = null;
		AppSettings.load.restore();
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}));

	it('config is null when not loaded', function () {
		expect(s.config).toEqual(null);
	});

	it('updates config with provided settings, and ignores unknown ones.', function () {
		expect(s.config).toEqual(null);

		s.updateConfig({
			serverUrl: 'foo/',
			bar: 'fooooo'
		});

		expect(s.config).toEqual({
			urls: {
				projectConfigs: 'foo/configs',
				services: 'foo/services/'
			}
		});
	});

	it("loads project configs from sweetp server, when config isn't set and after config was build from settings.", function () {
		$httpBackend.expectGET('http://localhost/configs');

		// call method under test
		s.loadProjects(function (err, loadedConfigs) {
			expect(err).toEqual(null);
			expect(loadedConfigs).toEqual(fakeConfigs);
		});

		// mark XHR call as fullfilled
		$httpBackend.flush();

		// try the same again when config was already loaded
		expect(s.config).not.toEqual(null);

		$httpBackend.expectGET('http://localhost/configs');

		// call method under test
		s.loadProjects(function (err, loadedConfigs) {
			expect(err).toEqual(null);
			expect(loadedConfigs).toEqual(fakeConfigs);
		});

		// mark XHR call as fullfilled
		$httpBackend.flush();
	});

	it("has a method to check whether projects are loaded already.", function () {
		expect(s.areProjectsLoaded()).toBe(false);

		$httpBackend.expectGET('http://localhost/configs');

		// call method under test
		s.loadProjects(function (err) {
			expect(err).toEqual(null);
			expect(s.areProjectsLoaded()).toBe(true);
		});

		// mark XHR call as fullfilled
		$httpBackend.flush();
	});

	it('has a method to check whether a project is loaded already.', function () {
		expect(s.isProjectLoaded('foo')).toBe(false);

		$httpBackend.expectGET('http://localhost/configs');

		// call method under test
		s.loadProjects(function (err) {
			expect(err).toEqual(null);
			expect(s.isProjectLoaded('foo')).toBe(true);
		});

		// mark XHR call as fullfilled
		$httpBackend.flush();
	});

	it('can give project config for project name.', function () {
		var loadedConfigs;

		expect(s.getProjectConfig('foo')).toBe(null);

		$httpBackend.expectGET('http://localhost/configs');

		// call method under test
		s.loadProjects(function (err, configs) {
			expect(err).toEqual(null);
			loadedConfigs = configs;

			expect(s.getProjectConfig('foo')).not.toBe(null);
			expect(s.getProjectConfig('foo').dir).toBe('bar');
		});

		// mark XHR call as fullfilled
		$httpBackend.flush();
	});

	it("can call a service, but not without project name.", function () {
		s.callService(null, null, null, function (error, data, status) {
			expect(error).toContain("project name");
			expect(data).toBeUndefined();
			expect(status).toBeUndefined();
		});
	});

	it("can call a service, but not without path to service.", function () {
		s.callService('projectName', null, null, function (error, data, status) {
			expect(error).toContain("path");
			expect(data).toBeUndefined();
			expect(status).toBeUndefined();
		});
	});

	it("handles server errors during service call.", function () {
		var fakeData;

		fakeData = {
			target: '/services/projectName/service/path',
			query: null,
			service: 'error message from service'
		};

		$httpBackend.expectGET('http://localhost/services/projectName/service/path')
			.respond(500, fakeData);

		// call method under test
		s.callService('projectName', 'service/path', null, function (error, data, status) {
			expect(error).contains("error occured");
			expect(data).toEqual(fakeData);
			expect(status).toEqual(500);
		});

		// mark XHR call as fullfilled
		$httpBackend.flush();
	});

	it("can call a service.", function () {
		var fakeData;

		fakeData = {
			target: '/services/projectName/service/path',
			query: null,
			service: 'output'
		};

		$httpBackend.expectGET('http://localhost/services/projectName/service/path')
			.respond(200, fakeData);

		// call method under test
		s.callService('projectName', 'service/path', null, function (error, data, status) {
			expect(error).toEqual(null);
			expect(data).toEqual(fakeData);
			expect(status).toEqual(200);
		});

		// mark XHR call as fullfilled
		$httpBackend.flush();
	});
});
