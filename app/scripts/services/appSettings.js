'use strict';

angular.module('dashboardApp').factory('AppSettings', function() {
    var key;

    key = "app.settings";
    return {
        load:function (callback) {
            chrome.storage.local.get(key, function (data) {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError.message);
                }

                if (!data || !data[key]) {
                    data = {};
                    data[key] = {
                        serverUrl:"http://localhost:7777/"
                    };
                }

                callback(data[key]);
            });
        },
        save:function (settings, callback) {
            var data;
            data = {};
            data[key] = settings;
            chrome.storage.local.set(data, function () {
                if (chrome.runtime.lastError) {
                    throw new Error(chrome.runtime.lastError.message);
                }

                callback();
            });
        }
    };
});


