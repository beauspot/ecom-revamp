import { Service, Inject } from "typedi";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { plainToInstance } from "class-transformer";

import { BlogCategoryDTO } from "@/helpers/dto/blog.dto";
import { BlogCatService } from "../services/blogCat.service";
import { CustomAPIError } from "@/helpers/utils/custom-errors";

@Service()
export class BlogCatCtrl {
  constructor(@Inject() private blogcatservice: BlogCatService) {}

  createNewCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newcategory = await this.blogcatservice.createCategoryService(
        req.body
      );

      let transformedRes = plainToInstance(BlogCategoryDTO, newcategory, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      res.status(StatusCodes.OK).json({ categoryData: transformedRes });
    }
  );

  getAllCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allCategories = await this.blogcatservice.getAllCategoryService();

      let transformedRes = plainToInstance(BlogCategoryDTO, allCategories, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      if (!allCategories || allCategories.length === 0)
        throw new CustomAPIError(
          `Cannot get all categories`,
          StatusCodes.NO_CONTENT
        );
      else
        res.status(StatusCodes.OK).json({
          total_categories: allCategories.length,
          categoryData: transformedRes,
        });
    }
  );

  getSingleCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryID = await this.blogcatservice.getCategoryService(id);

    let transformedRes = plainToInstance(BlogCategoryDTO, categoryID, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    res.status(StatusCodes.OK).json({ categoryData: transformedRes });
  });

  updateSingleCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateCategory = await this.blogcatservice.updateCategoryService(
      id,
      req.body
    );

    let transformedRes = plainToInstance(BlogCategoryDTO, updateCategory, {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    });

    res.status(StatusCodes.OK).json({ updated_data: transformedRes });
  });

  delete_category = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryID = await this.blogcatservice.deleteCategoryService(id);
    res.status(StatusCodes.OK).json({
      status: `Category with ID ${categoryID} is deleted successfully`,
      categoryData: categoryID,
    });
  });
};