import {getPatientName} from "./patientMapper";

describe('Patient Mapper', () => {
    it('should return full name joining givenName and familyName', () => {
        const actualResult = getPatientName({
            givenName: 'givenName',
            familyName: 'familyName'
        });

        expect(actualResult).toEqual('givenName familyName');
    });

    it('should return only given name when familyName is undefined', () => {
        const actualResult = getPatientName({
            givenName: 'givenName'
        });

        expect(actualResult).toEqual('givenName');
    });

    it('should return only familyName when given name is undefined', () => {
        const actualResult = getPatientName({
            familyName: 'familyName'
        });

        expect(actualResult).toEqual('familyName');
    });

    it('should return undefined when familyName and given name is undefined', () => {
        const actualResult = getPatientName({});

        expect(actualResult).toEqual("");
    });
});