const webpackConfig = require('./webpack.config.js');

module.exports = (config) => {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        browsers: ['jsdom'],
        browserNoActivityTimeout: 100000,
        autoWatch: false,
        singleRun: true,
        files: [
            {pattern: 'node_modules/moment/min/moment.min.js', watched: false},
            {pattern: 'node_modules/q/q.js', watched: false},
            {pattern: 'dist/appointment.js', watched: false},
            {pattern: 'node_modules/angular-mocks/angular-mocks.js', watched: false},

            {pattern: 'test/ng-test-constants.js', watched: false},
            {pattern: 'test/support/*.js', watched: false},
            {pattern: 'test/**/*spec.js', watched: false},
        ],
        reporters: ['junit', 'progress', 'coverage'],
        preprocessors: {
            'dist/appointment.js': ['coverage'],
        },
        coverageReporter: {
            reporters: [
                {type: 'json', dir: 'coverage/'},
                {type: 'html', dir: 'coverage/'},
                {type: 'text-summary'}
            ]
        },
        junitReporter: {
            outputFile: 'output/unit.xml',
            suite: 'unit'
        },
        webpack: webpackConfig,
        webpackMiddleware: {
            stats: 'errors-only',
        },
        client: {
            captureConsole: false
        }
    });
};