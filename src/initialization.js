'use strict';

angular.module('bahmni.appointments').factory('initialization',
    ['authenticator', 'appService', 'spinner', 'configurations', '$q', '$http', '$rootScope', 'openMRSHelperService', 'openMRSAuthService',
        function (authenticator, appService, spinner, configurations, $q, $http, $rootScope, openMRSHelperService, openMRSAuthService) {
            return function () {
                var loadConfigPromise = function () {
                    return configurations.load([]);
                };
                var initApp = function () {
                    return appService.initApp('appointments', {'app': true, 'extension': true});
                };
                var loadHomeConfig = function () {
                    return appService.loadMandatoryConfig(Bahmni.Common.Constants.baseUrl + "home/app.json").then(
                        function (response) {
                            var config = response.data && response.data.config;
                            $rootScope.homeURL = (config && config.homeURL) || Bahmni.Appointments.Constants.homeUrl;
                        },
                        function () {
                            $rootScope.homeURL = Bahmni.Appointments.Constants.homeUrl;
                        }
                    );
                };
                var ensureLogin = function () {
                    return openMRSHelperService.isRunningOnOpenMRS().then(
                        (isRunningOnOpenMRS) => {
                            return isRunningOnOpenMRS ?
                                openMRSAuthService.populateLoginDetails() :
                                authenticator.authenticateUser();
                        });
                };
                return spinner.forPromise(
                    ensureLogin().then(initApp).then(loadHomeConfig).then(loadConfigPromise)
                );
            };
        }
    ]
);
