'use strict';

describe('CalendarViewPopUp', function () {
    var rootScope, calendarViewPopUp, popUpScope, ngDialog, $state, confirmBox, $translate, appointmentsService, dialog,
        appService, appDescriptor, messagingService;

    beforeEach(function () {
        module('bahmni.appointments');
        module(function ($provide) {
            popUpScope = {};
            popUpScope.$destroy = jasmine.createSpy('$destroy');
            ngDialog = jasmine.createSpyObj('ngDialog', ['open', 'close']);
            dialog = {};
            dialog.id = 'dialogId';
            dialog.closePromise = specUtil.simplePromise({});
            ngDialog.open.and.returnValue(dialog);
            $state = jasmine.createSpyObj('$state', ['go']);
            confirmBox = jasmine.createSpy('confirmBox');
            $translate = jasmine.createSpyObj('$translate', ['instant', 'storageKey', 'storage', 'preferredLanguage']);
            appointmentsService = jasmine.createSpyObj('appointmentsService', ['changeStatus','changeProviderResponse']);
            appService = jasmine.createSpyObj('appService', ['getAppDescriptor']);
            appDescriptor = jasmine.createSpyObj('appDescriptor', ['getConfigValue']);
            appService.getAppDescriptor.and.returnValue(appDescriptor);
            messagingService = jasmine.createSpyObj('messagingService', ['showMessage']);

            $provide.value('ngDialog', ngDialog);
            $provide.value('$state', $state);
            $provide.value('confirmBox', confirmBox);
            $provide.value('$translate', $translate);
            $provide.value('appointmentsService', appointmentsService);
            $provide.value('appService', appService);
            $provide.value('messagingService', messagingService);
        });
    });

    beforeEach(inject(['$rootScope', 'calendarViewPopUp', function ($rootScope, _calendarViewPopUp_) {
        rootScope = $rootScope;
        calendarViewPopUp = _calendarViewPopUp_;
    }]));

    beforeEach(function () {
        spyOn(rootScope, '$new');
        rootScope.$new.and.returnValue(popUpScope);
        rootScope.currentProvider = {};
        rootScope.currentUser = {};
        var appointments = [
            {
                patient: {identifier: "GAN203012", name: "patient1", uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"}
            }
        ];
        rootScope.config = {scope: {appointments: appointments}};

    });

    it('should differentiate between appointments when there are group appointments with same patient and same provider while changing the status of appointments', function () {
        var appointments = [
            {   uuid: 'appointUuid1',
                patient: {identifier: "GAN203012", name: "patient1", uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"},
                provider:{uuid:'provider1'},
                status: 'Scheduled',
                startDateTime: moment(),
                endDateTime: moment().add(30, 'minutes')

            },
            {   uuid: 'appointUuid2',
                patient: {identifier: "GAN203012", name: "patient1", uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"},
                provider:{uuid:'provider1'},
                status: 'Scheduled',
                startDateTime: moment(),
                endDateTime: moment().add(30, 'minutes'),
            }
        ];
        var toStatus = 'Cancelled';
        var message = "Successfully changed appointment status to Cancelled";
        appointmentsService.changeStatus.and.returnValue(specUtil.simplePromise({}));
        $translate.instant.and.returnValue(message);
        confirmBox.and.callFake(function (config) {
            var close = jasmine.createSpy('close');
            config.scope.yes(close).then(function () {
                expect(appointmentsService.changeStatus).toHaveBeenCalledWith(appointments[0].uuid, toStatus, undefined, undefined);
                expect(appointments[0].status).toBe(toStatus);
                expect(close).toHaveBeenCalled();
                expect(messagingService.showMessage).toHaveBeenCalledWith('info', message);
            });
        });
        calendarViewPopUp(rootScope.config);
        popUpScope.confirmAction(appointments[0], toStatus);
        popUpScope.confirmAction(appointments[1], 'Scheduled');
    });

    it('should assign appointment when there is a single appointment', function () {
        var appointments = [
            {
                patient: {identifier: "GAN203012", name: "patient1", uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"}
            }
        ];
        var config = {scope: {appointments: appointments}};
        calendarViewPopUp(config);
        expect(popUpScope.appointment).toBe(appointments[0]);
    });

    it('should open ngDialog with properties', function () {
        var appointments = [
            {
                patient: {identifier: "GAN203012", name: "patient1", uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"}
            }
        ];
        var config = {scope: {appointments: appointments}};
        calendarViewPopUp(config);

        let args = ngDialog.open.calls.allArgs()[0][0];
        expect(args.plain).toBeTruthy();
        let expectedSubstring = "<b>{{::'APPOINTMENT_CREATE_PATIENT_NAME' |translate}}:</b> <span ng-if=\"scope.appointments.length === 1\">{{ appointment.patient.name }} ({{ appointment.patient.identifier }})</span>"
        expect(args.template).toContain(expectedSubstring);
        expect(args.scope).toEqual(popUpScope);
        expect(args.className).toEqual('ngdialog-theme-default');
    });

    it('closePromise should reload current state if value false', function () {
        dialog.closePromise = specUtil.simplePromise({value: false});
        ngDialog.close.and.callFake(function () {
            dialog.closePromise();
            expect($state.go).toHaveBeenCalledWith($state.current, $state.params, {reload: true});
        });
        calendarViewPopUp(rootScope.config);
    });

    it('closePromise should reload current state if value is not false', function () {
        dialog.closePromise = specUtil.simplePromise({value: true});
        ngDialog.close.and.callFake(function () {
            dialog.closePromise();
            expect($state.go).not.toHaveBeenCalled();
        });

        calendarViewPopUp(rootScope.config);
    });

    it('should go to new appointment state on navigateTo new', function () {
        $state.params = {};
        var appointments = [{
            startDateTime: moment(),
            endDateTime: moment().add(30, 'minutes'),
            provider: {name: 'Superman'},
            patient: {uuid: 'patientUuid'}
        }];
        var config = {scope: {appointments: appointments}};
        calendarViewPopUp(config);
        popUpScope.navigateTo('new');
        expect(ngDialog.close).toHaveBeenCalledWith(dialog.id, false);
        expect($state.params.appointment).toEqual({
            startDateTime: appointments[0].startDateTime,
            endDateTime: appointments[0].endDateTime,
            provider: appointments[0].provider,
            appointmentKind: 'Scheduled'
        });
        expect($state.go).toHaveBeenCalledWith('home.manage.appointments.calendar.new', $state.params, {reload: false});
    });

    it('should go to edit appointment state on navigateTo edit', function () {
        $state.params = {};
        var appointment = {uuid: 'appointUuid', patient: {uuid: 'patientUuid'}};
        var config = {scope: {appointments: [appointment]}};
        calendarViewPopUp(config);
        popUpScope.navigateTo('edit', appointment);
        expect(ngDialog.close).toHaveBeenCalledWith(dialog.id, false);
        expect($state.params.uuid).toBe(appointment.uuid);
        expect($state.go).toHaveBeenCalledWith('home.manage.appointments.calendar.edit', $state.params, {reload: false});
    });

    it('should show a pop up with option to cancel all appointments on confirmAction', function () {
        var appointment = {uuid: 'appointmentUuid', recurring: 'false'};
        var toStatus = 'Cancelled';
        var onDate = new Date();
        var translatedMessage = 'This is a recurring appointment. You can cancel either the selected appointment or the entire series';

        $translate.instant.and.callFake(function (value) {
            if (value === 'APPOINTMENT_STATUS_CANCEL_CONFIRM_MESSAGE')
                return translatedMessage;
        });

        confirmBox.and.callFake(function (config) {
            expect($translate.instant.calls.allArgs()).toEqual( [[ 'APPOINTMENT_STATUS_CANCEL_CONFIRM_MESSAGE', { toStatus : toStatus } ]]);
            expect(config.scope.message).toEqual(translatedMessage);
            expect(config.scope.no).toEqual(jasmine.any(Function));
            expect(config.scope.yes).toEqual(jasmine.any(Function));
            expect(config.actions).toEqual([{name: 'yes', display: 'RECURRENCE_THIS_APPOINTMENT'},
                {name: 'yes_all', display: 'RECURRENCE_ALL_APPOINTMENTS'},
                {name: 'no', display: 'DONT_CANCEL_KEY', class: 'right'}]);
            expect(config.className).toEqual('ngdialog-theme-default');
        });
        calendarViewPopUp(rootScope.config);
        popUpScope.confirmAction(appointment, toStatus, onDate);
        expect(confirmBox).toHaveBeenCalled();
    });

    it('should reload current state on navigateTo any other', function () {
        $state.params = {};
        $state.current = 'home.manage.appointments.calendar';
        calendarViewPopUp(rootScope.config);
        popUpScope.navigateTo();
        expect($state.go).toHaveBeenCalledWith($state.current, $state.params, {reload: true});
    });

    it('should show a pop up on confirmAction', function () {
        var appointment = {uuid: 'appointmentUuid'};
        var toStatus = 'Completed';
        var onDate = new Date();
        var translatedMessage = 'Are you sure you want change status to ' + toStatus + '?';
        $translate.instant.and.returnValue(translatedMessage);
        confirmBox.and.callFake(function (config) {
            expect($translate.instant).toHaveBeenCalledWith('APPOINTMENT_STATUS_CHANGE_CONFIRM_MESSAGE', {toStatus: toStatus});
            expect(config.scope.message).toEqual(translatedMessage);
            expect(config.scope.no).toEqual(jasmine.any(Function));
            expect(config.scope.yes).toEqual(jasmine.any(Function));
            expect(config.actions).toEqual([{name: 'yes', display: 'YES_KEY'}, {name: 'no', display: 'NO_KEY'}]);
            expect(config.className).toEqual('ngdialog-theme-default');
        });

        calendarViewPopUp(rootScope.config);
        popUpScope.confirmAction(appointment, toStatus, onDate);
        expect(confirmBox).toHaveBeenCalled();
    });

    it('should change status on confirmation on confirmAction', function () {
        var appointment = {uuid: 'appointmentUuid', status: 'Scheduled'};
        var toStatus = 'Cancelled';
        var message = "Successfully changed appointment status to Cancelled";
        appointmentsService.changeStatus.and.returnValue(specUtil.simplePromise({}));
        $translate.instant.and.returnValue(message);
        confirmBox.and.callFake(function (config) {
            var close = jasmine.createSpy('close');
            config.scope.yes(close).then(function () {
                expect(appointmentsService.changeStatus).toHaveBeenCalledWith(appointment.uuid, toStatus, undefined, undefined);
                expect(appointment.status).toBe(toStatus);
                expect(close).toHaveBeenCalled();
                expect(messagingService.showMessage).toHaveBeenCalledWith('info', message);
            });
        });
        calendarViewPopUp(rootScope.config);
        popUpScope.confirmAction(appointment, toStatus);
    });

    it('should call passed function on cancel on confirmAction', function () {
        var appointment = {uuid: 'appointmentUuid', status: 'CheckedIn'};
        var toStatus = 'Completed';
        confirmBox.and.callFake(function (config) {
            var close = jasmine.createSpy('close');
            config.scope.no(close);
            expect(close).toHaveBeenCalled();
        });
        calendarViewPopUp(rootScope.config);
        popUpScope.confirmAction(appointment, toStatus);
    });

    it('should show popup with accept button if appointment request is enabled and provider has a AWAITING invite', function () {
        appDescriptor.getConfigValue.and.callFake(function (value) {
            return value === 'enableAppointmentRequests';
        });
        var appointments = [
            {
                patient: {identifier: "GAN203012", name: "patient1", uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"}
            }
        ];
        var config = {scope: {appointments: appointments}};
        calendarViewPopUp(config);

        let args = ngDialog.open.calls.allArgs()[0][0];
        let expectedSubstring = "{{::'ACCEPT_APPOINTMENT_REQUEST' | translate}}";
        expect(args.template).toContain(expectedSubstring);
    });

    describe('isAllowedAction', function () {
        it('should init with empty array if config is undefined', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActions') {
                    return undefined;
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.allowedActions).toEqual([]);
        });

        it('should init with configured actions if config is present', function () {
            var allowedActionsConfig = ['Missed', 'CheckedIn'];
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActions') {
                    return allowedActionsConfig;
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.allowedActions).toEqual(allowedActionsConfig);
        });

        it('should return false if config is empty', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActions') {
                    return undefined;
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.isAllowedAction('Missed')).toBeFalsy();
            expect(popUpScope.isAllowedAction('Completed')).toBeFalsy();
            expect(popUpScope.isAllowedAction('Random')).toBeFalsy();
        });

        it('should return true if action exists in config', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActions') {
                    return ['Completed', 'CheckedIn'];
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.isAllowedAction('Completed')).toBeTruthy();
            expect(popUpScope.isAllowedAction('CheckedIn')).toBeTruthy();
        });

        it('should return false if action does not exist in config', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActions') {
                    return ['Completed', 'CheckedIn'];
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.isAllowedAction('Missed')).toBeFalsy();
            expect(popUpScope.isAllowedAction('Random')).toBeFalsy();
        });
    });

    describe('isValidActionAndIsUserAllowedToPerformEdit', function () {
        it('should init with empty object if config is undefined', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActionsByStatus') {
                    return undefined;
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.allowedActionsByStatus).toEqual({});
        });

        it('should init with configured actions if config is present', function () {
            var allowedActionsByStatus = { "Scheduled": ["Completed", "Missed", "Cancelled"] };
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActionsByStatus') {
                    return allowedActionsByStatus;
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.allowedActionsByStatus).toEqual(allowedActionsByStatus);
        });

        it('should return false if no appointment is selected', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActionsByStatus') {
                    return {CheckedIn: ['Completed']};
                }
                return value;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.isValidActionAndIsUserAllowedToPerformEdit(undefined, 'Missed')).toBeFalsy();
        });

        it('should return false if allowedActionsByStatus is undefined', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActionsByStatus') {
                    return undefined;
                }
                return value;
            });
            rootScope.currentUser = {privileges: [{
                name: Bahmni.Appointments.Constants.privilegeManageAppointments
            }]};
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.allowedActionsByStatus).toEqual({});
            var appointment = {uuid: 'appointmentUuid', status: 'CheckedIn'};

            expect(popUpScope.isValidActionAndIsUserAllowedToPerformEdit(appointment, 'Completed')).toBeFalsy();
        });

        it('should return true if action exists in allowedActionsByStatus', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActionsByStatus') {
                    return { CheckedIn: ['Completed'] };
                }
                return value;
            });
            rootScope.currentUser = {privileges: [{
                    name: Bahmni.Appointments.Constants.privilegeManageAppointments
                }]};
            calendarViewPopUp(rootScope.config);
            var appointment = {uuid: 'appointmentUuid', status: 'CheckedIn'};
            expect(popUpScope.isValidActionAndIsUserAllowedToPerformEdit(appointment, 'Completed')).toBeTruthy();
        });

        it('should return false if action does not exist in allowedActionsByStatus', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                if (value === 'allowedActionsByStatus') {
                    return { Scheduled: ['CheckedIn'] };
                }
                return value;
            });
            rootScope.currentUser = {privileges: [{
                    name: Bahmni.Appointments.Constants.privilegeManageAppointments
                }]};
            calendarViewPopUp(rootScope.config);
            var appointment = {uuid: 'appointmentUuid', status: 'Scheduled'};

            expect(popUpScope.isValidActionAndIsUserAllowedToPerformEdit(appointment, 'Completed')).toBeFalsy();
        });

        it('should return false if user does not have the required privileges', function () {
            calendarViewPopUp(rootScope.config);
            var appointment = {};

            expect(popUpScope.isValidActionAndIsUserAllowedToPerformEdit(appointment, 'Completed')).toBeFalsy();
        });
    });

    describe('isEditAllowed', function () {
        it('should return true if maxAppointmentProviders config value is greater than 1', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                return 3;
            });
            calendarViewPopUp(rootScope.config);

            expect(popUpScope.isEditAllowed()).toBeTruthy();
        });

        it('should return false if maxAppointmentProviders config value is 1 and logged provider is not in appointment', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                return 1;
            });
            calendarViewPopUp(rootScope.config);
            expect(popUpScope.isEditAllowed()).toBe(false);
        });
    });

    describe('isResponseAwaitingForCurrentProvider', function () {
        it('should return false if current provider is not of appointment', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                return value === 'enableAppointmentRequests';
            });
            var appointments = [{
                patient: {identifier: "GAN203012",name: "patient1",uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"},
                providers:[{uuid:'xyz1', response:'AWAITING'}]
            }];
            rootScope.currentProvider = {uuid:'xyz0'};
            var config = {scope: {appointments: appointments}};

            calendarViewPopUp(config);
            expect(popUpScope.isResponseAwaitingForCurrentProvider(appointments[0])).toBe(false);
        });

        it('should return true if current provider has got an invite for appointment', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                return value === 'enableAppointmentRequests';
            });
            var appointments = [{
                patient: {identifier: "GAN203012",name: "patient1",uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"},
                providers:[{uuid:'xyz1', response:'AWAITING'}]
            }];
            rootScope.currentProvider = {uuid:'xyz1'};
            var config = {scope: {appointments: appointments}};

            calendarViewPopUp(config);
            expect(popUpScope.isResponseAwaitingForCurrentProvider(appointments[0])).toBe(true);
        });

        it('should return false if current has already accepted the appointment invite', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                return value === 'enableAppointmentRequests';
            });
            var appointments = [{
                patient: {identifier: "GAN203012",name: "patient1",uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"},
                providers:[{uuid:'xyz1', response:'ACCEPTED'}]
            }];
            rootScope.currentProvider = {uuid:'xyz0'};
            var config = {scope: {appointments: appointments}};

            calendarViewPopUp(config);
            expect(popUpScope.isResponseAwaitingForCurrentProvider(appointments[0])).toBe(false);
        });
    });

    describe('acceptAppointmentInviteForCurrentProvider', function () {
        it('should change provider response when click on ACCEPT', function () {
            appDescriptor.getConfigValue.and.callFake(function (value) {
                return value === 'enableAppointmentRequests';
            });
            var appointments = [{
                patient: {identifier: "GAN203012",name: "patient1",uuid: "03dba27a-dbd3-464a-8713-24345aa51e1e"},
                providers:[{uuid:'xyz1', response:'AWAITING'}],
                uuid:'abc1'
            }];
            rootScope.currentProvider = {uuid:'xyz1'};
            var config = {scope: {appointments: appointments}};
            var message = "Successfully Accepted the appointment invite.";
            appointmentsService.changeProviderResponse.and.returnValue(specUtil.simplePromise({}));
            $translate.instant.and.returnValue(message);

            confirmBox.and.callFake(function (config) {
                var close = jasmine.createSpy('close');
                config.scope.yes(close).then(function () {
                    expect(appointmentsService.changeProviderResponse).toHaveBeenCalledWith(appointments[0].uuid, 'xyz1', 'ACCEPTED');
                    expect(appointments[0].providers[0].response).toBe("ACCEPTED");
                    expect(close).toHaveBeenCalled();
                    expect(messagingService.showMessage).toHaveBeenCalledWith('info', message);
                });
            });
            calendarViewPopUp(config);
            popUpScope.acceptAppointmentInviteForCurrentProvider(appointments[0]);
        });
    });

});
