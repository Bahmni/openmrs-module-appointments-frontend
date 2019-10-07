import {render} from "@testing-library/react";
import {IntlProvider} from "react-intl";
import React from "react";

export const renderWithReactIntl = (component,
                                    messages = {'PLACEHOLDER_APPOINTMENT_CREATE_SEARCH_PATIENT': 'Patient ID'}) => {
    return render(
        <IntlProvider locale="en" messages={messages}>{component}
        </IntlProvider>);
}