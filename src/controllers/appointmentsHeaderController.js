'use strict';

angular.module('bahmni.appointments')
    .controller('AppointmentsHeaderController', ['$scope', '$state', 'appService', '$rootScope',
        function ($scope, $state, appService, $rootScope) {
            var setBackLinks = function () {
                var backLinks = [{label: "Home", url: $rootScope.homeURL || Bahmni.Appointments.Constants.homeUrl, accessKey: "h", icon: "fa-home", id: "homeBackLink"}];

                // TODO:permissions for admin
                backLinks.push({text: "APPOINTMENTS_MANAGE", state: "home.manage", accessKey: "M"});
                var enableAdminPage = appService.getAppDescriptor().getExtensionById('bahmni.appointments.admin', true);
                if (enableAdminPage) {
                    backLinks.push({text: "APPOINTMENTS_ADMIN", state: "home.admin.service", accessKey: "A", requiredPrivilege: Bahmni.Appointments.Constants.privilegeForAdmin});
                }
                $state.get('home').data.backLinks = backLinks;
            };
            var init = function () {
                setBackLinks();
            };
            return init();
        }]);
