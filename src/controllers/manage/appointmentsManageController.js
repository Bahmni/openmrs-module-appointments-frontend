'use strict';

angular.module('bahmni.appointments')
    .controller('AppointmentsManageController', ['$scope', '$state', 'appService',
        function ($scope, $state, appService) {
            $scope.enableCalendarView = appService.getAppDescriptor().getConfigValue('enableCalendarView');

            $scope.navigateTo = function (viewName) {
                if (isSameTab(viewName)) {
                    return;
                }
                var stateName = 'home.manage.' + getAppointmentsTabType(viewName);
                $state.go(stateName, $state.params, {reload: false});
            };

            var isSameTab = function (viewName) {
                var appointmentListTabs = ['calendar', 'list'];
                var isInAppointmentListTab = _.includes(appointmentListTabs, $scope.getCurrentTabName());
                return $scope.getCurrentTabName() === viewName || (isInAppointmentListTab && viewName === 'appointments');
            };

            var getAppointmentsTabType = function (viewName) {
                if(viewName === "appointments")
                    return 'appointments.' + ($scope.enableCalendarView ? 'calendar' : 'list');
                else if(viewName === "awaitingappointments")
                    return 'awaitingappointments.' + ($scope.enableCalendarView ? 'calendar' : 'list');
                else    
                    return viewName;
            };

            $scope.getCurrentTabName = function () {
                return $state.current && $state.current.tabName;
            };

            $scope.getCurrentButtonName = function () {
                return $state.current && $state.current.button;
            };

        }]);
