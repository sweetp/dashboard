'use strict';

angular.module('dashboardApp').factory('AppSettings', function() {
    return {
        load:function () {
            return {
                serverUrl:"http://localhost:7777/"
            };
        },
        save:function () {
        }
    };
});


