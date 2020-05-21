import 'jest-localstorage-mock';
import {localReactConfig} from '../../local-react-config';

localStorage.setItem("reactConfig", JSON.stringify(localReactConfig));
