import React, {Component} from "react";
import AddAppointment from "../components/AddAppointment/AddAppointment.jsx";
import {IntlProvider} from "react-intl";
import {getLocale} from "../utils/LocalStorageUtil";
import {getTranslations} from "../api/translationsApi";
import {getAppConfigs} from "../api/configApi";
import translations from '../../app/i18n/appointments';
import {appName} from '../constants';
import PropTypes from "prop-types";
import {AppContext} from "../components/AppContext/AppContext";
import EditAppointment from "../components/EditAppointment/EditAppointment.jsx";
import moment from "moment";

// TODO : need to add connection to redux

class AppointmentContainer extends Component {

    constructor (props) {
        super(props);
        this.state = {
            locale: getLocale(),
            messages: translations[props.locale],
            appConfig: null
        };
        (async () => {
            await this.getMessages();
            await this.getAppConfigs();
        })();
        moment.locale(getLocale());
    }

    async getMessages () {
        const messages = await getTranslations({appName: appName, locale: this.state.locale});
        this.setState({messages: messages});
    }

    async getAppConfigs () {
        const appConfig = await getAppConfigs({appName: appName});
        const {config} = appConfig;
        this.setState({appConfig: config});
    }

    render () {
        const {locale, messages, appConfig} = this.state;
        return (
            <AppContext.Provider value={{onBack: this.props.onBack, setViewDate: this.props.setViewDate}}>
                <IntlProvider defaultLocale='en' locale={locale} messages={messages}>
                    {this.props.appointmentUuid
                        ? <EditAppointment appConfig={appConfig} appointmentUuid={this.props.appointmentUuid} isRecurring={this.props.isRecurring}/>
                        : <AddAppointment appConfig={appConfig}/>}
                </IntlProvider>
            </AppContext.Provider>);
    }
}

AppointmentContainer .propTypes = {
    onBack: PropTypes.func.isRequired,
    appointmentUuid: PropTypes.string,
    isRecurring: PropTypes.bool,
    setViewDate: PropTypes.func.isRequired
};

export default AppointmentContainer;
