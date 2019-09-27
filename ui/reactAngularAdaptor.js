import {react2angular} from 'react2angular';
import AddAppointmentContainer from './react-components/containers/AddAppointmentContainer.jsx';

angular.module('bahmni.appointments')
.component('reactAddAppointment', react2angular(AddAppointmentContainer));
