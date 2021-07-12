'use strict';

angular.module('bahmni.appointments')
    .service('calendarViewPopUp', ['$rootScope', 'ngDialog', '$state','$window', '$translate', 'appointmentsService',
        'confirmBox', 'checkinPopUp', 'appService', 'messagingService', 'appointmentCommonService',
        function ($rootScope, ngDialog, $state, $window, $translate, appointmentsService, confirmBox, checkinPopUp, appService, messagingService, appointmentCommonService) {
            var calendarViewPopUp = function (config) {
                var popUpScope = $rootScope.$new();
                var dialog;
                var scope = config.scope;
                var maxAppointmentProviders = appService.getAppDescriptor().getConfigValue('maxAppointmentProviders') || 1;
                var appointmentProviders = scope.appointments[0].providers;
                var currentUserPrivileges = $rootScope.currentUser.privileges;
                var currentProviderUuId = $rootScope.currentProvider.uuid;

                popUpScope.scope = scope;
                popUpScope.appointment = scope.appointments.length === 1 ? scope.appointments[0] : undefined;
                popUpScope.manageAppointmentPrivilege = Bahmni.Appointments.Constants.privilegeManageAppointments;
                popUpScope.ownAppointmentPrivilege = Bahmni.Appointments.Constants.privilegeOwnAppointments;
                popUpScope.allowedActions = appService.getAppDescriptor().getConfigValue('allowedActions') || [];
                popUpScope.allowedActionsByStatus = appService.getAppDescriptor().getConfigValue('allowedActionsByStatus') || {};
                popUpScope.isAppointmentRequestEnabled = appService.getAppDescriptor().getConfigValue('enableAppointmentRequests');

                popUpScope.navigateTo = function (state, appointment) {
                    var params = $state.params;
                    if (state === 'edit') {
                        ngDialog.close(dialog.id, false);
                        params.uuid = appointment.uuid;
                        params.isRecurring = appointment.recurring;
                        $state.go('home.manage.appointments.calendar.edit', params, {reload: false});
                    } else if (state === 'new') {
                        ngDialog.close(dialog.id, false);
                        params.appointment = { startDateTime: scope.appointments[0].startDateTime,
                            endDateTime: scope.appointments[0].endDateTime,
                            provider: scope.appointments[0].provider,
                            appointmentKind: 'Scheduled'
                        };
                        $state.go('home.manage.appointments.calendar.new', params, {reload: false});
                    } else {
                        $state.go($state.current, params, {reload: true});
                    }
                    popUpScope.$destroy();
                };

                popUpScope.openTeleConsultation = function (appointment) {

                    $window.open("https://" +
                        window.location.hostname + 
                        Bahmni.Common.Constants.patientsURL + 
                        appointment.patient.uuid +
                        Bahmni.Common.Constants.patientsURLGeneralInformationTab
                        , '_self')
                };  
                popUpScope.copyTeleConsultationMeetingURL = function (appointment) {
                    var jitsiMeetingUrl = 'https://meet.jit.si/' + appointment.uuid
                    const el = document.createElement('textarea');
                    el.value = jitsiMeetingUrl;
                    document.body.appendChild(el);
                    el.select();
                    document.execCommand('copy');
                    document.body.removeChild(el);
                };

                var closeConfirmBox = function (closeConfirmBox) {
                    closeConfirmBox();
                };

                popUpScope.isUserAllowedToPerformEdit = function () {
                    return appointmentCommonService.isUserAllowedToPerformEdit(appointmentProviders, currentUserPrivileges, currentProviderUuId);
                };

                popUpScope.isEditAllowed = function () {
                    return maxAppointmentProviders > 1 ? true :
                        appointmentCommonService.isUserAllowedToPerformEdit(appointmentProviders, currentUserPrivileges, currentProviderUuId);
                };

                var changeStatus = function (appointment, toStatus, onDate, closeConfirmBox, applyForAll) {
                    var message = $translate.instant('APPOINTMENT_STATUS_CHANGE_SUCCESS_MESSAGE', {
                        toStatus: toStatus
                    });
                    return appointmentsService.changeStatus(appointment.uuid, toStatus, onDate, applyForAll).then(function () {
                        appointment.status = toStatus;
                        closeConfirmBox();
                        messagingService.showMessage('info', message);
                    });
                };

                popUpScope.checkinAppointment = function (patientAppointment) {
                    var scope = $rootScope.$new();
                    scope.message = $translate.instant('APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE', {
                        toStatus: 'CheckedIn'
                    });
                    scope.action = _.partial(changeStatus, patientAppointment, 'CheckedIn', _);
                    checkinPopUp({
                        scope: scope,
                        className: "ngdialog-theme-default app-dialog-container"
                    });
                };

                popUpScope.confirmAction = function (appointment, toStatus) {
                    var scope = {};
                    scope.no = closeConfirmBox;
                    scope.yes = _.partial(changeStatus, appointment, toStatus, undefined, _);
                    var actions = [{name: 'yes', display: 'YES_KEY'}, {name: 'no', display: 'NO_KEY'}];
                    if (toStatus === 'Cancelled' && appointment.recurring) {
                        scope.message = $translate.instant('APPOINTMENT_STATUS_CANCEL_CONFIRM_MESSAGE', {
                            toStatus: toStatus
                        });
                        scope.yes_all = _.partial(changeStatus, appointment, toStatus, undefined, _, "true");
                        actions = [{name: 'yes', display: 'RECURRENCE_THIS_APPOINTMENT'},
                            {name: 'yes_all', display: 'RECURRENCE_ALL_APPOINTMENTS'},
                            {name: 'no', display: 'DONT_CANCEL_KEY', class: 'right'}];
                    }
                    else
                        scope.message = $translate.instant('APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE', {
                            toStatus: toStatus
                        });
                    confirmBox({
                        scope: scope,
                        actions: actions,
                        className: "ngdialog-theme-default"
                    });
                };

                popUpScope.isAllowedAction = function (action) {
                    return _.includes(popUpScope.allowedActions, action);
                };

                const findCurrentProviderInAppointment = function(appointment) {
                    return _.find(appointment.providers, function (provider) {
                        return provider.uuid === currentProviderUuId;
                    });
                };

                popUpScope.isResponseAwaitingForCurrentProvider = function(appointment){                    
                    if (!popUpScope.isAppointmentRequestEnabled || !appointment) return false;
                    const currentProviderInAppointment = findCurrentProviderInAppointment(appointment);
                    return !(_.isUndefined(currentProviderInAppointment)) &&
                        currentProviderInAppointment.response === Bahmni.Appointments.Constants.providerResponses.AWAITING;
                };

                const acceptAppointmentInvite = function(appointment, closeConfirmBox){
                    const currentProviderInAppointment = findCurrentProviderInAppointment(appointment);

                    const message = $translate.instant('PROVIDER_RESPONSE_ACCEPT_SUCCESS_MESSAGE');
                    return appointmentsService.changeProviderResponse(appointment.uuid, currentProviderInAppointment.uuid,
                        Bahmni.Appointments.Constants.providerResponses.ACCEPTED).then(function () {
                            currentProviderInAppointment.response = Bahmni.Appointments.Constants.providerResponses.ACCEPTED;
                            closeConfirmBox();
                            messagingService.showMessage('info', message);
                    });
                };

                popUpScope.acceptAppointmentInviteForCurrentProvider = function(appointment){
                    var scope = {};
                    scope.message = $translate.instant('APPOINTMENT_ACCEPT_CONFIRM_MESSAGE');
                    scope.no = closeConfirmBox;
                    scope.yes = _.partial(acceptAppointmentInvite, appointment, _);
                    return confirmBox({
                        scope: scope,
                        actions: [{name: 'yes', display: 'YES_KEY'}, {name: 'no', display: 'NO_KEY'}],
                        className: "ngdialog-theme-default"
                    });
                };

                popUpScope.isValidActionAndIsUserAllowedToPerformEdit = function (appointment, action) {
                    return !appointment ? false :
                        !appointmentCommonService.isUserAllowedToPerformEdit(appointmentProviders, currentUserPrivileges, currentProviderUuId)
                            ? false : isValidAction(appointment, action);
                };

                var isValidAction = function (appointment, action) {
                    var allowedActions = popUpScope.allowedActionsByStatus.hasOwnProperty(appointment.status) ? popUpScope.allowedActionsByStatus[appointment.status] : [];
                    return _.includes(allowedActions, action);
                };

                popUpScope.getAppointmentProviderNames = function (appointment) {
                    if (appointment.providers) {
                        var providerNames = appointment.providers.filter(function (p) {
                            return p.response !== Bahmni.Appointments.Constants.providerResponses.CANCELLED;
                        }).map(function (p) {
                            return p.name;
                        }).join(', ');
                        return providerNames;
                    }
                    return '';
                };

                popUpScope.isVirtualAppointment = function (appointment) {
                    return appointment.appointmentKind === "Virtual";
                };

                dialog = ngDialog.open({
                    plain: true,
                    template: require('../views/manage/calendar/popUp.html'),
                    scope: popUpScope,
                    className: config.className || 'ngdialog-theme-default'
                });

                dialog.closePromise.then(function (data) {
                    if (data.value !== false) {
                        popUpScope.navigateTo('calendar');
                    }
                });
            };
            return calendarViewPopUp;
        }]);
