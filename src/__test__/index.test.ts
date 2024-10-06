import { sumTotal, myFunction, fetchData } from "./sum";

test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

describe("testing the sumTotal function", () => {
  test("it adds 2 numbers together", () => {
    expect(sumTotal(2, 3)).toBe(5);
  });
});

describe("working with toEqual Matchers", () => {
  test("object assignment", () => {
    const data: Record<string, number> = { one: 1 };
    data["two"] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
  });
});

describe("testing falsy matchers", () => {
  test("null is falsy", () => {
    const n = null;
    expect(n).toBeFalsy();
  });
});

describe("testing truthy matchers", () => {
  test("0 is falsy", () => {
    const n = 0;
    expect(n).toBeFalsy();
  });
});

describe("testing truthy matchers", () => {
  test("1 is truthy", () => {
    const n = 1;
    expect(n).toBeTruthy();
  });
});

describe("testing error handling with toThrow()", () => {
  test("throws on an invalid input", () => {
    expect(() => {
      myFunction(null as unknown as string);
    }).toThrow("The input must be a string!");
  });

  test("throws on undefined input", () => {
    expect(() => {
      myFunction(undefined as unknown as string);
    }).toThrow("The input must be a string!");
  });
});

// using call backs for tests
describe("writing async tests with callback functions", () => {
  test("the data is peanut butter", (done) => {
    function callback(data: any) {
      try {
        expect(data).toBe("peanut butter");
        done();
      } catch (error: any) {
        done(error);
      }
    }
    fetchData(callback);
  });
});
