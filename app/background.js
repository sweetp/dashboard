chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
	var response;

	response = {
		state:'ok'
	};

	switch(message.name) {
		case 'notification-dismiss':
			setTimeout(function () {
				chrome.notifications.clear(message.notificationId, function () {});
			}, message.delay);
			sendResponse(response);
			break;

		default:
			console.error(message);
			throw new Error('Unknown message!');
	}
});

chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        bounds: {
            left: 60,
            top: 60,
            width: 800,
            height: 600
        }
    }, function (mainWindow) {
		// close all windows when main window gets closed
		mainWindow.onClosed.addListener(function () {
			chrome.app.window.getAll().forEach(function(win) {
				win.close();
			});
		});
	});
});
