const initialState = {
    appConfig: {"name": "alekhya"}
}

const rootReducer = (state = initialState, action)  => {
    switch(action.type){
        case "GET_CONFIG":
            return Object.assign(...state, {appConfig: action.config});
        default:
            return state;
    }
}

export default rootReducer;
