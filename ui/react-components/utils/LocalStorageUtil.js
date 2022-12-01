import {helpDeskNumber} from "../constants";

export const getLocale = () => {
    return localStorage.getItem('NG_TRANSLATE_LANG_KEY');
};

export const getHelpDeskNumber = () => {
    return localStorage.getItem(helpDeskNumber);
};
