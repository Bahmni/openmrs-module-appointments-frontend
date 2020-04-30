import { configure } from '@storybook/react';
import { library, dom } from "@fortawesome/fontawesome-svg-core";
import { faPrint,faAngleDown,faSearch,faTimes } from "@fortawesome/free-solid-svg-icons";


library.add(faPrint,faAngleDown,faSearch,faTimes );
dom.watch();
configure(require.context('../react-components', true, /\.stories\.js$/), module);