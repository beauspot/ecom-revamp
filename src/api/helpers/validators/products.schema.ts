import { isValidObjectId } from "mongoose";
import { z, object, string, number, TypeOf } from "zod";

export const createProductSchema = object({
  body: object({
    title: string({
      required_error: "The Product title is meant to be a string.",
    }),
    description: string({
      required_error: "The product description is meant to be a string.",
    }),
    price: number({
      required_error: "The price of the product is a number.",
    }),
    brand: string({
      required_error: "The brand is supposed to be a string.",
    }),
    category: string({
      required_error: "The category is supposed to be a string.",
    }),
    sold: number({
      required_error: "The amount of products sold should be a number.",
    }),
    quantity: number({
      required_error:
        "The quantity of theproducts available should be in number.",
    }),
    color: string({
      required_error: "The colors of the product should be string.",
    }),
  }),
});

export const updateSingleProductSchema = object({
  params: object({
    _id: string({
      required_error: "there is no product with such an Id",
    }).refine(isValidObjectId),
  }),
});

export const getSingleProductSchema = object({
  params: object({
    _id: string({
      required_error: "there is no product with such an Id",
    }).refine(isValidObjectId),
  }),
});

export const deleteSingleProductSchema = object({
  params: object({
    _id: string({
      required_error: "there is no product with such an Id",
    }).refine(isValidObjectId),
  }),
});

export const createProductCategorySchema = object({
  body: object({
    title: string({
      required_error: "The product category title is needed.",
    }),
  }),
});

export type GetProductCategoryByParams = TypeOf<
  typeof getSingleProductSchema
>["params"];
export type UpdateProductCategoryByParams = TypeOf<
  typeof updateSingleProductSchema
>["params"];
export type DeleteProductCategoryByParams = TypeOf<
  typeof deleteSingleProductSchema
>["params"];
export type ProductInputSchema = TypeOf<typeof createProductSchema>["body"];
export type ProductCategoryInput = TypeOf<
  typeof createProductCategorySchema
>["body"];
