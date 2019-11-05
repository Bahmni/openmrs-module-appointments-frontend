import {Fragment} from "react";
import classNames from "classnames";
import {
    searchFieldsContainer,
    searchFieldsContainerLeft,
    searchFieldsContainerRight
} from "./SearchFieldsContainer.module.scss";
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

const SearchFieldsContainer = props => {

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
                        <ServiceSearch onChange={(optionSelected) => {
                            updateAppointmentDetails({service: optionSelected.value});
                            updateErrorIndicators({serviceError: !optionSelected.value});
                            endTimeBasedOnService(appointmentDetails.startTime, optionSelected.value, undefined);
                        }}
                                       specialityUuid={appointmentDetails.speciality}/>
                        <ErrorMessage
                            message={errors.serviceError ? errorTranslations.serviceErrorMessage : undefined}/>
                    </div>
                    <div data-testid="service-type-search">
                        <ServiceTypeSearch onChange={(optionSelected) => {
                            updateAppointmentDetails({serviceType: optionSelected.value});
                            endTimeBasedOnService(appointmentDetails.startTime, undefined, optionSelected.value);
                        }}
                                           serviceUuid={appointmentDetails.service && appointmentDetails.service.uuid}/>
                    </div>
                    {isSpecialitiesEnabled(appConfig) ?
                        <div data-testid="speciality-search">
                            <SpecialitySearch
                                onChange={(optionSelected) => updateAppointmentDetails({speciality: optionSelected.value})}/>
                        </div> : null
                    }
                    <div data-testid="location-search">
                        <LocationSearch
                            onChange={(optionSelected) => updateAppointmentDetails({location: optionSelected.value})}/>
                        <ErrorMessage message={undefined}/>
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)} data-testid="provider-search">
                    <ProviderSearch
                        onChange={selectedProviders => updateAppointmentDetails({providers: selectedProviders})}
                        maxAppointmentProvidersAllowed={maxAppointmentProvidersAllowed(appConfig)}/>
                </div>
            </div>
        </Fragment>
    );
};

export default injectIntl(SearchFieldsContainer);
