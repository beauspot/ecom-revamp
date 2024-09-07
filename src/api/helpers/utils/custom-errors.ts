export class CustomAPIError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ServiceAPIError extends Error {
  constructor(public message: string) {
  super(message);
  };
}


