import { configure } from '@storybook/react';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faPrint } from "@fortawesome/free-solid-svg-icons/faPrint";


library.add(faPrint);
dom.watch();
configure(require.context('../react-components', true, /\.stories\.js$/), module);