'use strict';

window.Bahmni = window.Bahmni || {};
Bahmni.Appointments = Bahmni.Appointments || {};

// A hacky fix for https://github.com/angular-ui/ui-calendar/issues/267#issuecomment-158618317
// angular should work with jQuery as selector but it fallsback on jQlite. We force it to use jQuery here.
angular.element = jQuery;

angular.module('bahmni.appointments', ['ui.router', 'bahmni.common.config', 'bahmni.common.uiHelper', 'bahmni.common.i18n',
    'bahmni.common.domain', 'bahmni.common.displaycontrol.patientprofile', 'authentication', 'bahmni.common.appFramework', 'bahmni.common.routeErrorHandler',
    'httpErrorInterceptor', 'pasvaz.bindonce', 'infinite-scroll', 'bahmni.common.util', 'ngSanitize', 'pascalprecht.translate',
    'ngCookies', 'bahmni.common.patient', 'bahmni.common.logging', 'ui.calendar', 'monospaced.elastic', 'ivh.treeview', 'ngTagsInput', 'ngDialog']);

require("./favicon.ico");
require("../lib/jquery/jquery-ui-1.10.4.custom.min.css");
require("ng-dialog/css/ngDialog.min.css");
require("ng-dialog/css/ngDialog-theme-default.min.css");
require("ng-dialog/css/ngDialog-theme-plain.min.css");

require("./styles/appointmentScheduling.scss");
require("fullcalendar-scheduler/dist/scheduler.min.css");
require("fullcalendar/dist/fullcalendar.min.css");
require("angular-ivh-treeview/dist/ivh-treeview.css");
require("angular-ivh-treeview/dist/ivh-treeview-theme-basic.css");
require("ng-tags-input/build/ng-tags-input.bootstrap.min.css");
require("ng-tags-input/build/ng-tags-input.min.css");

require("lodash");
require("../lib/jquery/jquery-ui-1.10.4.custom.min.js");
require("../lib/jquery/jquery.cookie.custom");
require("ng-tags-input");

require("angular-sanitize");
require("ng-infinite-scroll");
require("angular-bindonce/bindonce");
require("select2");
require("angular-ui-select2/src/select2");
require("@uirouter/angularjs");
require("stacktrace-js/stacktrace");
require("ng-clip");
require("angular-translate");
require("angular-cookies");
require("angular-translate-loader-static-files");
require("angular-translate-storage-cookie");
require("angular-translate-storage-local");
require("angular-translate-handler-log");
require("ng-dialog/js/ngDialog");
require("angular-elastic/elastic");
require("angular-ivh-treeview");
require("../lib/angular-workers/dist/angular-workers");

require("./route-errorhandler");

require("bahmni-commons-ng/dist/bahmni-util-commons");
require("bahmni-commons-ng/dist/bahmni-auth-commons");
require("bahmni-commons-ng/dist/bahmni-config-commons");
require("bahmni-commons-ng/dist/bahmni-appframework-commons");
require("bahmni-commons-ng/dist/bahmni-patient-commons");
require("bahmni-commons-ng/dist/bahmni-uihelper-commons");
require("bahmni-commons-ng/dist/bahmni-domain-commons");
require("bahmni-commons-ng/dist/bahmni-logging-commons");
require("bahmni-commons-ng/dist/bahmni-displaycontrols-commons");
require("bahmni-commons-ng/dist/bahmni-i18n-commons");

require("angular-ui-calendar/src/calendar.js");
require("fullcalendar/dist/fullcalendar.min.js");
require("fullcalendar-scheduler/dist/scheduler.min.js");

require("./app.js");
require("./initialization.js");
require("./appointmentServiceInitialization.js");
require("./appointmentInitialization.js");
require("./appointmentConfigInitialization.js");

require("./models/appointment.js");
require("./models/appointmentService.js");
require("./models/appointmentServiceViewModel.js");
require("./models/appointmentViewModel.js");

require("./directives/timeValidator.js");
require("./directives/dayCalendar.js");
require("./directives/weekCalendar.js");
require("./directives/weekdaySelector.js");
require("./directives/serviceAvailability.js");
require("./directives/serviceTypes.js");
require("./directives/colorPicker.js");
require("./directives/datePicker.js");
require("./directives/weekPicker.js");
require("./directives/multiSelectAutocomplete.js");
require("./directives/patientSearch.js");

require("./services/appointmentsServiceService.js");
require("./services/specialityService.js");
require("./services/appointmentsService.js");
require("./services/calendarViewPopUp.js");
require("./services/appointmentCommonService.js");
require("./services/checkinPopUp.js");

require("./controllers/admin/deleteAppointmentServiceController.js" );
require("./controllers/appointmentsHeaderController.js");
require("./controllers/manage/appointmentsManageController.js");
require("./controllers/admin/allAppointmentServicesController.js");
require("./controllers/manage/appointmentsCreateController.js");
require("./controllers/admin/appointmentServiceController.js");
require("./controllers/manage/calendar/appointmentsCalendarViewController.js" );
require("./controllers/manage/calendar/appointmentsDayCalendarController.js");
require("./controllers/manage/calendar/appointmentsWeekCalendarController");
require("./controllers/manage/allAppointmentsController.js" );
require("./controllers/manage/list/appointmentsListViewController.js" );
require("./controllers/manage/appointmentsSummaryController.js" );
require("./controllers/manage/appointmentsFilterController.js");
require("./filters/appointmentsFilter.js");

require("../ui/dist/reactAngularAdaptor.js")

async function loadConstants() {
    return  require("./loadConstants").loadAngularConstants();
}

(async () => {
    await loadConstants();
    angular.bootstrap(document, ['bahmni.appointments']);
})();