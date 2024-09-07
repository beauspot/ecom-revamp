class CustomAPIError extends Error {
  constructor(public message: string, public statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

class ServiceAPIError extends Error {

}

export default CustomAPIError;
