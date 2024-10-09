import { sumTotal, myFunction, fetchData, fetchPromise } from "./sum";

test("adds 1 + 2 to equal 3", () => {
  expect(1 + 2).toBe(3);
});

describe("#testing the sumTotal function", () => {
  test("it adds 2 numbers together", () => {
    expect(sumTotal(2, 3)).toBe(5);
  });
});

describe("#working with toEqual Matchers", () => {
  test("object assignment", () => {
    const data: Record<string, number> = { one: 1 };
    data["two"] = 2;
    expect(data).toEqual({ one: 1, two: 2 });
  });
});

describe("#testing falsy matchers", () => {
  test("null is falsy", () => {
    const n = null;
    expect(n).toBeFalsy();
  });
});

describe("#testing truthy matchers", () => {
  test("0 is falsy", () => {
    const n = 0;
    expect(n).toBeFalsy();
  });
});

describe("#testing truthy matchers", () => {
  test("1 is truthy", () => {
    const n = 1;
    expect(n).toBeTruthy();
  });
});

describe("#testing error handling with toThrow()", () => {
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

// Testing Async code with jest

// using call backs for tests
describe("#writing async tests with callback functions", () => {
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

describe("#testting fetchPromise method", () => {
  test("resolve data should be peanut butter", () => {
    return expect(fetchPromise()).resolves.toBe("peanut butter");
  });

  // test("The test fails with an error", () => {
  //   return expect(fetchPromise()).rejects.toThrow('error')
  // })
});

// testing with async/await
describe("#Testing an asynchronous code with async/await", () => {
  test("the data is peanut butter", async () => {
    const data = await fetchPromise();
    expect(data).toBe("peanut butter");
  });
});

// mocks are fake implementations of real functions
// spys are tools that are used to track the impmentations of those functions
/**
 * Jest.fn
 * this is a way of creating a mock function & can be implemented
 * to return a specific value or perform a specific action
 */

describe("#mocking implementaion of a basic function", () => {
  test("mocking a function", () => {
    const mock = jest.fn((x) => 42 + x);
    expect(mock(1)).toBe(43);
    expect(mock).toHaveBeenCalledWith(1);
  });
});

/**
 * Jest.spy
 */

describe("Spying on a method of an object", () => {
  test("using the syp method in jest", () => {
    const video = {
      play() {
        return true;
      },
    };
    const spy = jest.spyOn(video, "play");
    video.play();

    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
