'use strict';

angular.module('bahmni.appointments')
    .service('appointmentsService', ['$http', 'appService',
        function ($http, appService) {
            this.save = function (appointment) {
                return $http.post(Bahmni.Appointments.Constants.createAppointmentUrl, appointment, {
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };
            this.search = function (appointment) {
                return $http.post(Bahmni.Appointments.Constants.searchAppointmentUrl, appointment, {
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };

            this.getAppointmentsForServiceType = function (serviceTypeUuid) {
                var params = {"appointmentServiceTypeUuid": serviceTypeUuid};
                return $http.get(Bahmni.Appointments.Constants.getAppointmentsForServiceTypeUrl, {
                    params: params,
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };

            this.searchAppointments = function (data) {
                return $http.post(Bahmni.Appointments.Constants.searchAppointmentsUrl, data, {
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };

            this.getAllAppointments = function (params = {}) {
                return $http.get(Bahmni.Appointments.Constants.getAllAppointmentsUrl, {
                    params: params,
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };

            this.getAppointmentByUuid = function (appointmentUuid) {
                var params = {uuid: appointmentUuid};
                return $http.get(Bahmni.Appointments.Constants.getAppointmentByUuid, {
                    params: params,
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };

            this.getAppointmentsSummary = function (params) {
                return $http.get(Bahmni.Appointments.Constants.getAppointmentsSummaryUrl, {
                    params: params,
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };

            this.changeStatus = function (appointmentUuid, toStatus, onDate, applyForAll) {
                var params = {toStatus: toStatus, onDate: onDate, applyForAll:applyForAll, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone};
                var changeStatusConstantUrl = applyForAll === "true" ? Bahmni.Appointments.Constants.changeRecurringAppointmentsStatusUrl : Bahmni.Appointments.Constants.changeAppointmentStatusUrl;
                var changeStatusUrl = appService.getAppDescriptor().formatUrl(changeStatusConstantUrl, {appointmentUuid: appointmentUuid});
                return $http.post(changeStatusUrl, params, {
                    withCredentials: true,
                    headers: {"Accept": "application/json", "Content-Type": "application/json"}
                });
            };

            this.changeProviderResponse = function (appointmentUuid, providerUuid, providerResponse) {
                var data = {uuid: providerUuid, response: providerResponse};
                var changeStatusUrl = appService.getAppDescriptor().formatUrl(Bahmni.Appointments.Constants.changeProviderResponseUrl, {appointmentUuid: appointmentUuid});
                return $http.post(changeStatusUrl, data, {
                    withCredentials: true,
                    headers: {"Content-Type": "application/json"}
                });
            };
        }]);
