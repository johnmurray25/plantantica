import moment from "moment";

const waterNext = (d: Date, d2?: Date): string => {
    const n = d2 ? moment(d2).diff(d, "days") : moment().diff(d, "days");
    switch (n) {
        case 0:
            return "today";
        case 1:
            return "yesterday";
        default:
            return `${n} days ago`;
    }
};

describe("waterNext", () => {
    test("Should return 0 if equals", () => {
        expect(waterNext(new Date())).toEqual("today");
        expect(waterNext(new Date(), new Date())).toEqual("today");
    });

    test("Should return 1 for day before", () => {
        expect(waterNext(new Date(2022, 9, 21), new Date(2022, 9, 22))).toEqual("yesterday");
    });

    test("Should return 4 days ago", () => {
        expect(waterNext(new Date(2022, 9, 23), new Date(2022, 9, 27))).toEqual("4 days ago")
    });

    test("Should return negative for future date", () => {
        expect(waterNext(new Date(2022, 9, 23), new Date(2022, 9, 19))).toEqual("-4 days ago");
    })
});
