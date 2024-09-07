import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import CustomAPIError from "@/helpers/utils/custom-errors";
import {
  createCategoryService,
  updateCategoryService,
  deleteCategoryService,
  getCategoryService,
  getAllCategoryService,
} from "../services/blogCat.service";

export const createNewCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const newcategory = await createCategoryService(req.body);
    res.status(StatusCodes.OK).json({ categoryData: newcategory });
  }
);

export const getAllCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const allCategories = await getAllCategoryService();
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

export const getSingleCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryID = await getCategoryService(id);
    res.status(StatusCodes.OK).json({ categoryData: categoryID });
  }
);

export const updateSingleCategory = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateCategory = await updateCategoryService(id, req.body);
    res.status(StatusCodes.OK).json({ updated_data: updateCategory });
  }
);

export const delete_category = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryID = await deleteCategoryService(id);
    res.status(StatusCodes.OK).json({
      status: `Category with ID ${categoryID} is deleted successfully`,
      categoryData: categoryID,
    });
  }
);
