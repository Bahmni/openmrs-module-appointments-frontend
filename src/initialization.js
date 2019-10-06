'use strict';

angular.module('bahmni.appointments').factory('initialization',
    ['authenticator', 'appService', 'spinner', 'configurations', '$http', 'openMRSAuthService',
        function (authenticator, appService, spinner, configurations, $http, openMRSAuthService) {
            return function () {
                var loadConfigPromise = function () {
                    return configurations.load([]);
                };
                var initApp = function () {
                    return appService.initApp('appointments', {'app': true, 'extension': true});
                };

                var ensureLogin = function(){
                    let globalPropertyPromise = $http.get(Bahmni.Common.Constants.globalPropertyUrl, {
                        params: {
                            property: 'bahmni.appointments.runningOnOpenmrs'
                        },
                    });
                    return globalPropertyPromise.then((response) => {
                        return response.data ?
                            openMRSAuthService.populateLoginDetails() :
                            authenticator.authenticateUser()
                    });
                };
                return spinner.forPromise(
                    ensureLogin().then(initApp).then(loadConfigPromise)
                );
            };
        }
    ]
);
