'use strict';

angular.module('bahmni.appointments').factory('initialization',
    ['authenticator', 'appService', 'spinner', 'configurations', '$q', '$http', 'openMRSHelperService', 'openMRSAuthService',
        function (authenticator, appService, spinner, configurations, $q, $http, openMRSHelperService, openMRSAuthService) {
            return function () {
                var loadConfigPromise = function () {
                    return configurations.load([]);
                };
                var initApp = function () {
                    return appService.initApp('appointments', {'app': true, 'extension': true});
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
                    ensureLogin().then(initApp).then(loadConfigPromise)
                );
            };
        }
    ]
);
