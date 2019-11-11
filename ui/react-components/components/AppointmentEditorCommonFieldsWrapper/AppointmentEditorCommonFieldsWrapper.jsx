import {Fragment} from "react";
import classNames from "classnames";
import {
    searchFieldsContainer,
    searchFieldsContainerLeft,
    searchFieldsContainerRight
} from "./AppointmentEditorCommonFieldsWrapper.module.scss";
import PatientSearch from "../PatientSearch/PatientSearch.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import ServiceSearch from "../Service/ServiceSearch.jsx";
import ServiceTypeSearch from "../Service/ServiceTypeSearch.jsx";
import {isSpecialitiesEnabled, maxAppointmentProvidersAllowed} from "../../helper";
import SpecialitySearch from "../Speciality/SpecialitySearch.jsx";
import LocationSearch from "../Location/LocationSearch.jsx";
import ProviderSearch from "../Provider/ProviderSearch.jsx";
import React from "react";
import {injectIntl} from "react-intl";
import {getErrorTranslations} from "../../utils/ErrorTranslationsUtil";
import {includes, filter} from "lodash";

const AppointmentEditorCommonFieldsWrapper = props => {

    const {updateAppointmentDetails, updateErrorIndicators} = props;
    const {appointmentDetails, errors, endTimeBasedOnService, appConfig, intl} = props;
    const errorTranslations = getErrorTranslations(intl);

    return (
        <Fragment>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div data-testid="patient-search">
                        <PatientSearch
                            value={appointmentDetails.patient}
                            onChange={(optionSelected) => {
                                const newValue = optionSelected ? optionSelected : undefined;
                                updateAppointmentDetails({patient: newValue});
                                updateErrorIndicators({patientError: !newValue});
                            }}/>
                        <ErrorMessage
                            message={errors.patientError ? errorTranslations.patientErrorMessage : undefined}/>
                    </div>
                    <div data-testid="service-search">
                        <ServiceSearch value={appointmentDetails.service} onChange={(optionSelected) => {
                            updateAppointmentDetails({service: optionSelected});
                            updateErrorIndicators({serviceError: !optionSelected});
                            endTimeBasedOnService(appointmentDetails.startTime, optionSelected.value, undefined);
                        }}
                                       specialityUuid={appointmentDetails.speciality
                                       && appointmentDetails.speciality.value
                                       && appointmentDetails.speciality.value.uuid}/>
                        <ErrorMessage
                            message={errors.serviceError ? errorTranslations.serviceErrorMessage : undefined}/>
                    </div>
                    <div data-testid="service-type-search">
                        <ServiceTypeSearch  value={appointmentDetails.serviceType} onChange={(optionSelected) => {
                            updateAppointmentDetails({serviceType: optionSelected});
                            endTimeBasedOnService(appointmentDetails.startTime, undefined, optionSelected);
                        }}
                                           serviceUuid={appointmentDetails.service && appointmentDetails.service.value.uuid}/>
                    </div>
                    {isSpecialitiesEnabled(appConfig) ?
                        <div data-testid="speciality-search">
                            <SpecialitySearch value={appointmentDetails.speciality}
                                onChange={(optionSelected) => updateAppointmentDetails({speciality: optionSelected})}/>
                        </div> : null
                    }
                    <div data-testid="location-search">
                        <LocationSearch value={appointmentDetails.location}
                            onChange={(optionSelected) => updateAppointmentDetails({location: optionSelected})}/>
                        <ErrorMessage message={undefined}/>
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)} data-testid="provider-search">
                    <ProviderSearch
                        onChange={selectedProvider => includes(appointmentDetails.providers, selectedProvider)
                            || updateAppointmentDetails({providers: [...appointmentDetails.providers, selectedProvider]})
                        }
                        onProviderRemove={providerIdentifier => updateAppointmentDetails({providers: filter(appointmentDetails.providers, provider => provider.value !== providerIdentifier)})}
                        selectedProviders={appointmentDetails.providers}
                        maxAppointmentProvidersAllowed={maxAppointmentProvidersAllowed(appConfig)}/>
                </div>
            </div>
        </Fragment>
    );
};

export default injectIntl(AppointmentEditorCommonFieldsWrapper);
