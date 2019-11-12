import {react2angular} from 'react2angular';
import AppointmentContainer from './react-components/containers/AppointmentContainer.jsx';
import CancelConfirmationWrapper from "./react-components/components/CancelConfirmation/CancelConfirmationWrapper.jsx";

angular.module('bahmni.appointments')
.component('reactAddAppointment', react2angular(AppointmentContainer));

angular.module('bahmni.appointments')
    .component('cancelConfirmationWrapper', react2angular(CancelConfirmationWrapper));

// Used this component to pass a callback function to react component
angular.module('bahmni.appointments').component('reactAddAppointmentWrapper',{
    template: '<react-add-appointment on-back="onBack" set-view-date="setViewDate" appointment-uuid="appointmentUuid" is-recurring="isRecurring" state="state">',
    controller: reactAddAppointmentController
});

angular.module('bahmni.appointments').run(['$templateCache', function ($templateCache) {
    $templateCache.put('templateId', '<cancel-confirmation-wrapper close="onClose" on-back="onBack">');
}]);

reactAddAppointmentController.$inject = ['$rootScope', '$location', '$scope', '$state', 'ngDialog', '$stateParams'];
function reactAddAppointmentController($rootScope, $location, $scope, $state, ngDialog, $stateParams) {
    let onBack = false;
    let backUrl = "^";
    $scope.onBack = function () {
        onBack = true;
        $state.go(backUrl, $state.params, {reload: true});
        ngDialog.close();
    };

    $state.showCancelConfirmation = false;
    $scope.$on('$stateChangeStart', function (event, next, current) {
        if (next.url !== "/new" && !onBack) {
            event.preventDefault();
            backUrl = next.name;
            $scope.dialog = ngDialog.open({
                template: 'templateId',
                className: 'ngdialog-react-popup',
                scope: $scope
            });
        }
    });
    $scope.onClose = function () {
        $scope.dialog.close();
    };
    $scope.setViewDate = function (date) {
        $state.params.viewDate = date;
    };
    $scope.appointmentUuid = $state.current.url === '/:uuid?isRecurring' ? $stateParams.uuid : undefined;
    $scope.isRecurring = $stateParams.isRecurring;
    $scope.state = $state;

}
