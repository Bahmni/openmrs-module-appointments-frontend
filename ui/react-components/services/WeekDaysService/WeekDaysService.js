const getDefaultWeekDaysMap = () => {
    return new Map([
        ['SUNDAY', {
            translationKey: 'SUNDAY',
            defaultValue: 'Su',
            isSelected: false
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
            isSelected: false
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
            isSelected: false
        }]
    ]);
};

export const getWeekDays = (startOfWeek) => {
    const weekDays = getDefaultWeekDaysMap();

    if (!startOfWeek) {
        return weekDays;
    }
    const index = [...weekDays.keys()].indexOf(startOfWeek.toUpperCase());
    const weekDaysArray = [...weekDays.entries()];
    return new Map(weekDaysArray.splice(index).concat(weekDaysArray));
};

export const getSelectedWeekDays = weekDays => [...weekDays.keys()].filter(key => weekDays.get(key).isSelected);

export const selectWeekDays = (weekDays, selectedDaysOfWeek) => {
    if (!weekDays)
        weekDays = getDefaultWeekDaysMap();

    selectedDaysOfWeek.forEach(selectedDayOfWeek => weekDays.get(selectedDayOfWeek).isSelected = true);
    return weekDays;
};
