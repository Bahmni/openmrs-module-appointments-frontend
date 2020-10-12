import moment from "moment";

export const getWeekStartDate = (date, weekStart) => {
    return unformattedWeekStartDate(date, weekStart).format('DD MMM');
};

export const getFormattedWeekStartDate = (date, weekStart) => {
    return unformattedWeekStartDate(date, weekStart).format('YYYY-MM-DD');
};

export const getWeekEndDate = (date, weekStart) => {
    return unformattedWeekEndDate(date, weekStart).format('DD MMM');
};

const daysToSubtract = (date, weekStart) => {
    return moment(date).weekday() >= weekStart ?
        moment(date).weekday() - weekStart :
        7 + moment(date).weekday() - weekStart;
};

const unformattedWeekStartDate = (date, weekStart) => {
    const daysToBeSubtracted = daysToSubtract(date, weekStart);
    return moment(date).subtract(daysToBeSubtracted, "days");
}

const unformattedWeekEndDate = (date, weekStart) => { 
    const daysToBeAdded = 6 - daysToSubtract(date, weekStart);
    return moment(date).add(daysToBeAdded, "days");
} 