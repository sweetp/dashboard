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
