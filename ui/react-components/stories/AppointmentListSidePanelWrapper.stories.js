import React from "react";
import AppointmentListSidePanelWrapper from "../components/AppointmentListSidePanelWrapper/AppointmentListSidePanelWrapper";
import {IntlProvider, injectIntl} from "react-intl";

export default { title: "AppointmentListSidePanelWrapper" };

const withReactIntl = (AppointmentListSidePanelWrapper) => {
  return (props) =>{
      return <IntlProvider locale='en' messages={{'DROPDOWN_NO_OPTIONS_MESSAGE': 'no option'}}>
          <AppointmentListSidePanelWrapper {...props}/>
      </IntlProvider>
  }
}

const InternationalizedDropDown = withReactIntl(AppointmentListSidePanelWrapper);

export const SearchTree = () => <InternationalizedDropDown/>;
