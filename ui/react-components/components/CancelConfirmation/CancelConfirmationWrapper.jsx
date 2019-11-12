import CancelConfirmation from "./CancelConfirmation.jsx";
import {IntlProvider} from "react-intl";
import React, {useEffect, useState} from "react";
import {getLocale} from "../../utils/LocalStorageUtil";
import {getMessages} from "../AppContext/AppService";
import PropTypes from "prop-types";

const CancelConfirmationWrapper = props => {

    const locale = getLocale();
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async () => setMessages(await getMessages(locale));
    });

    return (
        <IntlProvider defaultLocale='en' locale={locale} messages={messages}>
            <CancelConfirmation onBack={props.onBack} close={props.close}/>
        </IntlProvider>
    );
};

CancelConfirmationWrapper.propTypes = {
    onBack: PropTypes.func.isRequired,
    close: PropTypes.func.isRequired
};

export default CancelConfirmationWrapper;
