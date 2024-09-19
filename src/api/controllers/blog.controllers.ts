import {Service, Inject} from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { UploadedFile } from "express-fileupload";

import { BlogService } from "@/services/blog.service";
import {CustomAPIError} from "@/helpers/utils/custom-errors";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";


@Service()
export class BlogsController {

  constructor(@Inject() private blogsService: BlogService) {};

  create_new_blog = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newblog = await this.blogsService.createBlog(req.body);
      res.status(StatusCodes.OK).json({ blogPost: newblog });
    }
  );
  
   update_blog = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const updateBlogPost = await this.blogsService.updateBlog(id, req.body);
      res.status(StatusCodes.OK).json({ blogPost: updateBlogPost });
    }
  );
  
   get_single_blog = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const blogID = await this.blogsService.getSingleBlog(id);
      res.status(StatusCodes.OK).json(blogID);
    }
  );
  
   getallBlogs = asyncHandler(async (req: Request, res: Response) => {
    const allBlogs = await this.blogsService.getAllBlogs();
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
  
   deleteblog = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      const blogID = await this.blogsService.deleteBlog(id);
      res.status(StatusCodes.OK).json({
        status: "Deleted Blog Successfully",
        BlogData: blogID,
      });
    }
  );
  
   likeBlogController = async (
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
        const updatedBlog = await this.blogsService.likeBlogService(blogId, userId);
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
  
   dislikeBlogController = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    const { blogId } = req.body;
    const userId = req?.user?.id;
  
    if (userId) {
      try {
        const updatedBlog = await this.blogsService.dislikeBlogService(blogId, userId);
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
  
   uploadBlogImageCtrl = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      validateMongoDbID(id);
      const files = req.files as Record<string, UploadedFile | UploadedFile[]>;
  
      try {
        const findBlog = await this.blogsService.uploadBlogImageService(id, files);
        res.status(StatusCodes.OK).json(findBlog);
      } catch (error: any) {
        throw new Error(error.message);
      }
    }
  );
};