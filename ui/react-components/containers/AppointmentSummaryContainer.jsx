import React, { Component } from "react";
import GridSummary, {transformAppointmentSummaryToGridData, transformAppointmentsData} from "../components/GridSummary/GridSummary.jsx";
import DateOrWeekNavigator from "../components/DateOrWeekNavigator/DateOrWeekNavigator.jsx"
import {FormattedMessage, IntlProvider} from "react-intl";
import { getLocale } from "../utils/LocalStorageUtil";
import translations from '../../i18n/appointments';
import PropTypes from "prop-types";
import { AppContext } from "../components/AppContext/AppContext";
import { getMessages } from "../components/AppContext/AppService";
import moment from "moment";
import {getWeekEndDate, getWeekStartDate} from "../utils/DateOrWeekNavigator/weekDatesHelper";
import {getAppointmentSummary, searchAppointments} from "../api/appointmentsApi";
import '../components/GridSummary/GridSummary.module.scss'
import {sortBy} from "lodash";
class AppointmentSummaryContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: getLocale() === 'pt_BR' ? 'pt-BR': getLocale(),
            messages: translations[props.locale],
            startDate: getWeekStartDate(moment().toDate(), 1),
            endDate: getWeekEndDate(moment().toDate(), 1),
            data: [],
            specialityData: [],
            providersData: [],
            locationData:[]
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
            const [speciality, provider, location] = transformAppointmentsData(appointments.data);
            this.setState({specialityData: speciality});
            this.setState({providersData: provider});
            this.setState({locationData: location});
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
        const {locale, messages, startDate, endDate, data, specialityData, providersData, locationData} = this.state;
        const { goToListView , state, fullSummary} = this.props;
        const setStartDate = date => {
            this.setState({ startDate: date })
        };
        const setEndDate = date => {
            this.setState({ endDate: date })
        };
        const providersTitle = <FormattedMessage id={'PROVIDERS'} defaultMessage={'Providers'}/>
        const servicesTitle = <FormattedMessage id={'SERVICES'} defaultMessage={'Services'}/>
        const locationsTitle = <FormattedMessage id={'LOCATIONS'} defaultMessage={'Locations'}/>
        const specialitiesTitle = <FormattedMessage id={'SPECIALITIES'} defaultMessage={'Specialities'}/>
        return (
            <AppContext.Provider value={{ goToListView, setStartDate, setEndDate, state, startDate, endDate, fullSummary }}>
                <IntlProvider defaultLocale='en' locale={locale} messages={messages}>
                    <DateOrWeekNavigator isWeek={true} weekStart={1} />
                    { fullSummary? (
                        <div>
                            <GridSummary gridData={specialityData} weekStartDate={startDate} onClick={goToListView} gridName={specialitiesTitle}/>
                            <hr/>
                            <GridSummary gridData={providersData} weekStartDate={startDate} onClick={goToListView} gridName={providersTitle}/>
                            <hr/>
                            <GridSummary gridData={sortBy(data, row => row.rowLabel.toLowerCase())}
                                         weekStartDate={startDate} onClick={goToListView} gridName={servicesTitle}/>
                            <hr/>
                            <GridSummary gridData={locationData} weekStartDate={startDate} onClick={goToListView} gridName={locationsTitle}/>
                            <br/>
                        </div>) : (
                        <GridSummary gridData={ data } weekStartDate={startDate} onClick={goToListView}/>
                    )

                    }
                </IntlProvider>
            </AppContext.Provider>);
    }
}

AppointmentSummaryContainer .propTypes = {
    state: PropTypes.object.isRequired,
    goToListView: PropTypes.func.isRequired,
    currentProvider: PropTypes.object,
    fullSummary: PropTypes.bool
};

export default AppointmentSummaryContainer;
