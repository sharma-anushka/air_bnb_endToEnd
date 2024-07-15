// typings/ejs-mate.d.ts
declare module 'ejs-mate' {
    import { RequestHandler } from 'express';
  
    function ejsMate(path: string, options?: any): RequestHandler;
  
    export = ejsMate;
  }
  
  