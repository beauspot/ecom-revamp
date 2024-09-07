import { StatusCodes } from "http-status-codes";
import { BrandModel } from "@/models/brands.models";
import {ServiceAPIError}  from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "../helpers/utils/validateDbId";
import { BrandInterface } from "@/interfaces/brand.interface";

export const createBrandService = async (category: BrandInterface) => {
  const newBrand = await BrandModel.create({ ...category });
  if (!newBrand) {
    throw new ServiceAPIError (
      "Could not create Category"
    );
  }
  return newBrand;
};

export const updateBrandService = async (
  brandID: string,
  brandData: Partial<BrandInterface>
) => {
  const updateBrand = await BrandModel.findByIdAndUpdate(
    { _id: brandID },
    brandData,
    {
      new: true,
      runValidators: true,
    }
  );
  validateMongoDbID(brandID);
  if (!updateBrand)
    throw new ServiceAPIError (
      `The Category ${brandID} was not found to be updated`
    );
  return updateBrand;
};

export const deleteBrandService = async (brandID: string) => {
  const brandd = await BrandModel.findOneAndDelete({
    _id: brandID,
  });
  validateMongoDbID(brandID);
  if (!brandd)
    throw new ServiceAPIError (
      `The Category with the id: ${brandID} was not found to be deleted`
    );
  return brandd;
};

export const getBrandService = async (brand: string) => {
  const brandExists = await BrandModel.findById({ _id: brand });
  validateMongoDbID(brand);
  if (!brandExists)
    throw new ServiceAPIError (
      `The Product with the id: ${brand} does not exist`
    );
  return brandExists;
};

export const getAllBrandService = async (): Promise<BrandInterface[]> => {
  const getAllBrands = await BrandModel.find();
  if (getAllBrands.length <= 0) {
    throw new ServiceAPIError (`No category found`);
  }
  return getAllBrands;
};
