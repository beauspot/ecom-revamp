export function sumTotal(a: number, b: number) {
  return a + b;
}

export function myFunction(input: string) {
  if (typeof input !== "string") {
    throw new Error("The input must be a string!");
  }
}

export function fetchData(callback: any) {
  setTimeout(() => {
    callback("peanut butter");
  }, 1000);
};

export interface IAuthData {
  usernameToLower: string;
  usernameCharacters: Array<string>;
  userDetails: Object | undefined;
  isAuthenticated: boolean;
}

export function authenticateuser(username: string, password: string): IAuthData {
  const authStatus = username === "deveLOPER" && password === "dev";
  return {
    usernameToLower: username.toLowerCase(),
    usernameCharacters: username.split(""),
    userDetails: {},
    isAuthenticated: authStatus,
  };
}

export function fetchPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("peanut butter"), 1000);
  });
}

// from j-grace coder
export function product(a: number, b: number): number {
  return a * b;
};

export function usernameLowerCase(username: string) {
  return username.toLowerCase()
}

export class UserNameToLowerCase {
  public toLower(username: string) {
    if (username === "") {
      throw new Error("A valid username must be provided");
    }
    return username.toLowerCase();
  }
}

// matches in jest
/**
 * 1. toBe() - used for primitive values
 * 2. toEqual() - used when comparing the values of objects or arrays.
 * 3. toBeTrue() - used to determine if a logic is true.
 * 4. toBeFalsy() - used to determine if a logic is false.
 * 5. toThrow() - used to test functions when they throw an error
 */
