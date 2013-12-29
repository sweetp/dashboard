'use strict';

angular.module('dashboardApp').factory('AppSettings', function() {
    return {
        load:function (callback) {
            chrome.storage.local.get('app.settings', function (data) {
                if (!data) {
                    data = {
                        serverUrl:"http://localhost:7777/"
                    };
                }

                callback(null, data);
            });
        },
        save:function (settings, callback) {
            chrome.storage.local.set({'app.settings': settings}, function () {
                callback(null);
            });
        }
    };
});


