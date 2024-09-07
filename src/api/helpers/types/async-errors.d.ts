declare module "express-async-errors" {
  function express_async_errors(
    options?: any
  ): (req: any, res: any, next: any) => void;
  export = express_async_errors;
}
