import { Service, Inject } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { plainToInstance } from "class-transformer";

import { ProductCategoryDTO } from "@/dto/product.dto";
import { CustomAPIError } from "@/helpers/utils/custom-errors";
import { ProductCategoryService } from "@/services/ProdCat.service";

@Service()
export class ProductCategoryCtrl {
  constructor(@Inject() private productCatService: ProductCategoryService) {}

  createNewCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newcategory = await this.productCatService.createCategoryService(
        req.body
      );

      const transformedCategory = plainToInstance(
        ProductCategoryDTO,
        newcategory,
        {
          excludeExtraneousValues: true,
        }
      );

      res.status(StatusCodes.OK).json({ categoryData: transformedCategory });
    }
  );

  getAllCategory = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allCategories =
        await this.productCatService.getAllCategoryService();

      const transformedCategory = plainToInstance(
        ProductCategoryDTO,
        allCategories,
        {
          excludeExtraneousValues: true,
        }
      );

      res.status(StatusCodes.OK).json({
        total_categories: allCategories.length,
        categoryData: transformedCategory,
      });
    }
  );

  getSingleCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryID = await this.productCatService.getCategoryService(id);

    const transformedCategory = plainToInstance(
      ProductCategoryDTO,
      categoryID,
      {
        excludeExtraneousValues: true,
      }
    );

    res.status(StatusCodes.OK).json({ categoryData: transformedCategory });
  });

  updateSingleCategory = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateCategory = await this.productCatService.updateCategoryService(
      id,
      req.body
    );

    const transformedCategory = plainToInstance(
      ProductCategoryDTO,
      updateCategory,
      {
        excludeExtraneousValues: true,
      }
    );

    res.status(StatusCodes.OK).json({ updated_data: transformedCategory });
  });

  delete_category = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const categoryID = await this.productCatService.deleteCategoryService(id);
    res.status(StatusCodes.OK).json({
      status: `Category with ID ${categoryID} is deleted successfully`,
      categoryData: categoryID,
    });
  });
}
