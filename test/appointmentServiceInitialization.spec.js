'use strict';

describe('AppointmentServiceInitialization', function () {
    var appointmentServiceInitialization, appointmentsServiceService, serviceUuid;
    beforeEach(function () {
        appointmentsServiceService = jasmine.createSpyObj('appointmentsServiceService', ['getService']);
        
    });

    beforeEach(module('bahmni.appointments', function ($provide) {
        $provide.value('appointmentsServiceService', appointmentsServiceService);
    }));

    beforeEach(function () {
        inject(['appointmentServiceInitialization', function (_appointmentServiceInitialization_) {
            appointmentServiceInitialization = _appointmentServiceInitialization_;
        }]);
    });

    it('should not call "getService" when serviceUuid is "new"', function () {
        serviceUuid="new";
        appointmentServiceInitialization(serviceUuid);
        expect(appointmentsServiceService.getService).not.toHaveBeenCalled();
    });

    it('should call "getService" when serviceUuid is not "new"', function () {
        serviceUuid="not new";
        var appointmentServices = [{
            name: 'Knee',
            description: 'treatment',
            uuid: 'serviceUuid',
            serviceTypes: [{name: 'type1', duration: 15}]
        }];
        appointmentsServiceService.getService.and.returnValue(specUtil.simplePromise({data: appointmentServices[0]}));
        appointmentServiceInitialization(serviceUuid);
        expect(appointmentsServiceService.getService).toHaveBeenCalled();
    });
});