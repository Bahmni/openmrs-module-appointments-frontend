import React from "react";
import AppSpecialityFilter from "../components/AppSpecialityFilter/AppSpecialityFilter";
import { IntlProvider } from "react-intl";
export default { title: "AppSpecilaityFilter" };

const withReactIntl = (AppSpecialityFilter) => {
  return (props) => {
    return (
      <IntlProvider
        locale="en"
        messages={{ DROPDOWN_NO_OPTIONS_MESSAGE: "no option" }}
      >
        <AppSpecialityFilter {...props} />
      </IntlProvider>
    );
  };
};
const nodes = [
  {
    value: "Physiotherapy OPD",
    label: "Physiotherapy OPD",
    children: [
      { value: "1 session [30 min]", label: "1 session [30 min]" },
      { value: "POP [30 min]", label: "POP [30 min]" },
    ],
  },
];
const InternationalizedAppSpecialityFilter = withReactIntl(AppSpecialityFilter);
export const basic = () => (
  <InternationalizedAppSpecialityFilter nodes={nodes} />
);
