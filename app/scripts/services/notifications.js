'use strict';

angular.module('dashboardApp').factory('Notifications', function (AsyncConfig, $log) {
	var Notifications, instance, icons;

	Notifications = stampit({
		updateConfig:function (settings) {
			this.config = {
				standardDismissDelay:settings.standardNotificationDismissDelay
			};
		},

		/**
		 * Create basic notification.
		 *
		 * @param {Object} optionsParam
		 * @param {String} optionsParam.titel
		 * @param {String} optionsParam.message
		 * @param {Number} [optionsParam.dismissDelay] in milliseconds. Clear
		 * this notification after this time. If missing, standard dismiss time
		 * is used. Supress auto dismiss with zero as value.
		 * @param {String} [options.iconUrl] to use. If missing, info icon is
		 * used. Get standard icons from this class.
		 * @param {Function} [cb]
		 * @param {Object} cb.err
		 * @param {String} cb.id of the created notification
		 */
		createBasicNotification:function (optionsParam, cb) {
			this.withConfig(function (err, config) {
				var options, dismissDelay;
				if (err) {
					$log.error(err);
					cb(err);
					return;
				}

				options = _.cloneDeep(optionsParam);
				options.type = 'basic';

				// chrome notifications need a icon!
				if (!options.iconUrl) {
					options.iconUrl = this.icons.info;
				}

				// set auto dismiss time
				if (_.isNumber(options.dismissDelay)) {
					dismissDelay = options.dismissDelay;
					delete options.dismissDelay;
				} else {
					dismissDelay = config.standardDismissDelay;
				}

				// create notification and show it
				chrome.notifications.create(this.getNextId(), options, function (id) {
					if (dismissDelay > 0) {
						setTimeout(function () {
							chrome.notifications.clear(id, function () {});
						}, dismissDelay);
					}

					if (cb) {
						cb(null, id);
					}
				});
			});
		}
    });

	icons = {};
	_.forOwn({
		info:'images/knobInfo.png',
		success:'images/knobValidGreen.png',
		warning:'images/knobAttention.png',
		danger:'images/knobCancel.png'
	}, function (value, key) {
		icons[key] = chrome.runtime.getURL(value);
	});

	Notifications.state({
		icons:icons
	});

	// ensure unique id for notifications
	Notifications.enclose(function () {
		var id;

		id = 0;

		this.getNextId = function () {
			return (id++).toString();
		};
	});

	instance = stampit.compose(AsyncConfig, Notifications).create();

	return instance;
});


