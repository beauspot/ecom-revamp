import { isValidObjectId } from "mongoose";
import { z, object, string, number, TypeOf } from "zod";

export const createProductSchema = object({
    body: object({
        title: string({
            required_error: "The Product title is meant to be a string.",
        }),
        description: string({
            required_error: "The product description is meant to be a string."
        }),
        price: number({
            required_error: "The price of the product is a number."
        }),
        brand: string({
            required_error: "The brand is supposed to be a string."
        }),
        category: string({
            required_error: "The category is supposed to be a string."
        }),
        sold: number({
            required_error: "The amount of products sold should be a number."
        }),
        quantity: number({
            required_error: "The quantity of theproducts available should be in number."
        }),
        color: string({
            required_error: "The colors of the product should be string."
        })
    })
});

export type ProductInputSchema = TypeOf<typeof createProductSchema>["body"];