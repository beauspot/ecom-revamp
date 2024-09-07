import { z } from "zod";

export const validateUser = z.object({
  firstName: z
    .string({
      required_error: "users's first name is required",
    })
    .trim()
    .max(20),
  lastName: z
    .string({
      required_error: "users's last name is required",
    })
    .trim()
    .max(20),
  email: z
    .string({
      required_error: "users's email is needed",
    })
    .trim(),
  mobileNumber: z
    .string({
      required_error: "your mobile number is required.",
    })
    .trim(),
  password: z
    .string({ required_error: "Your password is required" })
    .trim()
    .max(15),
  confirmPassword: z.string({
    required_error: "Your password must be the same as your current",
  }),
});

const hasID = z.object({ id: z.string() });

export const userWithID = validateUser.merge(hasID);

export type User = z.infer<typeof userWithID>;

export type CreateUserDTO = z.infer<typeof validateUser>;

export type PartialCreateUserDTO = z.infer<typeof validateUser>;

export const PartialValidateSchema = validateUser.partial();

export type UpdateValidateDTO = z.infer<typeof PartialValidateSchema>;
