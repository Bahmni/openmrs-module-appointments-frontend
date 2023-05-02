import {react2angular} from 'react2angular';
import AppointmentContainer from './react-components/containers/AppointmentContainer.jsx';
import CancelConfirmationWrapper from "./react-components/components/CancelConfirmation/CancelConfirmationWrapper.jsx";
import AppointmentSummaryContainer from "./react-components/containers/AppointmentSummaryContainer.jsx";
import moment from "moment";

angular.module('bahmni.appointments')
.component('reactAddAppointment', react2angular(AppointmentContainer));

angular.module('bahmni.appointments')
.component('reactAppointmentSummary', react2angular(AppointmentSummaryContainer));

angular.module('bahmni.appointments')
    .component('cancelConfirmationWrapper', react2angular(CancelConfirmationWrapper));

// Used this component to pass a callback function to react component
angular.module('bahmni.appointments').component('reactAddAppointmentWrapper',{
    template: '<react-add-appointment on-back="onBack" set-view-date="setViewDate" appointment-uuid="appointmentUuid"' +
        ' is-recurring="isRecurring" state="state" current-provider="currentProvider" appointment-params="appointmentParams"' +
        'url-params="urlParams" >',
    controller: reactAddAppointmentController
});

angular.module('bahmni.appointments').component('reactAppointmentSummaryWrapper',{
    template: '<react-appointment-summary state="state" current-provider="currentProvider" go-to-list-view="goToListView" full-summary="fullSummary">',
    controller: reactAppointmentSummaryController
});

angular.module('bahmni.appointments').run(['$templateCache', function ($templateCache) {
    $templateCache.put('templateId', '<cancel-confirmation-wrapper appointment-uuid="appointmentUuid" close="onClose" on-back="onBack">');
}]);

reactAddAppointmentController.$inject = ['$rootScope', '$location', '$scope', '$state', 'ngDialog', '$stateParams'];
reactAppointmentSummaryController.$inject = ['$rootScope', '$location', '$scope', '$state', 'appService'];
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
    $scope.currentProvider = $rootScope.currentProvider;
    $scope.appointmentParams = $stateParams.appointment;
    $scope.urlParams = $location.$$search;
}

function reactAppointmentSummaryController($rootScope, $location, $scope, $state, appService) {

    $scope.setViewDate = function (date) {
        $state.params.viewDate = date;
    };
    $scope.goToListView = function (date, uuids, type) {
        console.log(type,uuids)
        var params = {
            viewDate: moment(date).toDate(),
            filterParams: {statusList: _.without(Bahmni.Appointments.Constants.appointmentStatusList, "Cancelled")}
        };
        if (uuids && uuids.length !== 0) {
            if(type === 'Locations'){
                console.log('set location');
                params.filterParams.locationUuids = uuids;
            }
            else if(type === 'Providers'){
                console.log('set providers');
                params.filterParams.providerUuids = uuids;
            }
            else{
                params.filterParams.serviceUuids = uuids;
            }
        }
        console.log('params', params);
        $state.go('home.manage.appointments.list', params);
    }
    $scope.state = $state;
    $scope.currentProvider = $rootScope.currentProvider;
    $scope.fullSummary = appService.getAppDescriptor().getConfigValue('enableDetailedSummaryView')

}
