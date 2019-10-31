import React from "react";
import {getWeekDays} from "./WeekDaysService";

describe('Weekdays Service', () => {
    it('should reorder the weekdays based on start of week', () => {
        const startOfWeek = 'Wednesday';
        const weekDays = getWeekDays(startOfWeek);
        expect([...weekDays.keys()]).toStrictEqual(['WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY']);
    });
});
