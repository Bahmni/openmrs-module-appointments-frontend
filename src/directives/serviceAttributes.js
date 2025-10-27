'use strict';

angular.module('bahmni.appointments')
    .directive('serviceAttributes', ['appointmentCommonService', function (appointmentCommonService) {
        var controller = ['$scope', function ($scope) {
            $scope.attributeValues = {};

            $scope.hasPrivilege = function (privilege) {
                return appointmentCommonService.hasPrivilege(privilege);
            };

            var init = function () {
                if (!$scope.service) {
                    $scope.service = {};
                }
                if (!$scope.service.attributes) {
                    $scope.service.attributes = [];
                }
                _.each($scope.service.attributes, function (attr) {
                    if (!attr.voided) {
                        $scope.attributeValues[attr.attributeTypeUuid] = attr.value;
                    }
                });
            };

            $scope.getAttributeValue = function (attributeTypeUuid) {
                return $scope.attributeValues[attributeTypeUuid] || '';
            };

            $scope.addOrUpdateAttribute = function (attributeTypeUuid, attributeTypeName, value) {
                if (!$scope.service.attributes) {
                    $scope.service.attributes = [];
                }

                var existingAttr = _.find($scope.service.attributes, function (attr) {
                    return attr.attributeTypeUuid === attributeTypeUuid && !attr.voided;
                });

                if (value && value.trim() !== '') {
                    if (existingAttr) {
                        existingAttr.value = value;
                    } else {
                        $scope.service.attributes.push({
                            attributeTypeUuid: attributeTypeUuid,
                            value: value,
                            voided: false
                        });
                    }
                    $scope.attributeValues[attributeTypeUuid] = value;
                } else {
                    $scope.removeAttribute(attributeTypeUuid);
                }
            };

            $scope.removeAttribute = function (attributeTypeUuid) {
                var existingAttr = _.find($scope.service.attributes, function (attr) {
                    return attr.attributeTypeUuid === attributeTypeUuid && !attr.voided;
                });

                if (existingAttr) {
                    if (!_.isEmpty(existingAttr.uuid)) {
                        existingAttr.voided = true;
                    } else {
                        _.remove($scope.service.attributes, existingAttr);
                    }
                }

                delete $scope.attributeValues[attributeTypeUuid];
            };

            $scope.isRequired = function (attributeType) {
                return attributeType && attributeType.minOccurs && attributeType.minOccurs > 0;
            };

            $scope.getInputType = function (datatype) {
                if (!datatype) {
                    return 'text';
                }

                var lowerDatatype = datatype.toLowerCase();

                if (lowerDatatype.indexOf('boolean') !== -1) {
                    return 'checkbox';
                } else if (lowerDatatype.indexOf('number') !== -1 || lowerDatatype.indexOf('integer') !== -1) {
                    return 'number';
                } else if (lowerDatatype.indexOf('date') !== -1) {
                    return 'date';
                } else {
                    return 'text';
                }
            };

            init();
        }];

        return {
            restrict: 'E',
            scope: {
                service: '=',
                attributeTypes: '='
            },
            template: require("../views/admin/serviceAttributes.html"),
            controller: controller
        };
    }]);
