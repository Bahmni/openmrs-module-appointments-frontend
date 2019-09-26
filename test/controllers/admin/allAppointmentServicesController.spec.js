'use strict';

describe("AllAppointmentServicesController", function () {
    var controller, location, scope, appointmentsServiceService, spinnerService, appService, appDescriptor, ngDialog;

    beforeEach(function () {
        module('bahmni.appointments');
        inject(function($controller, $rootScope, $location) {
            scope = $rootScope.$new();
            location = $location;
            controller = $controller;
            appointmentsServiceService = jasmine.createSpyObj('appointmentsServiceService', ['getAllServices']);
            appService = jasmine.createSpyObj('appService', ['getAppDescriptor']);
            appDescriptor = jasmine.createSpyObj('appDescriptor', ['getConfigValue']);
            appService.getAppDescriptor.and.returnValue(appDescriptor);
            appDescriptor.getConfigValue.and.returnValue(true);
            spinnerService = jasmine.createSpyObj('spinnerService', ['forPromise']);
            ngDialog = jasmine.createSpyObj('ngDialog', ['open']);
        })});

    var createController = function () {
        spinnerService.forPromise.and.callFake(function () {
            return {
                then: function () {
                    return {};
                }
            };
        });

        controller('AllAppointmentServicesController', {
            $scope: scope,
            $location: location,
            appointmentsServiceService: appointmentsServiceService,
            spinner: spinnerService,
            appService: appService,
            ngDialog: ngDialog
        });
    };

    it('should get all existing services', function () {
        var response = [{name: "cardio", description: "cardiology", speciality: {name: "General", uuid: "someuid"}}];
        appointmentsServiceService.getAllServices.and.returnValue(specUtil.simplePromise({data: response}));
        createController();
        expect(scope.enableSpecialities).toBe(true);
        expect(scope.appointmentServices).toEqual(response);
    });

    it('should open dialog for deleting appointmentservice', function () {
        var services = [{name: "cardio", description: "cardiology", speciality: {name: "General", uuid: "someuid"}}];
        appointmentsServiceService.getAllServices.and.returnValue(specUtil.simplePromise({data: services}));
        createController();

        scope.deleteAppointmentService(services[0]);

        let args = ngDialog.open.calls.allArgs()[0][0];
        expect(args.plain).toBeTruthy();
        expect(args.template).toContain("<p>{{'APPOINTMENT_SERVICE_CONFORMATION_POPUP_MESSAGE_FOR_DELETE' | translate}}: <b> {{ service.name }} </b>?</p>");
        expect(args.className).toEqual('ngdialog-theme-default');
        expect(args.data).toEqual({service: services[0]});
        expect(args.controller).toEqual('deleteAppointmentServiceController');
    });
});
