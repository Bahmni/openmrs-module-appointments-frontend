import PropTypes from "prop-types";
import {Fragment, useEffect} from "react";
import React from "react";
import {injectIntl} from "react-intl";

const EditAppointment = props => {

    const {appConfig} = props;

    useEffect(() => {
    }, [appConfig]);

    return (<Fragment/>);
};

EditAppointment.propTypes = {
    intl: PropTypes.object.isRequired,
    appConfig: PropTypes.object,
    appointmentUuid: PropTypes.string.isRequired
};

export default injectIntl(EditAppointment);
