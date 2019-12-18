import{
    isValidUSDate
} from "./DateUtil";

describe('DateUtil', () =>{
    it('should return true when a valid date is passed', ()=>{
        const isValid = isValidUSDate('02/12/2019');
        expect(isValid).toBe(true)

    })

    it('should return false when a no date is passed', ()=>{
        const isValid = isValidUSDate();
        expect(isValid).toBe(false)

    })

    it('should return false when an invalid date format is passed', ()=>{
        const isValid = isValidUSDate('01/02');
        expect(isValid).toBe(false)

    })

    it('should return false when an invalid date with valid format is passed', ()=>{
        const isValid = isValidUSDate('30/02/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when an invalid month  is passed', ()=>{
        const isValid = isValidUSDate('30/30/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when an invalid date  is passed', ()=>{
        const isValid = isValidUSDate('12/32/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when month is 4,6,9 or 11 and date is 31', ()=>{
        let isValid = isValidUSDate('11/31/2019');
        expect(isValid).toBe(false)
        isValid = isValidUSDate('9/31/2019');
        expect(isValid).toBe(false)
        isValid = isValidUSDate('6/31/2019');
        expect(isValid).toBe(false)
        isValid = isValidUSDate('4/31/2019');
        expect(isValid).toBe(false)
    })

    it('should return true when month is 1,3,5,7,8,10 or 12 and date is 31', ()=>{
        let isValid = isValidUSDate('1/31/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('3/31/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('5/31/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('7/31/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('8/31/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('10/31/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('12/31/2019');
        expect(isValid).toBe(true)
    })

    it('should return true when it is a leapyear and date is 29', ()=>{
        let isValid = isValidUSDate('2/29/2020');
        expect(isValid).toBe(true)

    })

    it('should return false when it is a leapyear and date is above 29', ()=>{
        let isValid = isValidUSDate('2/30/2020');
        expect(isValid).toBe(false)

    })
})

