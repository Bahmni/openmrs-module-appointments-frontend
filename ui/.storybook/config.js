import { configure } from "@storybook/react";
import { library, dom } from "@fortawesome/fontawesome-svg-core";

import { localReactConfig } from "../local-react-config";
localStorage.setItem("reactConfig", JSON.stringify(localReactConfig));
import {
    faPrint,
    faPlus,
    faMinus,
    faStop,
    faSearch,
    faTimes,
    faCheckSquare, 
    faAngleDown
} from "@fortawesome/free-solid-svg-icons";

import { faSquare } from "@fortawesome/free-regular-svg-icons";

library.add(faPrint, faPlus, faMinus, faStop, faSearch, faTimes, faCheckSquare, faSquare, faAngleDown);

dom.watch();
configure(
    require.context("../react-components", true, /\.stories\.js$/),
    module
);
