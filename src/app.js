'use strict';

angular
    .module('bahmni.appointments')
    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', '$bahmniTranslateProvider', '$compileProvider',
        function ($urlRouterProvider, $stateProvider, $httpProvider, $bahmniTranslateProvider, $compileProvider) {
            $httpProvider.defaults.headers.common['Disable-WWW-Authenticate'] = true;
            $urlRouterProvider.otherwise('/home/manage/summary');
            $urlRouterProvider.when('/home/manage', '/home/manage/summary');
        // @if DEBUG='production'
            $compileProvider.debugInfoEnabled(false);
        // @endif

        // @if DEBUG='development'
            $compileProvider.debugInfoEnabled(true);
        // @endif
            $stateProvider
            .state('home', {
                url: '/home',
                abstract: true,
                views: {
                    'additional-header': {
                        template: require('./views/appointmentsHeader.html'),
                        controller: 'AppointmentsHeaderController'
                    },
                    'mainContent': {
                        template: '<div class="opd-wrapper appointments-page-wrapper">' +
                        '<div ui-view="content" class="opd-content-wrapper appointments-content-wrapper"></div>' +
                        '</div>'
                    }
                },
                data: {
                    backLinks: []
                },
                resolve: {
                    initializeConfig: ['initialization', '$stateParams', function (initialization, $stateParams) {
                            return initialization($stateParams.appName);
                        }
                    ]}
            }).state('home.manage', {
                url: '/manage',
                views: {
                    'content': {
                        template: require('./views/manage/appointmentsManage.html'),
                        controller: 'AppointmentsManageController'
                    }
                }
            }).state('home.manage.summary', {
                url: '/summary',
                tabName: 'summary',
                params: {
                    viewDate: null
                },
                views: {
                    'content@manage': {
                        template: '<react-appointment-summary-wrapper />'
                    }
                }
            }).state('home.manage.appointments', {
                url: '/appointments',
                params: {
                    filterParams: {},
                    isFilterOpen: true,
                    isSearchEnabled: false
                },
                views: {
                    'filter': {
                        template: require('./views/manage/appointmentFilter.html'),
                        controller: 'AppointmentsFilterController'
                    },
                    'content@manage': {
                        template: require('./views/manage/allAppointments.html'),
                        controller: 'AllAppointmentsController'
                    }

                }
            }).state('home.manage.appointments.calendar', {
                url: '/calendar',
                tabName: 'appointments',
                view: 'calendar',
                params: {
                    viewDate: null,
                    doFetchAppointmentsData: true,
                    appointmentsData: null,
                    weekView: false
                },
                views: {
                    'content@viewAppointments': {
                        template: require('./views/manage/calendar/calendarView.html'),
                        controller: 'AppointmentsCalendarViewController'
                    }
                }
            }).state('home.manage.appointments.calendar.new', {
                url: '/new',
                tabName: 'appointments',
                params: {
                    appointment: null
                },
                views: {
                    'content@appointment': {
                        template: '<react-add-appointment-wrapper />'
                    }
                },
                resolve: {
                    appointmentContext: ['appointmentInitialization', '$stateParams', function (appointmentInitialization, $stateParams) {
                        return appointmentInitialization($stateParams);
                    }],
                    appointmentCreateConfig: ['initializeConfig', 'appointmentConfigInitialization', 'appointmentContext', function (initializeConfig, appointmentConfigInitialization, appointmentContext) {
                        return appointmentConfigInitialization(appointmentContext);
                    }]
                }
            }).state('home.manage.appointments.calendar.edit', {
                url: '/:uuid?isRecurring',
                tabName: 'appointments',
                params: {
                    isRecurring: null
                },
                views: {
                    'content@appointment': {
                        template: '<react-add-appointment-wrapper />'
                    }
                }
            }).state('home.manage.appointments.list', {
                url: '/list',
                tabName: 'appointments',
                view:'list',
                params: {
                    viewDate: null,
                    patient: null,
                    doFetchAppointmentsData: true,
                    appointmentsData: null,
                    filterParams: {}
                },
                views: {
                    'content@viewAppointments': {
                        template: require('./views/manage/list/listView.html'),
                        controller: 'AppointmentsListViewController'
                    }
                }
            }).state('home.manage.appointments.list.new', {
                url: '/new',
                tabName: 'appointments',
                views: {
                    'content@appointment': {
                        template: '<react-add-appointment-wrapper />'
                    }
                },
                resolve: {
                    appointmentContext: ['appointmentInitialization', '$stateParams', function (appointmentInitialization, $stateParams) {
                        return appointmentInitialization($stateParams);
                    }],
                    appointmentCreateConfig: ['initializeConfig', 'appointmentConfigInitialization', 'appointmentContext', function (initializeConfig, appointmentConfigInitialization, appointmentContext) {
                        return appointmentConfigInitialization(appointmentContext);
                    }]
                }
            }).state('home.manage.appointments.list.edit', {
                url: '/:uuid?isRecurring',
                tabName: 'appointments',
                params: {
                    isRecurring: null
                },
                views: {
                    'content@appointment': {
                        template: '<react-add-appointment-wrapper />'
                    }
                }
            }).state('home.manage.awaitingappointments', {
                url: '/awaiting-appointments',
                params: {
                    filterParams: {
                        statusList: ["WaitList"]
                    },
                    isFilterOpen: true,
                    isSearchEnabled: false
                },
                views: {
                    'filter': {
                        template: require('./views/manage/appointmentFilter.html'),
                        controller: 'AppointmentsFilterController'
                    },
                    'content@manage': {
                        template: require('./views/manage/allAppointments.html'),
                        controller: 'AllAppointmentsController'
                    }

                }
            }).state('home.manage.awaitingappointments.list', {
                url: '/list',
                tabName: 'awaitingappointments',
                view: 'list',
                params: {
                    viewDate: null,
                    patient: null,
                    doFetchAppointmentsData: true,
                    appointmentsData: null
                },
                views: {
                    'content@viewAppointments': {
                        template: require('./views/manage/list/listView.html'),
                        controller: 'AppointmentsListViewController'
                    }
                }
            }).state('home.manage.awaitingappointments.list.new', {
                url: '/new',
                tabName: 'awaitingappointments',
                views: {
                    'content@appointment': {
                        template: '<react-add-appointment-wrapper />'
                    }
                },
                resolve: {
                    appointmentContext: ['appointmentInitialization', '$stateParams', function (appointmentInitialization, $stateParams) {
                        return appointmentInitialization($stateParams);
                    }],
                    appointmentCreateConfig: ['initializeConfig', 'appointmentConfigInitialization', 'appointmentContext', function (initializeConfig, appointmentConfigInitialization, appointmentContext) {
                        return appointmentConfigInitialization(appointmentContext);
                    }]
                }
            }).state('home.manage.awaitingappointments.list.edit', {
                url: '/:uuid?isRecurring',
                tabName: 'awaitingappointments',
                params: {
                    isRecurring: null
                },
                views: {
                    'content@appointment': {
                        template: '<react-add-appointment-wrapper />'
                    }
                }
            }).state('home.admin', {
                url: '/admin',
                abstract: true,
                views: {
                    'content': {
                        template: require('./views/admin/appointmentsAdmin.html')
                    }
                }
            }).state('home.admin.service', {
                url: '/service',
                views: {
                    'content@admin': {
                        template: require('./views/admin/allAppointmentServices.html'),
                        controller: 'AllAppointmentServicesController'
                    }
                }
            }).state('home.admin.service.edit', {
                url: '/:uuid',
                views: {
                    'content@admin': {
                        template: require('./views/admin/appointmentService.html'),
                        controller: 'AppointmentServiceController'
                    }
                },
                resolve: {
                    appointmentServiceContext: ['appointmentServiceInitialization', '$stateParams', function (appointmentServiceInitialization, $stateParams) {
                        return appointmentServiceInitialization($stateParams.uuid);
                    }
                    ]                }
            });

            $bahmniTranslateProvider.init({app: 'appointments', shouldMerge: true});
        }]).run(['$window', function ($window) {
            moment.locale($window.localStorage["NG_TRANSLATE_LANG_KEY"] || "en");
        }]);
