import { IntlProvider } from "react-intl";
import React from "react";
export const withReactIntl = (Component) => {
  return (props) => {
    return (
      <IntlProvider
        locale="en"
        messages={{ DROPDOWN_NO_OPTIONS_MESSAGE: "no option" }}
      >
        <Component {...props} />
      </IntlProvider>
    );
  };
};
