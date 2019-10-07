import Cookies from 'js-cookie';

export const currentLocation = () => {
    return JSON.parse(Cookies.get('bahmni.user.location'));
};
