import { IntlProvider } from "react-intl";
import React from "react";

export const withReactIntl = (Component, messages = {}) => {
  return (props) => {
    return (
      <IntlProvider locale="en" messages={messages}>
        <Component {...props} />
      </IntlProvider>
    );
  };
};
