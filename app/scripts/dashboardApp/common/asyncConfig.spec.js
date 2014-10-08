'use strict';

describe('Service: AsyncConfig', function () {
	var s, appSettingsService, AsyncConfig, MyClass;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, AppSettings) {
		appSettingsService = AppSettings;
		sinon.stub(AppSettings, 'load', function (cb) {
			cb({
				foo: 'bar'
			});
		});

		AsyncConfig = $injector.get('AsyncConfig');
		MyClass = stampit().methods({
			updateConfig: function (settings) {
				this.config = {
					bar: settings.foo
				};
			}
		});
		s = stampit.compose(AsyncConfig, MyClass).create();
	}));

	afterEach(inject(function (AppSettings) {
		s.config = null;
		AppSettings.load.restore();
	}));

	it('config is null when not loaded', function () {
		expect(s.config).toEqual(null);
	});

	it('loads config on "get" when config not loaded already.', function () {
		expect(s.config).toEqual(null);

		s.getConfig(function () {
			expect(s.config).toEqual({
				bar: 'bar'
			});
		});
	});

	it('resets config when settings are saved.', function () {
		expect(s.config).toEqual(null);

		// init by hand
		s.updateConfig({
			foo: 'baz'
		});

		expect(s.config).toEqual({
			bar: 'baz'
		});

		appSettingsService.fireEvent('save');

		expect(s.config).toEqual(null);
	});

});
