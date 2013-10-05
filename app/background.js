chrome.app.runtime.onLaunched.addListener(function() {
    chrome.app.window.create('index.html', {
        bounds: {
            left: 60,
            top: 60,
            width: 800,
            height: 600
        }
    });
});
