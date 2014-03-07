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

	it('loads saved or default settings.', function () {
		var loadedData, saveSpy;

        // loads default
        s.load(function (data) {
            loadedData = data;
        });

        waitsFor(function () {
            return loadedData !== undefined;
        });

        runs(function () {
            expect(loadedData).toEqual({
                serverUrl:"http://localhost:7777/",
				standardNotificationDismissDelay:3000
            });
            loadedData = undefined;

            // save something
			saveSpy = sinon.spy();
            s.save({
                serverUrl:"foo"
            }, saveSpy);

        });

        runs(function () {
            // callback of 'save' call was called
            expect(saveSpy).toHaveBeenCalledOnce();

            // loads changed settings
            s.load(function (data) {
                loadedData = data;
            });
        });

        waitsFor(function () {
            return loadedData !== undefined;
        });

        runs(function () {
            expect(loadedData).toEqual({
                serverUrl:"foo"
            });
        });
	});
});

