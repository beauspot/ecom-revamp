import { Service, Inject } from "typedi";
import { StatusCodes } from "http-status-codes";

import { BrandModel } from "@/models/brands.models";
import { BrandInterface } from "@/interfaces/brand.interface";
import { ServiceAPIError } from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "../helpers/utils/validateDbId";

@Service()
export class BrandService {
  constructor(
    @Inject(() => BrandModel) private brandmodel: typeof BrandModel
  ) {}

  createBrandService = async (category: BrandInterface) => {
    const newBrand = await this.brandmodel.create({ ...category });
    if (!newBrand) {
      throw new ServiceAPIError("Could not create Product Brand");
    }
    return newBrand;
  };

  updateBrandService = async (
    brandID: string,
    brandData: Partial<BrandInterface>
  ) => {
    const updateBrand = await this.brandmodel.findByIdAndUpdate(
      { _id: brandID },
      brandData,
      {
        new: true,
        runValidators: true,
      }
    );
    validateMongoDbID(brandID);
    if (!updateBrand)
      throw new ServiceAPIError(
        `The Brand with: ${brandID} was not found to be updated`
      );
    return updateBrand;
  };

  deleteBrandService = async (brandID: string) => {
    const brandd = await this.brandmodel.findOneAndDelete({
      _id: brandID,
    });
    validateMongoDbID(brandID);
    if (!brandd)
      throw new ServiceAPIError(
        `The Brand with the id: ${brandID} was not found to be deleted`
      );
    return brandd;
  };

  getBrandService = async (brand: string) => {
    const brandExists = await this.brandmodel.findById({ _id: brand });
    validateMongoDbID(brand);
    if (!brandExists)
      throw new ServiceAPIError(
        `The brand with the id: ${brand} does not exist`
      );
    return brandExists;
  };

  getAllBrandService = async (): Promise<BrandInterface[]> => {
    const getAllBrands = await this.brandmodel.find();
    if (getAllBrands.length <= 0) {
      throw new ServiceAPIError(`No product brands found`);
    }
    return getAllBrands;
  };
}
