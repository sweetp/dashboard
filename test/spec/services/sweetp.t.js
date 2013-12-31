'use strict';

describe('Service: Sweetp', function () {
	var s;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, Sweetp, AppSettings) {
		s = Sweetp;
		sinon.stub(AppSettings, 'load', function (cb) {
			cb({
				serverUrl:"http://localhost/"
			});
		});
	}));

	afterEach(inject(function(AppSettings) {
		s.config = null;
		AppSettings.load.restore();
	}));

	it('config is null when not loaded', function () {
		expect(s.config).toEqual(null);
	});

	it('updates config with provided settings, and ignores unknown ones.', function () {
		expect(s.config).toEqual(null);

		s.updateConfig({
			serverUrl:'foo/',
			bar:'fooooo'
		});

		expect(s.config).toEqual({
			urls:{
				projectConfigs:'foo/configs'
			}
		});
	});

	it('loads config on "get" when config not loaded already.', function () {
		var spy;
		expect(s.config).toEqual(null);

		spy = sinon.spy();
		s.getConfig(spy);

		waitsFor(function () {
			return s.config !== null;
		});

		runs(function() {
			expect(s.config).toEqual({
				urls:{
					projectConfigs:'http://localhost/configs'
				}
			});
			expect(spy).toHaveBeenCalledOnce();
		});

	});

	describe('loads project configs from sweetp server,', function () {
		var $httpBackend, fakeConfigs;

		beforeEach(inject(function ($injector) {
			// Set up the mock http service responses
			$httpBackend = $injector.get('$httpBackend');

			// setup fake backend to respond with example configs
			fakeConfigs = {
				foo:{
					name:'foo',
					dir:'bar'
				}
			};
			$httpBackend.when('GET', 'http://localhost/configs').respond(fakeConfigs, {});
		}));

		afterEach(inject(function() {
			$httpBackend.verifyNoOutstandingExpectation();
			$httpBackend.verifyNoOutstandingRequest();
		}));

		it("when config isn't set and after config was loaded build from settings.", function () {
			var loadedConfigs;

			$httpBackend.expectGET('http://localhost/configs');

			// call method under test
			s.loadProjects(function(err, configs) {
				expect(err).toEqual(null);
				loadedConfigs = configs;
			});

			// mark XHR call as fullfilled
			$httpBackend.flush();

			// wait for configs loaded
			waitsFor(function () {
				return loadedConfigs !== undefined;
			});

			runs(function() {
				expect(loadedConfigs).toEqual(fakeConfigs);
				loadedConfigs = undefined;

				// try the same again when config was already loaded
				expect(s.config).not.toEqual(null);

				$httpBackend.expectGET('http://localhost/configs');

				// call method under test
				s.loadProjects(function(err, configs) {
					expect(err).toEqual(null);
					loadedConfigs = configs;
				});

				// mark XHR call as fullfilled
				$httpBackend.flush();

			});

			// wait for configs loaded
			waitsFor(function () {
				return loadedConfigs !== undefined;
			});

			runs(function() {
				expect(loadedConfigs).toEqual(fakeConfigs);
			});

		});

	});
});

