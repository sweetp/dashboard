/* jshint -W079 */
'use strict';

var chrome;

describe('Service: Notifications', function () {
	var s, appSettingsService;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function ($injector, AppSettings) {
		// mock chrome API
		(function () {
			/* jshint -W020 */
			chrome = {
				runtime:{
					getURL:function (value) {
						return value;
					}
				},
				notifications:{
					create:function () {}
				}
			};
		})();

		appSettingsService = AppSettings;
		sinon.stub(AppSettings, 'load', function (cb) {
			cb({
				standardNotificationDismissDelay:1234
			});
		});

		s = $injector.get('Notifications');
	}));

	afterEach(inject(function(AppSettings) {
		// remove mocked api
		(function () {
			/* jshint -W020 */
			chrome = undefined;
		})();
		AppSettings.load.restore();
	}));

	it('configures some standard icons.', function () {
		expect(s.icons).toBeDefined();
	});

	it('uses settings to build its config from.', function () {
		expect(s.config).toEqual(null);

		s.withConfig(sinon.spy());

		waitsFor(function () {
			return s.config !== null;
		});

		runs(function () {
			expect(s.config).toEqual({
				standardDismissDelay:1234
			});
		});
	});

	it('can create basic notifications.', function () {
		var args, cbId;

		chrome.notifications.create = function (id, options, cb) {
			args = arguments;
			// do same what chrome would do
			cb(id);
		};

		// test without icon
		s.createBasicNotification({
			title:'my title',
			message:'message text',
			dismissDelay:-1
		}, function (err, id) {
			cbId = id;
		});

		waitsFor(function () {
			return args !== undefined && cbId !== undefined;
		});

		runs(function () {
			expect(args[0]).toEqual('0');
			expect(args[1]).toEqual({
				title:'my title',
				message:'message text',
				// icon url is set, this is required for chrome
				iconUrl:s.icons.info,
				// html5 notification, not chrome rich notification (isn't
				// supported under Linux *shakes fists*)
				type:'basic'
				// dismiss delay gots removed because it is not a chrome option
			});

			// id of create arg should be the same as id passed to callback
			expect(cbId).toEqual(args[0]);

			args = undefined;
			cbId = undefined;
		});

		// test with standard icon
		runs(function () {
			s.createBasicNotification({
				title:'my title',
				message:'message text',
				dismissDelay:-1,
				iconUrl:s.icons.danger
			}, function (err, id) {
				cbId = id;
			});
		});

		waitsFor(function () {
			return args !== undefined && cbId !== undefined;
		});

		runs(function () {
			expect(args[0]).toEqual('1');
			expect(args[1].iconUrl).toEqual(s.icons.danger);

			args = undefined;
			cbId = undefined;
		});

		// test with custom icon
		runs(function () {
			s.createBasicNotification({
				title:'my title',
				message:'message text',
				dismissDelay:-1,
				iconUrl:'foo/bar'
			}, function (err, id) {
				cbId = id;
			});
		});

		waitsFor(function () {
			return args !== undefined && cbId !== undefined;
		});

		runs(function () {
			expect(args[0]).toEqual('2');
			expect(args[1].iconUrl).toEqual('foo/bar');

			// reset mock
			chrome.notifications.create = function () {};
		});
	});

});


