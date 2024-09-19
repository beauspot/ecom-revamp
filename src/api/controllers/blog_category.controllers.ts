import {Service, Inject} from "typedi";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

import { BlogCatService } from "../services/blogCat.service";
import {CustomAPIError} from "@/helpers/utils/custom-errors";

@Service()
export class BlogCatCtrl {

  constructor(@Inject() private blogcatservice : BlogCatService) {};

  createNewCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newcategory = await this.blogcatservice.createCategoryService(req.body);
      res.status(StatusCodes.OK).json({ categoryData: newcategory });
    }
  );
  
   getAllCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allCategories = await this.blogcatservice.getAllCategoryService();
      if (!allCategories || allCategories.length === 0)
        throw new CustomAPIError(
          `Cannot get all categories`,
          StatusCodes.NO_CONTENT
        );
      else
        res.status(StatusCodes.OK).json({
          total_categories: allCategories.length,
          categoryData: allCategories,
        });
    }
  );
  
   getSingleCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const categoryID = await this.blogcatservice.getCategoryService(id);
      res.status(StatusCodes.OK).json({ categoryData: categoryID });
    }
  );
  
   updateSingleCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const updateCategory = await this.blogcatservice.updateCategoryService(id, req.body);
      res.status(StatusCodes.OK).json({ updated_data: updateCategory });
    }
  );
  
   delete_category = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const categoryID = await this.blogcatservice.deleteCategoryService(id);
      res.status(StatusCodes.OK).json({
        status: `Category with ID ${categoryID} is deleted successfully`,
        categoryData: categoryID,
      });
    }
  );
  
};