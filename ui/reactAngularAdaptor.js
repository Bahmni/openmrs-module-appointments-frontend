import {react2angular} from 'react2angular';
import AppointmentContainer from './react-components/containers/AppointmentContainer.jsx';

angular.module('bahmni.appointments')
.component('reactAddAppointment', react2angular(AppointmentContainer));

// Used this component to pass a callback function to react component
angular.module('bahmni.appointments').component('reactAddAppointmentWrapper',{
    template: '<react-add-appointment on-back="onBack" set-view-date="setViewDate" appointment-uuid="appointmentUuid" is-recurring="isRecurring">>',
    controller: reactAddAppointmentController
});

reactAddAppointmentController.$inject = ['$scope', '$state', '$stateParams'];
function reactAddAppointmentController($scope, $state, $stateParams) {
    $scope.onBack = function () {
        $state.go('^', state.params, {reload: true});
    };

    $scope.setViewDate = function (date) {
        $state.params.viewDate = date;
    };
    $scope.appointmentUuid = $state.current.url === '/:uuid' ? $stateParams.uuid : undefined;
    $scope.isRecurring = $stateParams.isRecurring;
}
