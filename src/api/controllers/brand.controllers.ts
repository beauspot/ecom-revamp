import { Service, Inject } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

import { BrandService } from "@/services/brand.service";
import { CustomAPIError } from "@/helpers/utils/custom-errors";

@Service()
export class BrandController {
  constructor(@Inject() private brandservice: BrandService) {}

  createNewBrand = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newbrand = await this.brandservice.createBrandService(req.body);
      res.status(StatusCodes.OK).json({ brandData: newbrand });
    }
  );

  getAllBrands = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allBrands = await this.brandservice.getAllBrandService();
      if (!allBrands || allBrands.length === 0)
        throw new CustomAPIError(
          `Cannot get all categories`,
          StatusCodes.NO_CONTENT
        );
      else
        res.status(StatusCodes.OK).json({
          total_categories: allBrands.length,
          brandData: allBrands,
        });
    }
  );

  getSingleBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const brandID = await this.brandservice.getBrandService(id);
    res.status(StatusCodes.OK).json({ brandData: brandID });
  });

  updateSingleBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBrand = await this.brandservice.updateBrandService(
      id,
      req.body
    );
    res.status(StatusCodes.OK).json({ updated_data: updateBrand });
  });

  delete_brand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const brandID = await this.brandservice.deleteBrandService(id);
    res.status(StatusCodes.OK).json({
      status: `Category with ID ${brandID} is deleted successfully`,
      categoryData: brandID,
    });
  });
}
