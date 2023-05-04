import moment from "moment";

export const getWeekStartDate = (date, weekStart) => {
    const daysToBeSubtracted = daysToSubtract(date, weekStart);
    return moment(date).subtract(daysToBeSubtracted, "days");
};

 export const getWeekEndDate = (date, weekStart) => {
    const daysToBeAdded = 6 - daysToSubtract(date, weekStart);
    return moment(date).add(daysToBeAdded, "days");
};

const daysToSubtract = (date, weekStart) => {
    return moment(date).weekday() >= weekStart ?
        moment(date).weekday() - weekStart :
        7 + moment(date).weekday() - weekStart;
};