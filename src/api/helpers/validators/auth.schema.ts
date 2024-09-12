import { z, object, string, TypeOf } from "zod";
import validator from "validator";

/**
 * TODO:
 * firstName
 * lastName
 * email
 * mobileNumber
 * password
 * role
 * address
 */

export enum UserRoles {
  // MERCHANT = "merchant",
  CUSTOMER = "user",
  ADMIN = "admin"
}

export const createUserSchema = object({
  body: object({
    firstName: string({
      required_error: "first name is required",
    }),
    lastName: string({
      required_error: "last name is required",
    }),
    password: string({
      required_error: "Password is required",
    })
      .min(9, "Password too short - should be 9 chars minimum")
      .max(20, "Password too long - should be 20 chars maximum")
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: string({
      required_error: "passwordConfirmation is required",
    }),
    address: string().optional(), // Address is optional
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email").refine(email => validator.isEmail(email), {
      message: "Email format is invalid",
    }),
    mobileNumber: string({
      required_error: "mobile number is required",
    }).refine(mobileNumber => validator.isMobilePhone(mobileNumber), {
      message: "phone number format is invalid"
    }),
    role: z.optional(z.nativeEnum(UserRoles)).optional().default(UserRoles.CUSTOMER),
  }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),
});

export const customerLoginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email").refine(email => validator.isEmail(email), {
      message: "Email format is invalid",
    }),
    password: string({
      required_error: "Password is required",
    })
      .min(9, "Password too short - should be 9 chars minimum")
      .max(20, "Password too long - should be 20 chars maximum")
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: "Password must contain at least one special character",
      }),
  })
});

export const adminLoginSchema = object({
  body: object({
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email").refine(email => validator.isEmail(email), {
      message: "Email format is invalid",
    }),
    password: string({
      required_error: "Password is required",
    })
      .min(9, "Password too short - should be 9 chars minimum")
      .max(20, "Password too long - should be 20 chars maximum")
      .refine((password) => /[A-Z]/.test(password), {
        message: "Password must contain at least one uppercase letter",
      })
      .refine((password) => /[a-z]/.test(password), {
        message: "Password must contain at least one lowercase letter",
      })
      .refine((password) => /[0-9]/.test(password), {
        message: "Password must contain at least one number",
      })
      .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
        message: "Password must contain at least one special character",
      }),
  })
});


export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  "body.passwordConfirmation"
>;
export type AdminLoginInput = TypeOf<typeof customerLoginSchema>["body"];
export type UserLoginInput = TypeOf<typeof adminLoginSchema>["body"];