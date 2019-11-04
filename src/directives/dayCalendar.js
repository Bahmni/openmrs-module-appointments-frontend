'use strict';

angular.module('bahmni.appointments')
    .directive('dayCalendar', [function () {
        return {
            restrict: 'E',
            controller: "AppointmentsDayCalendarController",
            scope: {
                appointments: "=",
                date: "="
            },
            template: require("../views/manage/calendar/dayCalendar.html")
        };
    }]);
