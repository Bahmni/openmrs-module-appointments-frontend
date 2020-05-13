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

export async function loadReactConstants() {
    //todo: cache the JSON constants files
    // https://bahmni.atlassian.net/browse/AP-21
    return fetch("./constants/react-constants.json")
        .then((res) =>
            res.json().then((data) => {
                localStorage.setItem("reactConstants", JSON.stringify(data));
            })
        );
}