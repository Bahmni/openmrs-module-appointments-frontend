import React from "react";
import Search from "../components/AppointmentListSidePanelSearch/AppointmentListSidePanelSearch";
import { IntlProvider } from "react-intl";
export default { title: "AppointmentListSidePanelSearch" };

const withReactIntl = (Search) => {
  return (props) => {
    return (
      <IntlProvider
        locale="en"
        messages={{ DROPDOWN_NO_OPTIONS_MESSAGE: "no option" }}
      >
        <Search {...props} />
      </IntlProvider>
    );
  };
};

const InternaltionalizedSearch = withReactIntl(Search);
export const basic = () => <InternaltionalizedSearch />;
