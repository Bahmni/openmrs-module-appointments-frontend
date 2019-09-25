'use strict';

angular.module('bahmni.appointments')
    .directive('weekCalendar', [function () {
        return {
            restrict: 'E',
            controller: "AppointmentsWeekCalendarController",
            scope: {
                appointments: "=",
                date: "="
            },
            template: require("../views/manage/calendar/weekCalendar.html")
        };
    }]);
