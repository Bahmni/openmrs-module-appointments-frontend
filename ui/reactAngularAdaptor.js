import {react2angular} from 'react2angular';
import AddAppointmentContainer from './react-components/containers/AddAppointmentContainer.jsx';

angular.module('bahmni.appointments')
.component('reactAddAppointment', react2angular(AddAppointmentContainer));

// Used this component to pass a callback function to react component
angular.module('bahmni.appointments').component('reactAddAppointmentWrapper',{
    template: '<react-add-appointment on-back="onBack" set-view-date="setViewDate">',
    controller: reactAddAppointmentController
});

reactAddAppointmentController.$inject = ['$scope', '$state'];
function reactAddAppointmentController($scope, $state) {
    $scope.onBack = function () {
        $state.go('^', $state.params, {reload: true});
    };

    $scope.setViewDate = function (date) {
      $state.params.viewDate = date;
    };
}
