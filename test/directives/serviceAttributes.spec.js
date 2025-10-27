'use strict';

describe('ServiceAttributes', function () {
    var compile, scope, httpBackend, ngDialog, appointmentCommonService;

    beforeEach(module('bahmni.appointments', function ($provide) {
        ngDialog = jasmine.createSpyObj('ngDialog', ['openConfirm', 'close']);
        appointmentCommonService = jasmine.createSpyObj('appointmentCommonService', ['hasPrivilege']);
        appointmentCommonService.hasPrivilege.and.returnValue(true);

        $provide.value('ngDialog', ngDialog);
        $provide.value('appointmentCommonService', appointmentCommonService);
    }));

    beforeEach(inject(function ($compile, $httpBackend, $rootScope) {
        compile = $compile;
        scope = $rootScope.$new();
        httpBackend = $httpBackend;
        httpBackend.expectGET('./i18n/appointments/locale_en.json').respond({});
        httpBackend.expectGET('/bahmni_config/openmrs/i18n/appointments/locale_en.json').respond({});

        scope.service = {
            name: 'Ortho',
            description: 'for Ortho appointments',
            attributes: []
        };

        scope.attributeTypes = [
            {
                uuid: 'attr-type-1',
                name: 'Color Code',
                description: 'Color code for the service',
                datatype: 'org.openmrs.customdatatype.datatype.FreeTextDatatype',
                minOccurs: 0,
                maxOccurs: 1
            },
            {
                uuid: 'attr-type-2',
                name: 'Priority',
                description: 'Priority level',
                datatype: 'org.openmrs.customdatatype.datatype.FreeTextDatatype',
                minOccurs: 1,
                maxOccurs: 1
            }
        ];

        var element = createElement();
        scope = element.isolateScope();
    }));

    var createElement = function () {
        var html = '<service-attributes service="service" attribute-types="attributeTypes"></service-attributes>';
        var element = compile(angular.element(html))(scope);
        scope.$digest();
        httpBackend.flush();
        return element;
    };

    it("should initialize attributes from service", function () {
        expect(scope.service.attributes).toBeDefined();
        expect(scope.service.attributes.length).toBe(0);
    });

    it("should add attribute value", function () {
        scope.addOrUpdateAttribute('attr-type-1', 'Color Code', '#FF5733');

        expect(scope.service.attributes.length).toBe(1);
        expect(scope.service.attributes[0].attributeTypeUuid).toBe('attr-type-1');
        expect(scope.service.attributes[0].value).toBe('#FF5733');
    });

    it("should update existing attribute value", function () {
        scope.service.attributes = [{
            uuid: 'attr-uuid-1',
            attributeTypeUuid: 'attr-type-1',
            value: '#FF5733',
            voided: false
        }];

        scope.addOrUpdateAttribute('attr-type-1', 'Color Code', '#00FF00');

        expect(scope.service.attributes.length).toBe(1);
        expect(scope.service.attributes[0].value).toBe('#00FF00');
        expect(scope.service.attributes[0].uuid).toBe('attr-uuid-1');
    });

    it("should remove attribute when value is cleared", function () {
        scope.service.attributes = [{
            uuid: 'attr-uuid-1',
            attributeTypeUuid: 'attr-type-1',
            value: '#FF5733',
            voided: false
        }];

        scope.removeAttribute('attr-type-1');

        var nonVoidedAttrs = scope.service.attributes.filter(function(attr) {
            return !attr.voided;
        });
        expect(nonVoidedAttrs.length).toBe(0);
        expect(scope.service.attributes.length).toBe(1);
        expect(scope.service.attributes[0].voided).toBe(true);
    });

    it("should void existing saved attribute when removed", function () {
        scope.service.attributes = [{
            uuid: 'attr-uuid-1',
            attributeTypeUuid: 'attr-type-1',
            value: '#FF5733',
            voided: false
        }];

        scope.removeAttribute('attr-type-1');

        var voidedAttr = scope.service.attributes.find(function(attr) {
            return attr.uuid === 'attr-uuid-1';
        });

        expect(voidedAttr).toBeDefined();
        expect(voidedAttr.voided).toBeTruthy();
    });

    it("should get attribute value by type uuid", function () {
        scope.service.attributes = [{
            attributeTypeUuid: 'attr-type-1',
            value: '#FF5733',
            voided: false
        }];

        scope.attributeValues = {};
        scope.service.attributes.forEach(function (attr) {
            if (!attr.voided) {
                scope.attributeValues[attr.attributeTypeUuid] = attr.value;
            }
        });

        var value = scope.getAttributeValue('attr-type-1');

        expect(value).toBe('#FF5733');
    });

    it("should return empty string if attribute not found", function () {
        var value = scope.getAttributeValue('non-existent');

        expect(value).toBe('');
    });
});
