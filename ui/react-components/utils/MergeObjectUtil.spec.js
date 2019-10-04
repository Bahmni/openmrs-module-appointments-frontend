import {mergeObjects} from "./MergeObjectUtil";

describe("merge functionality", function () {
    let master;
    beforeEach(function () {
        master = {
            a: {
                c: "Hi",
                d: {
                    e: "Ola",
                    f: "Salut"
                }
            },
            b: "Hello"
        };
    });

    it("should change a leaf value", () => {
        const result = mergeObjects(master, {
            a: {
                d: {
                    e: "Konnichiwa"
                }

            }
        });
        expect(result.a.b).toBe(master.a.b);
        expect(result.a.d.e).toBe("Konnichiwa");
        expect(result.a.d.f).toBe(master.a.d.f);
    });

    it("should be able to remove a value", () => {
        const result = mergeObjects(master, {
            a: {
                d: {
                    e: "annyeonghaseyo",
                    f: null
                }

            }
        });
        expect(result.a.b).toBe(master.a.b);
        expect(result.a.c).toBe(master.a.c);
        expect(result.a.d.e).toBe("annyeonghaseyo");
        expect(result.a.d.f).toBeFalsy();
    });

    it("should be able to add a new node", () => {
        const result = mergeObjects(master, {
            x: {key: "something"}
        });
        expect(result.a.b).toBe(master.a.b);
        expect(result.a.c).toBe(master.a.c);
        expect(result.a.d.e).toBe("Ola");
        expect(result.x.key).toBe("something");
    });

    it("should be able to remove a null node", () => {
        const result = mergeObjects(master, {
            x: {key: "something"},
            a: {d: null, s: {}}
        });
        expect(result.a.b).toBe(master.a.b);
        expect(result.a.c).toBe(master.a.c);
        expect(result.a.d).toBeFalsy();
        expect(result.a.s).toBeTruthy();
        expect(result.x.key).toBe("something");
    });

    it("should not throw an error for undefined parameter", () => {
        const result = mergeObjects(master, undefined);
        expect(result.a.b).toBe(master.a.b);
        expect(result.a.c).toBe(master.a.c);
        expect(result.b).toBe(master.b);
        expect(result.a.d.e).toBe(master.a.d.e);
        expect(result.a.d.f).toBe(master.a.d.f);
    });

    it("should not throw an error for undefined base and custom parameters", () => {
        const base = undefined;
        const custom = undefined;
        const result = mergeObjects(base, custom);
        expect(result).toEqual({});
    });

    it("should not throw an error for undefined base parameter", () => {
        const base = undefined;
        const result = mergeObjects(base, master);
        expect(result.a.b).toBe(master.a.b);
        expect(result.a.c).toBe(master.a.c);
        expect(result.b).toBe(master.b);
        expect(result.a.d.e).toBe(master.a.d.e);
        expect(result.a.d.f).toBe(master.a.d.f);
    });

});
