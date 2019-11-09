import React, {Component} from "react";
import AppointmentEditor from "../components/AppointmentEditor/AppointmentEditor.jsx";
import {IntlProvider} from "react-intl";
import {getLocale} from "../utils/LocalStorageUtil";
import {getTranslations} from "../api/translationsApi";
import {getAppConfigs} from "../api/configApi";
import translations from '../../app/i18n/appointments';
import {appName} from '../constants';
import PropTypes from "prop-types";
import {AppContext} from "../components/AppContext/AppContext";

// TODO : need to add connection to redux

class AddAppointmentContainer extends Component {

    constructor (props) {
        super(props);
        this.state = {
            locale: getLocale(),
            messages: translations[props.locale],
            appConfigs: null
        };
        (async () => {
            await this.getMessages();
            await this.getAppConfigs();
        })();
    }

    async getMessages () {
        const messages = await getTranslations({appName: appName, locale: this.state.locale});
        this.setState({messages: messages});
    }

    async getAppConfigs () {
        const appConfigs = await getAppConfigs({appName: appName});
        const {config} = appConfigs;
        this.setState({appConfigs: config});
    }

    render () {
        const {locale, messages, appConfigs} = this.state;
        return (
            <AppContext.Provider value={{onBack: this.props.onBack, angularState: this.props.state}}>
                <IntlProvider defaultLocale='en' locale={locale} messages={messages}>
                    <AppointmentEditor appConfig={appConfigs}/>
                </IntlProvider>
            </AppContext.Provider>);
    }
}

AddAppointmentContainer .propTypes = {
    onBack: PropTypes.func.isRequired,
    state: PropTypes.object.isRequired
};

export default AddAppointmentContainer;
