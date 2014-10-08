// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function (config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: 'app/',

		// testing framework to use (jasmine/mocha/qunit/...)
		frameworks: ['jasmine'],

		// list of files / patterns to load in the browser
		files: [
			'bower_components/lodash/dist/lodash.js',
			'bower_components/stampit/dist/stampit.js',
			'bower_components/angular/angular.js',
			'bower_components/angular-route/angular-route.js',
			'bower_components/angular-mocks/angular-mocks.js',
			'bower_components/sinonjs/sinon.js',
			'bower_components/jquery/jquery.js',
			'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
			'scripts/**/*.js',
			'scripts/**/*.template.html'
		],

		preprocessors: {
			// only test services, controllers and directives are under heavy development
			//'scripts/**/*.service.js':'coverage',
			// keyboard shortcuts module is very stable, test all
			'scripts/keyboardShortcuts/*.directive.js': 'coverage',
			// common directives should be stable, test all
			'scripts/dashboardApp/common/*.directive.js': 'coverage',
			'scripts/keyboardShortcuts/*.crtl.js': 'coverage',
			'scripts/**/*.template.html': 'ng-html2js'
		},

		coverageReporter: {
			type: 'html',
			dir: 'coverage/'
		},

		reporters: ['progress', 'coverage'],

		// list of files / patterns to exclude
		exclude: [],

		// web server port
		port: 8080,

		// level of logging
		// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: false,


		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['Chrome'],


		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};
