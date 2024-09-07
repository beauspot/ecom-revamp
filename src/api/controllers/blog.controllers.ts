import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
// import slugify from "slugify";
import {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
  deleteBlog,
  likeBlogService,
  dislikeBlogService,
  uploadBlogImageService,
} from "@/services/blog.service";
import CustomAPIError from "@/helpers/utils/custom-errors";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";

export const create_new_blog = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const newblog = await createBlog(req.body);
    res.status(StatusCodes.OK).json({ blogPost: newblog });
  }
);

export const update_blog = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateBlogPost = await updateBlog(id, req.body);
    res.status(StatusCodes.OK).json({ blogPost: updateBlogPost });
  }
);

export const get_single_blog = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const blogID = await getSingleBlog(id);
    res.status(StatusCodes.OK).json(blogID);
  }
);

export const getallBlogs = asyncHandler(async (req: Request, res: Response) => {
  const allBlogs = await getAllBlogs();
  if (!allBlogs) {
    throw new CustomAPIError(
      "Cannot Get all blog Posts",
      StatusCodes.NOT_FOUND
    );
  }
  res
    .status(StatusCodes.OK)
    .json({ total: allBlogs.length, blogData: allBlogs });
});

export const deleteblog = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const blogID = await deleteBlog(id);
    res.status(StatusCodes.OK).json({
      status: "Deleted Blog Successfully",
      BlogData: blogID,
    });
  }
);

export const likeBlogController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { blogId } = req.body;
  const userId = req?.user?.id;

  if (!blogId) {
    res.status(StatusCodes.BAD_REQUEST).json({
      error: "Missing 'blogId' in the request body.",
    });
    return;
  }

  if (userId) {
    try {
      const updatedBlog = await likeBlogService(blogId, userId);
      res.json(updatedBlog);
    } catch (error) {
      if (error instanceof CustomAPIError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Something went wrong",
        });
      }
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: "User not authenticated or missing user information",
    });
  }
};

export const dislikeBlogController = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  const { blogId } = req.body;
  const userId = req?.user?.id;

  if (userId) {
    try {
      const updatedBlog = await dislikeBlogService(blogId, userId);
      res.json(updatedBlog);
    } catch (error) {
      if (error instanceof CustomAPIError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Something went wrong",
        });
      }
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      error: "User is not authenticated or missing user information",
    });
  }
};

export const uploadBlogImageCtrl = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDbID(id);
    const files = req.files as Record<string, UploadedFile | UploadedFile[]>;

    try {
      const findBlog = await uploadBlogImageService(id, files);
      res.status(StatusCodes.OK).json(findBlog);
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
);