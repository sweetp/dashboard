/* jshint -W079 */
'use strict';

var chrome;

describe('Service: AppSettings', function () {
	var s;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (AppSettings) {
        s = AppSettings;

		// mock chrome storage API
		(function () {
			/* jshint -W020 */
			chrome = {
				runtime:{
					lastError:null
				},
				storage:{
					local:{
						store:{},
						get:function (key, cb) {
							var data;

							data = {};
							if (this.store[key]) {
								data[key] = this.store[key];
							}
							cb(data);
						},
						set:function (store, cb) {
							this.store = store;
							cb();
						}
					}
				}
			};
		})();

	}));

	afterEach(function() {
		// remove mocked api
		(function () {
			/* jshint -W020 */
			chrome = undefined;
		})();
	});

	it('loads saved or default settings.', function (done) {
		var saveSpy;

        // loads default
        s.load(function (loadedData) {
            expect(loadedData).toEqual({
                serverUrl:"http://localhost:7777/",
				standardNotificationDismissDelay:3000,
				keyboardShortcuts:{}
            });

            // save something
			saveSpy = sinon.spy();
            s.save({
                serverUrl:"foo"
            }, saveSpy);

            // callback of 'save' call was called
            expect(saveSpy.calledOnce).toBe(true);

            // loads changed settings
            s.load(function (loadedData) {
				expect(loadedData).toEqual({
					serverUrl:"foo",
					standardNotificationDismissDelay:3000,
					keyboardShortcuts:{}
				});

				done();
            });
        });
	});
});

