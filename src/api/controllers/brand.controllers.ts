import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import {
  createBrandService,
  updateBrandService,
  deleteBrandService,
  getBrandService,
  getAllBrandService,
} from "@/services/brand.service";
import {CustomAPIError} from "@/helpers/utils/custom-errors";

export const createNewBrand = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const newbrand = await createBrandService(req.body);
    res.status(StatusCodes.OK).json({ brandData: newbrand });
  }
);

export const getAllBrands = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const allBrands = await getAllBrandService();
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

export const getSingleBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const brandID = await getBrandService(id);
    res.status(StatusCodes.OK).json({ brandData: brandID });
  }
);

export const updateSingleBrand = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBrand = await updateBrandService(id, req.body);
    res.status(StatusCodes.OK).json({ updated_data: updateBrand });
  }
);

export const delete_brand = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const brandID = await deleteBrandService(id);
    res.status(StatusCodes.OK).json({
      status: `Category with ID ${brandID} is deleted successfully`,
      categoryData: brandID,
    });
  }
);
