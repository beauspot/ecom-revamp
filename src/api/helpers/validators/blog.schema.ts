import { object, string, boolean, TypeOf } from "zod";

export const createBlogsSchema = object({
  body: object({
    title: string({
      required_error: "The title for the blog's post is required",
    }),
    description: string({
      required_error: "The product description is required",
    }),
    category: string({
      required_error: "product category is required",
    }),
    isLiked: boolean({
      required_error: "this should be a true or false field",
    }).optional(),
  }),
});

export const updateBlogsSchema = object({
  body: object({
    title: string({
      required_error: "The title for the blog's post is required",
    }).optional(),
    description: string({
      required_error: "The product description is required",
    }).optional(),
    category: string({
      required_error: "product category is required",
    }).optional(),
    isLiked: boolean({
      required_error: "this should be a true or false field",
    }).optional(),
  }),
});

export const blogCategorySchema = object({
  body: object({
    title: string({
      required_error: "the blog category is needed",
    }),
  }),
});

export const updateBlogCategorySchema = object({
  body: object({
    title: string({
      required_error: "the blog category is needed",
    }).optional(),
  }),
});

export type CreateBlogSchema = TypeOf<typeof createBlogsSchema>["body"];
export type UpdateBlogSchema = TypeOf<typeof updateBlogsSchema>["body"];
export type BlogCategorySchema = TypeOf<typeof blogCategorySchema>["body"];
export type UpdateBlogCategorySchema = TypeOf<
  typeof updateBlogCategorySchema
>["body"];
