import {react2angular} from 'react2angular';
import AddAppointmentContainer from './react-components/containers/AddAppointmentContainer.jsx';
import CancelConfirmation from "./react-components/components/CancelConfirmation/CancelConfirmation.jsx";

angular.module('bahmni.appointments')
.component('reactAddAppointment', react2angular(AddAppointmentContainer));

angular.module('bahmni.appointments')
    .component('cancelConfirmation', react2angular(CancelConfirmation));

// Used this component to pass a callback function to react component
angular.module('bahmni.appointments').component('reactAddAppointmentWrapper',{
    template: '<div><react-add-appointment on-back="onBack" state="state">' +
        '</div>',
    controller: reactAddAppointmentController
});

angular.module('bahmni.appointments').run(['$templateCache', function($templateCache) {
    $templateCache.put('templateId', '<cancel-confirmation close="onClose" on-back="onBack">');
}]);

reactAddAppointmentController.$inject = ['$rootScope','$location','$scope', '$state','ngDialog'];
function reactAddAppointmentController($rootScope,$location,$scope, $state,ngDialog) {
    $scope.onBack = function (state) {
        $state.go('^', state.params, {reload: true});
    };
    $state.showCancelConfirmation= false;
    $scope.$on('$stateChangeStart', function(event, next, current) {
        event.preventDefault();
        console.log('location change',$location.path());
        $scope.dialog = ngDialog.open({ template: 'templateId', className: 'ngdialog-theme-default', scope: $scope });
    });
    $scope.onClose= function(){
        ngDialog.close();
    }

    $scope.state = $state;
}
