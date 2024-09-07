declare module "xss-clean" {
  function xss(options?: any): (req: any, res: any, next: any) => void;
  export = xss;
}
