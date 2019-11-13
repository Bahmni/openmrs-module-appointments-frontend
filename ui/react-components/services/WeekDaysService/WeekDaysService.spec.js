import React from "react";
import {getSelectedWeekDays, getWeekDays} from "./WeekDaysService";

describe('Weekdays Service', () => {
    it('should reorder the weekdays based on start of week', () => {
        const startOfWeek = 'Wednesday';
        const weekDays = getWeekDays(startOfWeek);
        expect([...weekDays.keys()]).toStrictEqual(['WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY']);
    });

    it('should get selected week days', () => {
        const weekDays = new Map([
            ['SUNDAY', {
                translationKey: 'SUNDAY',
                defaultValue: 'Su',
                isSelected: true
            }], ['MONDAY', {
                translationKey: 'MONDAY',
                defaultValue: 'Mo',
                isSelected: false
            }], ['TUESDAY', {
                translationKey: 'TUESDAY',
                defaultValue: 'Tu',
                isSelected: false
            }], ['WEDNESDAY', {
                translationKey: 'WEDNESDAY',
                defaultValue: 'We',
                isSelected: true
            }], ['THURSDAY', {
                translationKey: 'THURSDAY',
                defaultValue: 'Th',
                isSelected: false
            }], ['FRIDAY', {
                translationKey: 'FRIDAY',
                defaultValue: 'Fr',
                isSelected: false
            }], ['SATURDAY', {
                translationKey: 'SATURDAY',
                defaultValue: 'Sa',
                isSelected: true
            }]
        ]);
        const selectedWeekDays = getSelectedWeekDays(weekDays);
        expect(selectedWeekDays.length).toBe(3);
        expect(selectedWeekDays.includes("SATURDAY", "WEDNESDAY", "SUNDAY")).toBeTruthy();
    });

    it('should return default map when start of week is number', () => {
        const startOfWeek = 1;
        const weekDays = getWeekDays(startOfWeek);
        expect([...weekDays.keys()]).toStrictEqual(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']);
    });

    it('should return default map when start of week is invalid string', () => {
        const startOfWeek = "INVALID";
        const weekDays = getWeekDays(startOfWeek);
        expect([...weekDays.keys()]).toStrictEqual(['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']);
    });
});
