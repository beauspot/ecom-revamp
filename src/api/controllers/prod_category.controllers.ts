import { Service, Inject } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

import {CustomAPIError }from "@/helpers/utils/custom-errors";
import {ProductCategoryService} from "@/services/ProdCat.service";

@Service()
export class ProductCategoryCtrl {
  constructor(@Inject() private productCatService: ProductCategoryService){};


  createNewCategory = asyncHandler(
   async (req: Request, res: Response): Promise<void> => {
     const newcategory = await this.productCatService.createCategoryService(req.body);
     res.status(StatusCodes.OK).json({ categoryData: newcategory });
   }
  );

  getAllCategory = asyncHandler(
   async (req: Request, res: Response): Promise<void> => {
     const allCategories = await this.productCatService.getAllCategoryService();
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
      const categoryID = await this.productCatService.getCategoryService(id);
      res.status(StatusCodes.OK).json({ categoryData: categoryID });
    }
  );
  
   updateSingleCategory = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const updateCategory = await this.productCatService.updateCategoryService(id, req.body);
      res.status(StatusCodes.OK).json({ updated_data: updateCategory });
    }
  );
  
   delete_category = asyncHandler(
    async (req: Request, res: Response) => {
      const { id } = req.params;
      const categoryID = await this.productCatService.deleteCategoryService(id);
      res.status(StatusCodes.OK).json({
        status: `Category with ID ${categoryID} is deleted successfully`,
        categoryData: categoryID,
      });
    }
  );
};


