import {getComponentsDisableStatus} from "./DisableComponentsHelper";
import {CHECKED_IN_APPOINTMENT_STATUS, SCHEDULED_APPOINTMENT_STATUS} from "../../constants";

describe('Disable components helper', () => {
    it('should disable service and speciality when appointment status is scheduled and isServiceOnAppointmentEditable ' +
        'config is false', () => {
        const componentDisableStatus = getComponentsDisableStatus({status: SCHEDULED_APPOINTMENT_STATUS}, false);

        expect(componentDisableStatus.service).toBeTruthy();
        expect(componentDisableStatus.speciality).toBeTruthy();
    });

    it('should disable service and speciality when appointment status is not scheduled or checked in and ' +
        'isServiceOnAppointmentEditable config is true', () => {
        const componentStatus = getComponentsDisableStatus({status: 'random-status'}, true);

        expect(componentStatus.service).toBeTruthy();
        expect(componentStatus.speciality).toBeTruthy();
    });

    it('should enable service and speciality when appointment status is scheduled and ' +
        'isServiceOnAppointmentEditable config is true', () => {
        const componentStatus = getComponentsDisableStatus({status: CHECKED_IN_APPOINTMENT_STATUS}, true);

        expect(componentStatus.service).toBeFalsy();
        expect(componentStatus.speciality).toBeFalsy();
    });

    it('should disable service and speciality when appointment status is not scheduled or checked in and ' +
        'isServiceOnAppointmentEditable config is false', () => {
        const componentStatus = getComponentsDisableStatus({status: 'random-status'}, false);

        expect(componentStatus.service).toBeTruthy();
        expect(componentStatus.speciality).toBeTruthy();
    });

    it('should disable service and speciality when appointment status is not scheduled or checked in and ' +
        'isServiceOnAppointmentEditable config is not provided', () => {
        const componentStatus = getComponentsDisableStatus({status: 'random-status'}, undefined);

        expect(componentStatus.service).toBeTruthy();
        expect(componentStatus.speciality).toBeTruthy();
    });
});
