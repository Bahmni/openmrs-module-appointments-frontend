'use strict';

angular.module('bahmni.appointments')
    .service('appointmentCommonService', ['$state', '$location',
        function ($state, $location) {
            this.isCurrentUserHavingPrivilege = function (privilege, currentUserPrivileges) {
                return !_.isUndefined(_.find(currentUserPrivileges, function (userPrivilege) {
                    return userPrivilege.name === privilege;
                }));
            };

            var isOwnPrivilegedUserAllowedToPerformEdit = function (appointmentProviders, currentProviderUuId) {
                return _.isEmpty(appointmentProviders) ||
                    !_.isUndefined(_.find(appointmentProviders, function (provider) {
                        return provider.uuid === currentProviderUuId && provider.response === "ACCEPTED";
                    })) || _.isUndefined(_.find(appointmentProviders, function (provider) {
                        return provider.response == "ACCEPTED";
                    }));
            };

            this.isUserAllowedToPerformEdit = function (appointmentProviders, currentUserPrivileges, currentProviderUuId) {
                return this.isCurrentUserHavingPrivilege(Bahmni.Appointments.Constants.privilegeManageAppointments, currentUserPrivileges)
                    ? true : this.isCurrentUserHavingPrivilege(Bahmni.Appointments.Constants.privilegeOwnAppointments, currentUserPrivileges)
                        ? isOwnPrivilegedUserAllowedToPerformEdit(appointmentProviders, currentProviderUuId) : false;
            };

            this.addProviderToFilterFromQueryString = function () {
                if ($location.search()["provider"]) {
                    let fitlers = $state.params.filterParams;
                    const provider = $location.search()["provider"];
                    
                    if (!Array.isArray(fitlers.providerUuids))  {
                        fitlers.providerUuids = [];
                    }

                    if(fitlers.providerUuids.indexOf(provider) < 0) {
                        fitlers.providerUuids.push(provider);
                    }
                }
            }
        }]);
