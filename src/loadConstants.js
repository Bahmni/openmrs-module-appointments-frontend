export async function loadAngularConstants() {
    return fetch("./constants/ng-constants.json")
        .then((res) => {
            return res.json().then((data) => {
                window.Bahmni = window.Bahmni || {};

                window.Bahmni.Common = window.Bahmni.Common || {};
                window.Bahmni.Common.Constants = data.Common.Constants;

                window.Bahmni.Appointments = window.Bahmni.Appointments || {};
                window.Bahmni.Appointments.Constants = data.Appointments.Constants;
            })
        })
}