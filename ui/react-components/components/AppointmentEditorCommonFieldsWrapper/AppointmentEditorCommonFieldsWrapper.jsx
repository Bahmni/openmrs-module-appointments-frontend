import React, {Fragment} from "react";
import classNames from "classnames";
import {commonFields, tableWrapper} from "./AppointmentEditorCommonFieldsWrapper.module.scss";
import PatientSearch from "../PatientSearch/PatientSearch.jsx";
import ErrorMessage from "../ErrorMessage/ErrorMessage.jsx";
import ServiceSearch from "../Service/ServiceSearch.jsx";
import ServiceTypeSearch from "../Service/ServiceTypeSearch.jsx";
import {
    getValidProviders,
    isAppointmentPriorityOptionEnabled,
    isServiceTypeEnabled,
    isSpecialitiesEnabled,
    maxAppointmentProvidersAllowed,
} from "../../helper";
import SpecialitySearch from "../Speciality/SpecialitySearch.jsx";
import LocationSearch from "../Location/LocationSearch.jsx";
import ProviderSearch from "../Provider/ProviderSearch.jsx";
import {injectIntl} from "react-intl";
import {getErrorTranslations, getMaxAppointmentProvidersErrorMessage} from "../../utils/ErrorTranslationsUtil";
import {filter, isEmpty} from "lodash";
import {
    DEFAULT_MAX_APPOINTMENT_PROVIDERS,
    PROVIDER_ERROR_MESSAGE_TIME_OUT_INTERVAL,
    PROVIDER_RESPONSES
} from "../../constants";
import AppointmentCategory from "../AppointmentCategory/AppointmentCategory.jsx";

const AppointmentEditorCommonFieldsWrapper = props => {

    const {updateAppointmentDetails, updateErrorIndicators, requiredFields} = props;
    const {appointmentDetails, errors, endTimeBasedOnService, appConfig, intl, autoFocus} = props;
    const componentsDisableStatus = props.componentsDisableStatus || {};
    const errorTranslations = getErrorTranslations(intl);

    const updateLocationBasedOnService = (selectedService) => {
        selectedService && isEmpty(selectedService.value.location) ? updateAppointmentDetails({location: null})
            : updateAppointmentDetails({
                location: {
                    value: selectedService.value.location,
                    label: selectedService.value.location.name
                }
            });
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

    const getInitialPriority = (priority) => {
        if(priority){
            const options = appConfig.priorityOptionsList;
            return options.find(option => option.value === priority);
        }
        return undefined;
    }

    return (
        <Fragment>
            <div className={classNames(commonFields)}>
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
                <table className={classNames(tableWrapper)}>
                    {isAppointmentPriorityOptionEnabled(appConfig) && <tr>
                        <td>
                            <div data-testid="appointment-category-search">
                                <AppointmentCategory value={getInitialPriority(appointmentDetails.priority)}
                                    priorityOptionsList={appConfig.priorityOptionsList}
                                    onChange={ selectedCategory => {
                                        if(selectedCategory && selectedCategory.selectedItem){
                                            updateAppointmentDetails({priority: selectedCategory.selectedItem.value})
                                        } else {
                                            updateAppointmentDetails({priority: null})
                                        }
                                        updateErrorIndicators({priorityError: !selectedCategory.selectedItem});
                                    }} isDisabled={componentsDisableStatus.priority}
                                     isRequired={requiredFields.category}
                                    autoFocus={componentsDisableStatus.patient}/>
                                <ErrorMessage message={errors.priorityError ? errorTranslations.priorityErrorMessage : undefined}/>
                            </div>
                        </td>
                        <td/>
                    </tr>}
                    <tr>
                        <td>
                            {isSpecialitiesEnabled(appConfig) ?
                                <div data-testid="speciality-search">
                                    <SpecialitySearch value={appointmentDetails.speciality}
                                                      onChange={(optionSelected) => {
                                                          return updateAppointmentDetails({
                                                              speciality: optionSelected,
                                                              service: null,
                                                              serviceType: null,
                                                              location: null
                                                          })}}
                                                      isDisabled={componentsDisableStatus.speciality}
                                                      isRequired={requiredFields.speciality}
                                                      autoFocus={componentsDisableStatus.patient && componentsDisableStatus.priority}/>
                                </div> : null
                            }
                        </td>
                        <td>
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
                                               isRequired={requiredFields.service}
                                               autoFocus={componentsDisableStatus.patient && componentsDisableStatus.priority}
                                />
                                <ErrorMessage
                                    message={errors.serviceError ? errorTranslations.serviceErrorMessage : undefined}/>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            {isServiceTypeEnabled(appConfig) ?
                                <div data-testid="service-type-search">
                                    <ServiceTypeSearch value={appointmentDetails.serviceType} onChange={(optionSelected) => {
                                        updateAppointmentDetails({serviceType: optionSelected});
                                        optionSelected && endTimeBasedOnService(appointmentDetails.startTime, undefined, optionSelected.value);
                                    }}
                                                       serviceUuid={appointmentDetails.service && appointmentDetails.service.value.uuid}
                                                       isDisabled={componentsDisableStatus.serviceType}/>
                                </div> : undefined}
                        </td>
                        <td/>
                    </tr>
                    <tr>
                        <td>
                            <div data-testid="provider-search">
                                <ProviderSearch
                                    onChange={selectedProvider => {
                                        if (getValidProviders(appointmentDetails.providers).length < maxAppointmentProvidersAllowed(appConfig)) {
                                            addOrUpdateProvider(selectedProvider);
                                        } else {
                                            if (!appointmentDetails.providerError) {
                                                updateErrorIndicators({providerError: true});
                                                setTimeout(function () {
                                                    updateErrorIndicators({providerError: false});
                                                }, PROVIDER_ERROR_MESSAGE_TIME_OUT_INTERVAL);
                                            }
                                        }
                                    }}
                                    isRequired={requiredFields.provider}
                                    onProviderRemove={providerIdentifier => updateAppointmentDetails({providers: filter(appointmentDetails.providers, provider => provider.value !== providerIdentifier)})}
                                    selectedProviders={appointmentDetails.providers}
                                    isDisabled={componentsDisableStatus.providers}
                                    autoFocus={ componentsDisableStatus.patient && componentsDisableStatus.priority && componentsDisableStatus.speciality}
                                />
                                <ErrorMessage message={errors.providerError && getMaxAppointmentProvidersErrorMessage(intl,
                                    appConfig && appConfig.maxAppointmentProviders || DEFAULT_MAX_APPOINTMENT_PROVIDERS).providerErrorMessage}/>
                            </div>
                        </td>
                        <td>
                            <div data-testid="location-search">
                                <LocationSearch value={appointmentDetails.location}
                                                onChange={(optionSelected) => updateAppointmentDetails({location: optionSelected})}
                                                isDisabled={componentsDisableStatus.location}
                                                isRequired={requiredFields.location}
                                                autoFocus={componentsDisableStatus.patient && componentsDisableStatus.priority && componentsDisableStatus.speciality && componentsDisableStatus.service}/>
                                <ErrorMessage message={undefined}/>
                            </div>
                        </td>
                    </tr>
                </table>
            </div>
        </Fragment>
    );
};

export default injectIntl(AppointmentEditorCommonFieldsWrapper);
