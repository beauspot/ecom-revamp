import { z, object, string, TypeOf } from "zod";
import { isValidObjectId } from "mongoose";

export const brandsSchema = object({
  body: object({
    title: string({
      required_error: "a product brand is required.",
    }),
  }),
});

export const updateBrandSchema = object({
  body: object({
    title: string({
      required_error: "a product brand is required.",
    }).optional(),
  }),

  params: object({
    id: string({
      required_error: "your brand Id is invalid",
    }).refine((id) => isValidObjectId(id), {
      message: "The ID is invalid",
    }),
  }),
});

export const getSingleBrandsSchema = object({
  params: object({
    id: string({
      required_error: "your brand ID is invalid.",
    }).refine((id) => isValidObjectId(id), {
      message: "The Id is invalid",
    }),
  }),
});

export const deleteBrandsSchema = object({
  params: object({
    id: string({
      required_error: "a product brand is required.",
    }).refine((id) => isValidObjectId(id), {
      message: "The Id is invalid",
    }),
  }),
});

export type PostBrand = TypeOf<typeof brandsSchema>["body"];
export type GetBrand = TypeOf<typeof getSingleBrandsSchema>["params"];
export type updateBrandBody = TypeOf<typeof updateBrandSchema>["body"];
export type updateBrandPrams = TypeOf<typeof updateBrandSchema>["params"];
export type deleteBrand = TypeOf<typeof deleteBrandsSchema>["params"];
