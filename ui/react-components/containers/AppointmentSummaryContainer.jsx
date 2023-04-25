import React, { Component } from "react";
import GridSummary, {transformAppointmentSummaryToGridData} from "../components/GridSummary/GridSummary.jsx";
import DateOrWeekNavigator from "../components/DateOrWeekNavigator/DateOrWeekNavigator.jsx"
import { IntlProvider } from "react-intl";
import { getLocale } from "../utils/LocalStorageUtil";
import translations from '../../i18n/appointments';
import PropTypes from "prop-types";
import { AppContext } from "../components/AppContext/AppContext";
import { getMessages } from "../components/AppContext/AppService";
import moment from "moment";
import {getWeekEndDate, getWeekStartDate} from "../utils/DateOrWeekNavigator/weekDatesHelper";
import {getAppointmentSummary, searchAppointments} from "../api/appointmentsApi";

class AppointmentSummaryContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: getLocale() === 'pt_BR' ? 'pt-BR': getLocale(),
            messages: translations[props.locale],
            startDate: getWeekStartDate(moment().toDate(), 1),
            endDate: getWeekEndDate(moment().toDate(), 1),
            data: []
        };
        (async () => {
            this.setState({messages: await getMessages(getLocale())});
        })();
        this.getSummary = async (startDate, endDate) => {
            const weekStartDate = moment(startDate).startOf('day').format("YYYY-MM-DDTHH:mm:ss.SSSZZ")
            const weekEndDate = moment(endDate).endOf('day').format("YYYY-MM-DDTHH:mm:ss.SSSZZ")
            const response = await getAppointmentSummary(weekStartDate, weekEndDate)
            this.setState({data: transformAppointmentSummaryToGridData(response.data)})

            const appointments = await searchAppointments({startDate:weekStartDate, endDate:weekEndDate})
            console.log('Search appointments',appointments)
        }

        moment.locale(getLocale() === 'pt_BR' ? 'pt-BR': getLocale());
    }
    async componentDidMount() {
        const { startDate, endDate } = this.state
        await this.getSummary(startDate, endDate)
    }

    async componentDidUpdate(prevProps,prevState, snapshot) {
        const { startDate, endDate } = this.state
        if(prevState.startDate !== startDate){
            await this.getSummary(startDate, endDate)
        }
    }

    render() {
        const {locale, messages, startDate, endDate, data} = this.state;
        const { goToListView , state } = this.props;
        const setStartDate = date => {
            this.setState({ startDate: date })
        };
        const setEndDate = date => {
            this.setState({ endDate: date })
        };
        return (
            <AppContext.Provider value={{ goToListView, setStartDate, setEndDate, state, startDate, endDate }}>
                <IntlProvider defaultLocale='en' locale={locale} messages={messages}>
                    <DateOrWeekNavigator isWeek={true} weekStart={1} />
                    <h3>Specialties</h3>
                    <GridSummary gridData={data} weekStartDate={startDate} onClick={goToListView}/>
                    <h3>Services</h3>
                    <GridSummary gridData={data} weekStartDate={startDate} onClick={goToListView}/>
                    <h3>Providers</h3>
                    <GridSummary gridData={data} weekStartDate={startDate} onClick={goToListView}/>
                    <h3>Locations</h3>
                    <GridSummary gridData={data} weekStartDate={startDate} onClick={goToListView}/>
                </IntlProvider>
            </AppContext.Provider>);
    }
}

AppointmentSummaryContainer .propTypes = {
    state: PropTypes.object.isRequired,
    goToListView: PropTypes.func.isRequired,
    currentProvider: PropTypes.object,
};

export default AppointmentSummaryContainer;