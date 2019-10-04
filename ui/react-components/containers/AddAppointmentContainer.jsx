import React, {Component} from "react";
import { AppointmentEditor } from "../components/AppointmentEditor/AppointmentEditor.jsx";
import {IntlProvider} from "react-intl";
import {getLocale} from "../utils/LocalStorageUtil";
import {getTranslations} from "../api/translationsApi";
import translations from '../../app/i18n/appointments';
import {appName} from '../constants';
// TODO : need to add connection to redux

class AddAppointmentContainer extends Component {

    constructor (props) {
        super(props);
        this.state = {
            locale: getLocale(),
            messages: translations[props.locale]
        };
        (async () => {
            await this.getMessages();
        })();
    }

    async getMessages () {
        const messages = await getTranslations({appName: appName, locale: this.state.locale});
        this.setState({messages: messages});
    }

    render () {
        const {locale, messages} = this.state;
        return (
            <IntlProvider defaultLocale='en' locale={locale} messages={messages}>
                <AppointmentEditor/>
            </IntlProvider>);
    }
}

export default AddAppointmentContainer;
