export const getWeekDays = (startOfWeek) => {
    const weekDays = new Map([
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

    if (!startOfWeek) {
        return weekDays;
    }
    const index = [...weekDays.keys()].indexOf(startOfWeek.toUpperCase());
    const temp = [...weekDays.entries()];
    return new Map(temp.splice(index).concat(temp));
};
