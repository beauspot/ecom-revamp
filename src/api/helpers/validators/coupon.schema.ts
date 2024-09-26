import { isValidObjectId } from "mongoose";
import { object, string, TypeOf, number, date } from "zod";

export const createCouponSchema = object({
  body: object({
    name: string({
      required_error: "the coupon requires a name.",
    }),
    expiry: date({
      required_error: "the expiry date is required.",
    }),

    discount: number({
      required_error: "discount is required",
    }),
  }),
});

export const updateCouponSchema = object({
  body: object({
    name: string({
      required_error: "the coupon requires a name.",
    }),
    expiry: date({
      required_error: "the expiry date is required.",
    }),

    discount: number({
      required_error: "discount is required",
    }),
  }),

  params: object({
    id: string({
      required_error: "The Id of the coupon is not valid",
    }).refine((id) => isValidObjectId(id), {
      message: "The ID is invalid",
    }),
  }),
});

export const getSingleCoupon = object({
  params: object({
    id: string({
      required_error: "The Id of the coupon is not valid",
    }).refine((id) => isValidObjectId(id), {
      message: "The ID is invalid",
    }),
  }),
});

export const deleteSingleCoupon = object({
  params: object({
    id: string({
      required_error: "The Id of the coupon is not valid",
    }).refine((id) => isValidObjectId(id), {
      message: "The ID is invalid",
    }),
  }),
});

export type createCouponInput = TypeOf<typeof createCouponSchema>["body"];
export type updateCouponInput = TypeOf<typeof updateCouponSchema>["body"];
export type updateCouponParams = TypeOf<typeof updateCouponSchema>["params"];
export type getSingleCouponParams = TypeOf<typeof getSingleCoupon>["params"];
export type deleteSingleCouponParams = TypeOf<typeof deleteSingleCoupon>["params"];