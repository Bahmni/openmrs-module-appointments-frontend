'use strict';

angular.module('bahmni.appointments')
    .directive('patientSearch', ['patientService', 'appointmentsService', 'spinner', '$state', '$location',
        function (patientService, appointmentsService, spinner, $state, $location) {
        return {
            restrict: "E",
            scope: {
                onSearch: "="
            },
            template: require("../views/manage/patientSearch.html"),
            link: {
                pre: function ($scope) {
                    $scope.search = function () {
                        return spinner.forPromise(patientService.luceneSearch($scope.patient).then(function (response) {
                            return response.data.pageOfResults;
                        }));
                    };

                    $scope.responseMap = function (data) {
                        return _.map(data, function (patientInfo) {
                            var familyName = patientInfo.familyName ? " " + patientInfo.familyName : '';
                            patientInfo.label = patientInfo.givenName + familyName + " " + "(" + patientInfo.identifier + ")";
                            return patientInfo;
                        });
                    };

                    $scope.onSelectPatient = function (data) {
                        $state.params.patient = data;
                        spinner.forPromise(appointmentsService.search({patientUuids: [data.uuid]}).then(function (oldAppointments) {
                            var appointmentInDESCOrderBasedOnStartDateTime = _.sortBy(oldAppointments.data, "startDateTime").reverse();
                            $scope.onSearch(appointmentInDESCOrderBasedOnStartDateTime);
                        }));
                    };

                    if ($state.params.isSearchEnabled && $state.params.patient) {
                        $scope.patient = $scope.responseMap([$state.params.patient])[0].label;
                        $scope.onSelectPatient($state.params.patient);
                    }

                    if ($location.search()["patient"]) {
                        const uuid = $location.search()["patient"];
                        $scope.isSearchEnabled = true;
                        patientService.getPatient(uuid).then(function (res) {
                            const patient = res.data;
                            let displaySplit = patient.display.split(' - ');
                            $scope.patient =  displaySplit[1] + " (" + displaySplit[0] + ")";
                            $scope.isFilterOpen = false;
                            $scope.onSelectPatient(patient);
                        })
                    }

                    $scope.$watch(function () {
                        return $state.params.isSearchEnabled;
                    }, function (isSearchEnabled) {
                        if (isSearchEnabled == false) {
                            $scope.patient = null;
                        }
                    }, true);
                }
            }
        };
    }]);
