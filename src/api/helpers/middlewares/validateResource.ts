import { AnyZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e: any) {
      if (e instanceof ZodError) {
        const formattedErrors = e.errors.map((err) => ({
          message: err.message,
          path: err.path.join(" > "),  // Joins the path array for readability
        }));

        // Send the formatted errors in the response
        return res.status(400).json({
          error_message: formattedErrors,
        });
      }

      // If the error is not a ZodError, forward it
      next(e);
    }
  };
