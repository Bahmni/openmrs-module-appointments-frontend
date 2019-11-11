import {react2angular} from 'react2angular';
import AddAppointmentContainer from './react-components/containers/AddAppointmentContainer.jsx';
import CancelConfirmation from "./react-components/components/CancelConfirmation/CancelConfirmation.jsx";

angular.module('bahmni.appointments')
    .component('reactAddAppointment', react2angular(AddAppointmentContainer));

angular.module('bahmni.appointments')
    .component('cancelConfirmation', react2angular(CancelConfirmation));

// Used this component to pass a callback function to react component
angular.module('bahmni.appointments').component('reactAddAppointmentWrapper', {
    template: '<react-add-appointment on-back="onBack" state="state">',
    controller: reactAddAppointmentController
});

angular.module('bahmni.appointments').run(['$templateCache', function ($templateCache) {
    $templateCache.put('templateId', '<cancel-confirmation close="onClose" on-back="onBack">');
}]);

reactAddAppointmentController.$inject = ['$rootScope', '$location', '$scope', '$state', 'ngDialog'];

function reactAddAppointmentController($rootScope, $location, $scope, $state, ngDialog) {
    var onBack = false;
    var backUrl = "^";
    $scope.onBack = function (state) {
        onBack = true;
        $state.go(backUrl, state.params, {reload: true});
        ngDialog.close();
    };

    $state.showCancelConfirmation = false;
    $scope.$on('$stateChangeStart', function (event, next, current) {
        if (!onBack) {
            if (next.url === "/service") {
                event.preventDefault();
                backUrl = "home.admin.service";
                $scope.dialog = ngDialog.open({
                    template: 'templateId',
                    className: 'ngdialog-react-popup',
                    scope: $scope
                });
            }
            else if (next.url === "/manage") {
                event.preventDefault();
                backUrl = "home.manage";
                $scope.dialog = ngDialog.open({
                    template: 'templateId',
                    className: 'ngdialog-react-popup',
                    scope: $scope
                });
            }
            else if (next.url !== $location.path()) {
                onBack = true;
                event.preventDefault();
                backUrl = "^";
                $scope.dialog = ngDialog.open({
                    template: 'templateId',
                    className: 'ngdialog-react-popup',
                    scope: $scope
                });
            }
        }
    });
    $scope.onClose = function () {
        $scope.dialog.close();
    };
    $scope.state = $state;
}
