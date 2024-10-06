export function sumTotal(a: number, b: number) {
  return a + b;
}

export function myFunction(input: string) {
  if (typeof input !== "string") {
    throw new Error("The input must be a string!");
  }
};

export function fetchData(callback: any){
    setTimeout(() => {
        callback("peanut butter")
    }, 1000);
}

// matches in jest
/**
 * 1. toBe() - used for primitive values
 * 2. toEqual() - used when comparing the values of objects or arrays.
 * 3. toBeTrue() - used to determine if a logic is true.
 * 4. toBeFalsy() - used to determine if a logic is false.
 * 5. toThrow() - used to test functions when they throw an error
 */
