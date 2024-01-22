import{
    isValidUSDate
} from "./DateUtil";

describe('DateUtil', () =>{
    it('should return true when a valid date is passed', ()=>{
        const isValid = isValidUSDate('12/Feb/2019');
        expect(isValid).toBe(true)

    })

    it('should return false when a no date is passed', ()=>{
        const isValid = isValidUSDate();
        expect(isValid).toBe(false)

    })

    it('should return false when an invalid date format is passed', ()=>{
        const isValid = isValidUSDate('01/Feb');
        expect(isValid).toBe(false)

    })

    it('should return false when an invalid date with valid format is passed', ()=>{
        const isValid = isValidUSDate('30/Feb/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when an invalid month  is passed', ()=>{
        const isValid = isValidUSDate('30/Hui/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when an invalid date  is passed', ()=>{
        const isValid = isValidUSDate('32/Dec/2019');
        expect(isValid).toBe(false)
    })

    it('should return false when month is 4,6,9 or 11 and date is 31', ()=>{
        let isValid = isValidUSDate('31/Nov/2019');
        expect(isValid).toBe(false)
        isValid = isValidUSDate('31/Sep/2019');
        expect(isValid).toBe(false)
        isValid = isValidUSDate('31/Jun/2019');
        expect(isValid).toBe(false)
        isValid = isValidUSDate('31/Apr/2019');
        expect(isValid).toBe(false)
    })

    it('should return true when month is 1,3,5,7,8,10 or 12 and date is 31', ()=>{
        let isValid = isValidUSDate('31/Jan/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('31/Mar/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('31/May/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('31/Jul/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('31/Aug/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('31/Oct/2019');
        expect(isValid).toBe(true)
        isValid = isValidUSDate('31/Dec/2019');
        expect(isValid).toBe(true)
    })

    it('should return true when it is a leapyear and date is 29', ()=>{
        let isValid = isValidUSDate('29/Feb/2020');
        expect(isValid).toBe(true)

    })

    it('should return false when it is a leapyear and date is above 29', ()=>{
        let isValid = isValidUSDate('30/Feb/2020');
        expect(isValid).toBe(false)

    })
})

