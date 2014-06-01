'use strict';

describe('Service: Observable', function () {
	var s, log;

	// load the controller's module
	beforeEach(module('dashboardApp'));

	// Initialize the controller and a mock scope
	beforeEach(inject(function (Observable, $log) {
		log = $log;
        s = Observable.create();
	}));

	it("fails when methods invoked and event not exists.", function () {
		sinon.spy(log, 'error');

		s.fireEvent('foo');
		expect(log.error.calledOnce).toBe(true);
		log.error.reset();

		s.on('foo', sinon.spy());
		expect(log.error.calledOnce).toBe(true);
		log.error.reset();

		s.un('foo', sinon.spy());
		expect(log.error.calledOnce).toBe(true);
		log.error.reset();

		log.error.restore();
	});

	it("can subscribe, fire, unsubscribe an event.", function () {
		var handler;

		s.addEvents([
			'foo'
		]);

		handler = sinon.spy();

		s.on('foo', handler);
		expect(handler.callCount).toBe(0);

		s.fireEvent('foo');
		expect(handler.calledOnce).toBe(true);
		handler.reset();

		s.un('foo', handler);
		expect(handler.callCount).toBe(0);
		s.fireEvent('foo');
		expect(handler.callCount).toBe(0);
	});

});



