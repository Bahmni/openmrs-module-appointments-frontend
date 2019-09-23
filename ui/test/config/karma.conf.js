module.exports = function (config) {
    config.set({
        basePath: '../..',
        frameworks: ['jasmine'],
        browsers: ['Firefox'],
        browserNoActivityTimeout: 100000,
        autoWatch: false,
        singleRun: true,
        files: [
            {pattern: 'test/data/*.json', watched: true, served: true, included: false},
            {pattern: 'app/images/*', included: false, served: true},
            'app/components/q/q.js',
            'app/components/angular/angular.js',
            'app/components/ngDialog/js/ngDialog.js',
            'app/components/angular-sanitize/angular-sanitize.js',
            'app/components/jquery/jquery.js',
            'app/components/jquery.cookie/jquery.cookie.js',
            'app/components/jasmine-jquery/lib/jasmine-jquery.js',
            'app/components/angular-mocks/angular-mocks.js',
            'app/components/ngInfiniteScroll/build/ng-infinite-scroll.js',
            'app/components/moment/min/moment.min.js',
            'app/components/angular-ui-calendar/src/calendar.js',
            'app/components/fullcalendar/dist/fullcalendar.min.js',
            'app/components/fullcalendar-scheduler/dist/scheduler.min.js',
            'app/components/angular-elastic/elastic.js',
            'app/components/angular-ivh-treeview/dist/ivh-treeview.min.js',
            'app/components/angular-ui-router/release/angular-ui-router.js',
            'app/components/lodash/dist/lodash.min.js',
            'app/components/angular-ui-select2/src/select2.js',
            'app/components/angular-bindonce/bindonce.js',
            'app/components/ng-tags-input/ng-tags-input.min.js',
            'app/components/stacktrace-js/stacktrace.js',
            'app/components/ng-clip/src/ngClip.js',
            'app/components/zeroclipboard/dist/ZeroClipboard.js',
            'app/components/angular-translate/angular-translate.js',
            'app/components/angular-cookies/angular-cookies.js',
            'app/components/angular-translate-storage-local/angular-translate-storage-local.js',
            'app/components/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
            'app/components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
            'app/lib/modernizr.custom.80690.js',
            'app/lib/angular-workers/dist/angular-workers.js',
            'app/common/constants.js',
            'app/common/util/init.js',
            'app/common/util/**.js',
            'app/common/domain/init.js',
            'app/common/domain/**/*.js',
            'app/**/init.js',
            'app/**/constants.js',
            'app/common/**/*.js',
            'app/common/**/*.html',
            'app/clinical/**/*.js',
            'app/appointments/**/*.js',
            'test/support/**/*.js',
            'test/unit/**/*.js',
            "test/unit/common/util/dateTimeFormatter.spec.js"
        ],
        exclude:[
            'app/components/moment/src/**/*.js'
        ],
        reporters: ['junit', (process.env.CI === 'true' ? 'dots' : 'progress'), 'coverage'],
        preprocessors: {
            'app/common/**/*.js': ['coverage'],
            'app/appointments/**/*.js': ['coverage'],
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
        ngHtml2JsPreprocessor: {
            stripPrefix: 'app',
            prependPrefix: '..',
            moduleName: 'ngHtml2JsPreprocessor'
        },
        proxies:{
            '/images/blank-user.gif' :'/base/app/images/blank-user.gif'
        }
    });
};
