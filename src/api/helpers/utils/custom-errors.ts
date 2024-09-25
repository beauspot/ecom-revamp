export class CustomAPIError extends Error {
  constructor( message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class ServiceAPIError extends Error {
  constructor(message: string) {
  super(message);
  };
}
