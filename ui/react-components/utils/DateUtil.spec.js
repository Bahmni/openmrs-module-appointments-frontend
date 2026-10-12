import moment from "moment";
import{
    isValidDate,
    isStartTimeBeforeEndTime,
    applyDateToTime,
    applyDateToTimes
} from "./DateUtil";

describe('DateUtil', () =>{
    it('should return true when a valid date is passed', ()=>{
        const isValid = isValidDate('12/Feb/2019');
        expect(isValid).toBe(true)

    })

    it('should return false when a no date is passed', ()=>{
        const isValid = isValidDate();
        expect(isValid).toBe(false)

    })

    it('should return false when an invalid date format is passed', ()=>{
        const isValid = isValidDate('01/Feb');
        expect(isValid).toBe(false)

    })

    it('should return false when an invalid date with valid format is passed', ()=>{
        const isValid = isValidDate('30/Feb/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when an invalid month  is passed', ()=>{
        const isValid = isValidDate('30/Hui/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when an invalid date  is passed', ()=>{
        const isValid = isValidDate('32/Dec/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when month is 4,6,9 or 11 and date is 31', ()=>{
        let isValid = isValidDate('31/Nov/2019');
        expect(isValid).toBe(false)
        isValid = isValidDate('31/Sep/2019');
        expect(isValid).toBe(false)
        isValid = isValidDate('31/Jun/2019');
        expect(isValid).toBe(false)
        isValid = isValidDate('31/Apr/2019');
        expect(isValid).toBe(false)
    })

    it('should return true when month is 1,3,5,7,8,10 or 12 and date is 31', ()=>{
        let isValid = isValidDate('31/Jan/2019');
        expect(isValid).toBe(true)
        isValid = isValidDate('31/Mar/2019');
        expect(isValid).toBe(true)
        isValid = isValidDate('31/May/2019');
        expect(isValid).toBe(true)
        isValid = isValidDate('31/Jul/2019');
        expect(isValid).toBe(true)
        isValid = isValidDate('31/Aug/2019');
        expect(isValid).toBe(true)
        isValid = isValidDate('31/Oct/2019');
        expect(isValid).toBe(true)
        isValid = isValidDate('31/Dec/2019');
        expect(isValid).toBe(true)
    })

    it('should return true when it is a leapyear and date is 29', ()=>{
        let isValid = isValidDate('29/Feb/2020');
        expect(isValid).toBe(true)

    })

    it('should return false when it is a leapyear and date is above 29', ()=>{
        let isValid = isValidDate('30/Feb/2020');
        expect(isValid).toBe(false)

    })
})

describe('isStartTimeBeforeEndTime', () => {
    it('should return true when either start or end time is not provided', () => {
        expect(isStartTimeBeforeEndTime(undefined, moment('2020-02-12T11:00:00'))).toBe(true);
        expect(isStartTimeBeforeEndTime(moment('2020-02-12T11:00:00'), undefined)).toBe(true);
        expect(isStartTimeBeforeEndTime(undefined, undefined)).toBe(true);
    })

    it('should return true when start time is before end time on the same date', () => {
        expect(isStartTimeBeforeEndTime(moment('2020-02-12T11:00:00'), moment('2020-02-12T13:00:00'))).toBe(true);
    })

    it('should return false when start time is after end time on the same date', () => {
        expect(isStartTimeBeforeEndTime(moment('2020-02-12T13:00:00'), moment('2020-02-12T11:00:00'))).toBe(false);
    })

    it('should return false when start time equals end time', () => {
        expect(isStartTimeBeforeEndTime(moment('2020-02-12T11:00:00'), moment('2020-02-12T11:00:00'))).toBe(false);
    })
})

describe('applyDateToTime', () => {
    it('should put the given date on the time and keep the time of day', () => {
        const result = applyDateToTime(new Date(2020, 1, 20), moment('2020-02-12T13:30:00'));
        expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2020-02-20 13:30:00');
    })

    it('should make an end time typed with todays date comparable with a start time on the appointment date', () => {
        const appointmentDate = new Date(2020, 1, 20);
        const startTime = moment('2020-02-20T11:00:00');
        const endTime = applyDateToTime(appointmentDate, moment('2020-02-12T13:00:00'));
        expect(isStartTimeBeforeEndTime(startTime, endTime)).toBe(true);
    })

    it('should still report end before start when the times are out of order', () => {
        const appointmentDate = new Date(2020, 1, 20);
        const startTime = moment('2020-02-20T11:00:00');
        const endTime = applyDateToTime(appointmentDate, moment('2020-02-12T10:00:00'));
        expect(isStartTimeBeforeEndTime(startTime, endTime)).toBe(false);
    })

    it('should return the time unchanged when date or time is missing', () => {
        const time = moment('2020-02-12T13:30:00');
        expect(applyDateToTime(null, time)).toBe(time);
        expect(applyDateToTime(new Date(2020, 1, 20), null)).toBe(null);
    })

    it('should accept a raw Date as the time', () => {
        const result = applyDateToTime(new Date(2020, 1, 20), new Date(2020, 1, 12, 13, 30, 0));
        expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2020-02-20 13:30:00');
    })

    it('should re-date a time across a year boundary', () => {
        const result = applyDateToTime(new Date(2021, 0, 1), moment('2020-12-31T23:30:00'));
        expect(result.format('YYYY-MM-DD HH:mm:ss')).toBe('2021-01-01 23:30:00');
    })

    it('should re-date a time that carries todays date onto a future appointment date', () => {
        const appointmentDate = moment().add(10, 'days').startOf('day').toDate();
        const startTime = applyDateToTime(appointmentDate, moment().set({hour: 11, minute: 0, second: 0}));
        const endTime = applyDateToTime(appointmentDate, moment().set({hour: 13, minute: 0, second: 0}));
        expect(startTime.isSame(appointmentDate, 'day')).toBe(true);
        expect(endTime.isSame(appointmentDate, 'day')).toBe(true);
        expect(isStartTimeBeforeEndTime(startTime, endTime)).toBe(true);
    })
})

describe('applyDateToTimes', () => {
    it('should re-date both times and report no error when start is before end', () => {
        const result = applyDateToTimes(new Date(2020, 1, 20), moment('2020-02-12T11:00:00'), moment('2020-02-12T13:00:00'));
        expect(result.startTime.format('YYYY-MM-DD HH:mm')).toBe('2020-02-20 11:00');
        expect(result.endTime.format('YYYY-MM-DD HH:mm')).toBe('2020-02-20 13:00');
        expect(result.startTimeBeforeEndTimeError).toBe(false);
    })

    it('should report an error when start is not before end', () => {
        const result = applyDateToTimes(new Date(2020, 1, 20), moment('2020-02-12T13:00:00'), moment('2020-02-12T11:00:00'));
        expect(result.startTimeBeforeEndTimeError).toBe(true);
    })

    it('should clear a stale error once times typed before the date are re-dated onto the same day', () => {
        // start was typed on a different day than end, which looked like end-before-start
        const startTime = moment('2020-02-12T11:00:00');
        const endTime = moment('2020-02-10T13:00:00');
        expect(isStartTimeBeforeEndTime(startTime, endTime)).toBe(false);
        const result = applyDateToTimes(new Date(2020, 1, 20), startTime, endTime);
        expect(result.startTimeBeforeEndTimeError).toBe(false);
    })

    it('should not report an error when times are not yet entered', () => {
        const result = applyDateToTimes(new Date(2020, 1, 20), undefined, undefined);
        expect(result.startTimeBeforeEndTimeError).toBe(false);
    })
})
