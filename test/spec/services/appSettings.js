'use strict';

describe('Service: AppSettings', function () {
  var s;

  // load the controller's module
  beforeEach(module('dashboardApp'));

  // Initialize the controller and a mock scope
  beforeEach(inject(function (AppSettings) {
      s = AppSettings;
  }));

  it('loads saved or default settings.', function () {
    expect(s.load()).toEqual({
		serverUrl:"http://localhost:7777/"
    });
  });
});

