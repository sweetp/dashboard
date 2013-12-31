'use strict';

describe('Service: Sweetp', function () {
	var s;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (Sweetp, AppSettings) {
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
		expect(s.config).toEqual(null);

		s.getConfig(function () {});

		waitsFor(function () {
			return s.config !== null;
		});

		runs(function() {
			expect(s.config).toEqual({
				urls:{
					projectConfigs:'http://localhost/configs'
				}
			});
		});

	});
});

