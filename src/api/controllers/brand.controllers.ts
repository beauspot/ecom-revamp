import { Service, Inject } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { plainToInstance } from "class-transformer";

import { BrandsDTO } from "@/dto/brands.dto";
import { BrandService } from "@/services/brand.service";
import { CustomAPIError } from "@/helpers/utils/custom-errors";

@Service()
export class BrandController {
  constructor(@Inject() private brandservice: BrandService) {}

  createNewBrand = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const newbrand = await this.brandservice.createBrandService(req.body);

      const transFormedRes = plainToInstance(BrandsDTO, newbrand, {
        excludeExtraneousValues: true,
      });

      res.status(StatusCodes.OK).json({ brandData: transFormedRes });
    }
  );

  getAllBrands = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allBrands = await this.brandservice.getAllBrandService();

      const transFormedRes = plainToInstance(BrandsDTO, allBrands, {
        excludeExtraneousValues: true,
      });

      if (!allBrands || allBrands.length === 0)
        throw new CustomAPIError(
          `Cannot get all categories`,
          StatusCodes.NO_CONTENT
        );
      else
        res.status(StatusCodes.OK).json({
          total_categories: allBrands.length,
          brandData: transFormedRes,
        });
    }
  );

  getSingleBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const brandID = await this.brandservice.getBrandService(id);

    const transFormedRes = plainToInstance(BrandsDTO, brandID, {
      excludeExtraneousValues: true,
    });

    res.status(StatusCodes.OK).json({ brandData: transFormedRes });
  });

  updateSingleBrand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateBrand = await this.brandservice.updateBrandService(
      id,
      req.body
    );

    const transFormedRes = plainToInstance(BrandsDTO, updateBrand, {
      excludeExtraneousValues: true,
    });

    res.status(StatusCodes.OK).json({ updated_data: transFormedRes });
  });

  delete_brand = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.brandservice.deleteBrandService(id);

    res.status(StatusCodes.OK);
  });
}
