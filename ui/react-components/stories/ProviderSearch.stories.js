import React from "react";
import { withReactIntl } from "./util";
import ProviderSearch from "../components/Provider/ProviderSearch";

export default { title: "Provider Search" };

const InternationalizedProviderSearch = withReactIntl(ProviderSearch, {
  Provider: "no Provider selected",
});

export const basic = () => <InternationalizedProviderSearch />;
