import { StatusCodes } from "http-status-codes";
import { BlogModel } from "@/models/blogModel";
import { UploadedFile } from "express-fileupload";
// import { authModel } from "../models/userModels";
import { blogInterface } from "@/interfaces/blog.interface";
import {ServiceAPIError}  from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { cloudinaryUpload } from "@/config/cloudinaryconfig";
import { FileWithNewPath } from "@/interfaces/filePath";
import fs from "fs";

export const createBlog = async (blogPost: blogInterface) => {
  const newBlog = await BlogModel.create({ ...blogPost });
  if (!newBlog)
    throw new ServiceAPIError ("Your Post was not created Successfully.");
  return newBlog;
};

export const updateBlog = async (
  blogId: string,
  updateData: Partial<blogInterface>
) => {
  const updatepost = await BlogModel.findByIdAndUpdate(
    { _id: blogId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updatepost)
    throw new ServiceAPIError (
      `The blog with the id: ${blogId} was not found to be updated`,
    
    );
  return updatepost;
};

export const getSingleBlog = async (blogID: string) => {
  const blogExists = await BlogModel.findById(blogID)
    .populate("likes")
    .populate("dislikes");
  if (!blogExists) {
    throw new ServiceAPIError (
      `The blog with the ID ${blogID} does not exist`,
     
    );
  }
  // Increment numViews by 1
  await BlogModel.findByIdAndUpdate(
    blogID,
    {
      $inc: { numViews: 1 },
    },
    { new: true }
  );

  return blogExists;
};

export const getAllBlogs = async (): Promise<blogInterface[] | void> => {
  const allBlogs = await BlogModel.find();
  if (allBlogs.length <= 0) {
    throw new ServiceAPIError (`No blogs found`);
  }
  return allBlogs;
};

export const deleteBlog = async (blogId: string) => {
  const blog = await BlogModel.findOneAndDelete({ _id: blogId });
  if (!blog)
    throw new ServiceAPIError (
      `Blog with id: ${blogId} is not found`,
    
    );
};

export const likeBlogService = async (blogId: string, userId: string) => {
  // Find the blog which you want to be liked
  const blog = await BlogModel.findById(blogId);
  validateMongoDbID(blogId);
  // console.log("blog ID: ", blogId);

  if (!blog) {
    throw new ServiceAPIError (
      `The blog with ID ${blogId} does not exist`
    );
  }

  const isLiked: boolean = blog.isLiked;

  // Check if the user has already disliked this blog
  const alreadyDisliked: boolean = blog.dislikes.some(
    (dislikedUserId) => dislikedUserId.toString() === userId
  );

  if (alreadyDisliked) {
    // Remove the user's dislike
    await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: userId },
        isDisliked: false,
      },
      { new: true }
    );
  }
  let updatedBlog;

  if (isLiked) {
    // Remove the user's like
    updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: userId },
        isLiked: false,
      },
      { new: true }
    );
  } else {
    // Add the user's like
    updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $push: { likes: userId },
        isLiked: true,
      },
      { new: true }
    );
  }

  return updatedBlog;
};

export const dislikeBlogService = async (blogId: string, userId: string) => {
  validateMongoDbID(blogId);

  // Find the blog which you want to be disliked
  const blog = await BlogModel.findById(blogId);

  if (!blog) {
    throw new ServiceAPIError (
      `The blog with ID ${blogId} does not exist`
    );
  }

  const isDisLiked = blog.isDisLiked;

  // Check if the user has already liked the blog
  const alreadyLiked = blog.likes.some(
    (likedUserId) => likedUserId.toString() === userId
  );

  if (alreadyLiked) {
    // Remove the user's like
    await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { likes: userId },
        isLiked: false,
      },
      { new: true }
    );
  }

  let updatedBlog;

  if (isDisLiked) {
    // Remove the user's dislike
    updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $pull: { dislikes: userId },
        isDisliked: false,
      },
      { new: true }
    );
  } else {
    // Add the user's dislike
    updatedBlog = await BlogModel.findByIdAndUpdate(
      blogId,
      {
        $push: { dislikes: userId },
        isDisliked: true,
      },
      { new: true }
    );
  }

  return updatedBlog;
};

export const uploadBlogImageService = async (
  id: string,
  files: Record<string, UploadedFile | UploadedFile[]>
): Promise<any> => {
  try {
    const uploader = async (path: string): Promise<FileWithNewPath> => {
      const result = await cloudinaryUpload(path);
      return { path, url: result.url };
    };
    const urls: string[] = [];

    const fileArray = Array.isArray(files) ? files : [files];

    for (const file of fileArray) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.url);
      fs.unlinkSync(path);
    }
    const findproduct = await BlogModel.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    return findproduct;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message);
  }
};
