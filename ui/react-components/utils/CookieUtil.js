import Cookies from 'js-cookie';

export const currentLocation = () => {
    return Cookies.get('bahmni.user.location');
};