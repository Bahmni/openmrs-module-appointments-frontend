'use strict';

describe('AppointmentCommonService', function () {
    var appointmentCommonService;
    const mockState = { params: { filterParams: {} } };
    const mockLocation = jasmine.createSpyObj('$location', ['search']);
    
    beforeEach(function () {
        module('bahmni.appointments');
    });

    beforeEach(module(function ($provide) {
        $provide.value('$location', mockLocation);
        $provide.value('$state', mockState);
    }));

    beforeEach(inject(['appointmentCommonService', function (appointmentCommonServiceInjected) {
        appointmentCommonService = appointmentCommonServiceInjected;
    }]));

    describe('isCurrentUserHavingPrivilege', function () {
        it('should return true if current user does not have the given privilege ', function () {
            var privilege = 'testPrivilege';
            var currentUserPrivileges = [{name: Bahmni.Appointments.Constants.privilegeManageAppointments},
                {name: 'testPrivilege'}];
            expect(appointmentCommonService.isCurrentUserHavingPrivilege(privilege, currentUserPrivileges)).toBeTruthy();
        });
        it('should return false if current user does not have the given privilege ', function () {
            var privilege = 'testPrivilege';
            var currentUserPrivileges = [{name: Bahmni.Appointments.Constants.privilegeManageAppointments}];
            expect(appointmentCommonService.isCurrentUserHavingPrivilege(privilege, currentUserPrivileges)).toBeFalsy();
        });
    });

    describe('isUserAllowedToPerformEdit', function () {
        it('should return true if currentUser has manageAppointments privilege', function () {
            var currentUser = {
                privileges: [{
                    name: Bahmni.Appointments.Constants.privilegeManageAppointments
                }]
            };
            var appointmentProvider = {uuid: 'provider1Uuid'};
            var currentProvider = {uuid: 'providerUuId'};

            expect(appointmentCommonService.isUserAllowedToPerformEdit(appointmentProvider,currentUser.privileges,currentProvider.uuid)).toBeTruthy();
        });

        it('should return false if currentUser does not have manage/ownAppointment privileges', function () {
            var currentUser = {privileges: []};
            var appointmentProvider = {uuid: 'provider1Uuid'};
            var currentProvider = {uuid: 'providerUuId'};
            expect(appointmentCommonService.isUserAllowedToPerformEdit(appointmentProvider,currentUser.privileges,currentProvider.uuid)).toBeFalsy();
        });

        it('should return true if currentUser has ownAppointment privilege and selected appointment\'s providers list is empty', function () {
            var currentUser = {
                privileges: [
                    {name: Bahmni.Appointments.Constants.privilegeOwnAppointments}
                ]
            };
            var appointmentProvider = [];
            var currentProvider = {uuid: 'providerUuId'};

            expect(appointmentCommonService.isUserAllowedToPerformEdit(appointmentProvider,currentUser.privileges,currentProvider.uuid)).toBeTruthy();
        });

        it('should return true if currentUser has ownAppointment privilege and is the provider in the selected appointment\'s providers list', function () {
            var currentUser = {
                privileges: [
                    {name: Bahmni.Appointments.Constants.privilegeOwnAppointments}
                ]
            };
            var appointmentProvider = [{uuid: 'providerUuId', response: 'ACCEPTED'}];
            var currentProvider = {uuid: 'providerUuId'};

            expect(appointmentCommonService.isUserAllowedToPerformEdit(appointmentProvider,currentUser.privileges,currentProvider.uuid)).toBeTruthy();
        });

        it('should return false if currentUser has ownAppointment privilege and is not the provider in the selected appointment\'s providers list', function () {
            var currentUser = {
                privileges: [
                    {name: Bahmni.Appointments.Constants.privilegeOwnAppointments}
                ]
            };
            var appointmentProvider = [{uuid: 'provider1UuId',response: 'ACCEPTED'}];
            var currentProvider={uuid: 'providerUuId'};

            expect(appointmentCommonService.isUserAllowedToPerformEdit(appointmentProvider,currentUser.privileges,currentProvider.uuid)).toBeFalsy();
        });
    });

    describe('addProviderToFilterFromQueryString', function() {
        it('should assign provider uuid to state params filter', function(){
            mockLocation.search.and.returnValue({'provider': 'test-provider-id'})
            
            appointmentCommonService.addProviderToFilterFromQueryString();
            
            expect(mockState.params.filterParams.providerUuids[0]).toBe('test-provider-id');
        });

        it('should not assign provider uuid to state params filter when querystring does not have', function(){
            mockState.params.filterParams.providerUuids = [];
            mockLocation.search.and.returnValue({});

            appointmentCommonService.addProviderToFilterFromQueryString();

            expect(mockState.params.filterParams.providerUuids.length).toBe(0);
        });

        it('should adds provider uuid to existing state params filter', function(){
            mockState.params.filterParams.providerUuids = ['existing-provider'];
            mockLocation.search.and.returnValue({'provider': 'test-provider-id'})
            
            appointmentCommonService.addProviderToFilterFromQueryString();
            
            expect(mockState.params.filterParams.providerUuids[0]).toBe('existing-provider');
            expect(mockState.params.filterParams.providerUuids[1]).toBe('test-provider-id');
        });

        it('should not add provider uuid to filter if already exists', function(){
            mockState.params.filterParams.providerUuids = ['existing-provider'];
            mockLocation.search.and.returnValue({'provider': 'existing-provider'})
            
            appointmentCommonService.addProviderToFilterFromQueryString();
            
            expect(mockState.params.filterParams.providerUuids.length).toBe(1);
            expect(mockState.params.filterParams.providerUuids[0]).toBe('existing-provider');
        });

        it('should initialize providerUuids list', function(){
            mockState.params.filterParams.providerUuids = undefined;
            mockLocation.search.and.returnValue({'provider': 'existing-provider'})
            
            appointmentCommonService.addProviderToFilterFromQueryString();
            
            expect(mockState.params.filterParams.providerUuids.length).toBe(1);
            expect(mockState.params.filterParams.providerUuids[0]).toBe('existing-provider');
        });
    });
});

