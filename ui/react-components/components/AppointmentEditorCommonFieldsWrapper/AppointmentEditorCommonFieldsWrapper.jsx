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
import {
    getValidProviders, isMandatory,
    isServiceTypeEnabled,
    isSpecialitiesEnabled,
    maxAppointmentProvidersAllowed
} from "../../helper";
import SpecialitySearch from "../Speciality/SpecialitySearch.jsx";
import LocationSearch from "../Location/LocationSearch.jsx";
import ProviderSearch from "../Provider/ProviderSearch.jsx";
import React from "react";
import {injectIntl} from "react-intl";
import {getErrorTranslations, getMaxAppointmentProvidersErrorMessage} from "../../utils/ErrorTranslationsUtil";
import {filter, isEmpty} from "lodash";
import {
    DEFAULT_MAX_APPOINTMENT_PROVIDERS,
    PROVIDER_RESPONSES,
    PROVIDER_ERROR_MESSAGE_TIME_OUT_INTERVAL, SERVICE_TYPE, SPECIALITY, LOCATION, PROVIDER
} from "../../constants";

const AppointmentEditorCommonFieldsWrapper = props => {

    const {updateAppointmentDetails, updateErrorIndicators} = props;
    const {appointmentDetails, errors, endTimeBasedOnService, appConfig, intl, autoFocus} = props;
    const componentsDisableStatus = props.componentsDisableStatus || {};
    const errorTranslations = getErrorTranslations(intl);

    const updateLocationBasedOnService = (selectedService) => {
        if (selectedService && isEmpty(selectedService.value.location)) {
            updateAppointmentDetails({location: null});
            updateErrorIndicators({locationError: true});
        } else {
            updateAppointmentDetails({
                location: {
                    value: selectedService.value.location,
                    label: selectedService.value.location.name
                }
            });
            updateErrorIndicators({locationError: false})
        }
    };

    const addOrUpdateProvider = selectedProvider => {
        if (appointmentDetails.providers.filter(provider => provider.value === selectedProvider.value).length > 0) {
            updateAppointmentDetails({
                providers: appointmentDetails.providers.map(provider => {
                    provider.response = provider.value === selectedProvider.value ? PROVIDER_RESPONSES.ACCEPTED : provider.response;
                    return provider;
                })
            });
        } else {
            updateAppointmentDetails({providers: [...appointmentDetails.providers, selectedProvider]})
        }
    };

    const getProviderErrorMessages = () => {
        if (errors.providerError) {
            return getMaxAppointmentProvidersErrorMessage(intl,
                appConfig && appConfig.maxAppointmentProviders || DEFAULT_MAX_APPOINTMENT_PROVIDERS).providerErrorMessage;
        }
        if (errors.providerMandatoryError) return errorTranslations.providerMandatoryErrorMessage;
    };

    return (
        <Fragment>
            <div className={classNames(searchFieldsContainer)}>
                <div className={classNames(searchFieldsContainerLeft)}>
                    <div data-testid="patient-search">
                        <PatientSearch
                            value={appointmentDetails.patient}
                            minCharLengthToTriggerPatientSearch={appConfig && appConfig.minCharLengthToTriggerPatientSearch}
                            onChange={(optionSelected) => {
                                const newValue = optionSelected ? optionSelected : null;
                                updateAppointmentDetails({patient: newValue});
                                errors.patientError && optionSelected && updateErrorIndicators({patientError: !newValue});
                            }} isDisabled={componentsDisableStatus.patient}
                            autoFocus={autoFocus}/>
                        <ErrorMessage
                            message={errors.patientError ? errorTranslations.patientErrorMessage : undefined}/>
                    </div>
                    {isSpecialitiesEnabled(appConfig) ?
                        <div data-testid="speciality-search">
                            <SpecialitySearch value={appointmentDetails.speciality}
                                              onChange={(optionSelected) => {
                                                  updateAppointmentDetails({
                                                      speciality: optionSelected,
                                                      service: null,
                                                      serviceType: null,
                                                      location: null
                                                  });
                                                  updateErrorIndicators({specialityErrorMessage: !optionSelected})
                                              }}
                                              isDisabled={componentsDisableStatus.speciality}
                                              autoFocus={componentsDisableStatus.patient}/>
                            {isMandatory(appConfig, SPECIALITY) && !componentsDisableStatus.speciality ?
                                <ErrorMessage
                                    message={errors.specialityErrorMessage ? errorTranslations.specialityErrorMessage : undefined}/> :
                                <ErrorMessage message={undefined}/>
                            }
                        </div> : null
                    }
                    <div data-testid="service-search">
                        <ServiceSearch value={appointmentDetails.service} onChange={(optionSelected) => {
                            updateAppointmentDetails({service: optionSelected, serviceType: null});
                            updateErrorIndicators({serviceError: !optionSelected});
                            optionSelected && endTimeBasedOnService(appointmentDetails.startTime, optionSelected.value, undefined);
                            optionSelected && updateLocationBasedOnService(optionSelected);
                        }} specialityUuid={appointmentDetails.speciality && appointmentDetails.speciality.value
                        && appointmentDetails.speciality.value.uuid}
                                       isDisabled={componentsDisableStatus.service}
                                       specialityEnabled = {isSpecialitiesEnabled(appConfig)}
                                       autoFocus={componentsDisableStatus.patient}
                    />
                        <ErrorMessage
                            message={errors.serviceError ? errorTranslations.serviceErrorMessage : undefined}/>
                    </div>
                    {isServiceTypeEnabled(appConfig) ?
                        <div data-testid="service-type-search">
                            <ServiceTypeSearch value={appointmentDetails.serviceType} onChange={(optionSelected) => {
                                updateAppointmentDetails({serviceType: optionSelected});
                                optionSelected && endTimeBasedOnService(appointmentDetails.startTime, undefined, optionSelected.value);
                                updateErrorIndicators({serviceTypeError: !optionSelected})
                            }}
                                               serviceUuid={appointmentDetails.service && appointmentDetails.service.value.uuid}
                                               isDisabled={componentsDisableStatus.serviceType}/>
                            {isMandatory(appConfig, SERVICE_TYPE) && !componentsDisableStatus.serviceType ?
                                <ErrorMessage
                                    message={errors.serviceTypeError ? errorTranslations.serviceTypeErrorMessage : undefined}/> :
                                <ErrorMessage message={undefined}/>
                            }
                        </div> : undefined}
                    <div data-testid="location-search">
                        <LocationSearch value={appointmentDetails.location}
                                        onChange={
                                            (optionSelected) => {
                                                updateAppointmentDetails({location: optionSelected});
                                                updateErrorIndicators({locationError: !optionSelected})
                                            }
                                        }
                                        isDisabled={componentsDisableStatus.location}
                                        autoFocus={componentsDisableStatus.patient && componentsDisableStatus.speciality && componentsDisableStatus.service}/>
                        {isMandatory(appConfig, LOCATION) && !componentsDisableStatus.location ?
                            <ErrorMessage
                                message={errors.locationError ? errorTranslations.locationErrorMessage : undefined}/> :
                            <ErrorMessage message={undefined}/>
                        }
                    </div>
                </div>
                <div className={classNames(searchFieldsContainerRight)} data-testid="provider-search">
                    <ProviderSearch
                        onChange={selectedProvider => {
                            if (getValidProviders(appointmentDetails.providers).length < maxAppointmentProvidersAllowed(appConfig)) {
                                addOrUpdateProvider(selectedProvider);
                                updateErrorIndicators({providerMandatoryError: !selectedProvider})
                            } else {
                                if (!appointmentDetails.providerError) {
                                    updateErrorIndicators({providerError: true});
                                    setTimeout(function () {
                                        updateErrorIndicators({providerError: false});
                                    }, PROVIDER_ERROR_MESSAGE_TIME_OUT_INTERVAL);
                                }
                            }
                        }}
                        onProviderRemove={providerIdentifier =>
                        {
                            var updatedProviders = filter(appointmentDetails.providers, provider => provider.value !== providerIdentifier);
                            updateAppointmentDetails({providers: updatedProviders});
                            updateErrorIndicators({providerMandatoryError: _.isEmpty(updatedProviders)})
                        }}
                        selectedProviders={appointmentDetails.providers}
                        isDisabled={componentsDisableStatus.providers}/>
                        <ErrorMessage message = {getProviderErrorMessages()}/>
                </div>
            </div>
        </Fragment>
    );
};

export default injectIntl(AppointmentEditorCommonFieldsWrapper);
