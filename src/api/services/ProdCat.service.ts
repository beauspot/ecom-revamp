import { StatusCodes } from "http-status-codes";
import ProductCategoryModel from "@/models/Prod_categoryModels";
import {ServiceAPIError } from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { ProductCategoryInterface } from "@/interfaces/prod_category_interface";

export const createCategoryService = async (
  category: ProductCategoryInterface
) => {
  const newCategory = await ProductCategoryModel.create({ ...category });
  if (!newCategory) {
    throw new ServiceAPIError (
      "Could not create Category"
    );
  }
  return newCategory;
};

export const updateCategoryService = async (
  categoryID: string,
  updateCategoryData: Partial<ProductCategoryInterface>
) => {
  const updateCategory = await ProductCategoryModel.findByIdAndUpdate(
    { _id: categoryID },
    updateCategoryData,
    {
      new: true,
      runValidators: true,
    }
  );
  validateMongoDbID(categoryID);
  if (!updateCategory)
    throw new ServiceAPIError (
      `The Category ${categoryID} was not found to be updated`
    );
  return updateCategory;
};

export const deleteCategoryService = async (categoryID: string) => {
  const category = await ProductCategoryModel.findOneAndDelete({
    _id: categoryID,
  });
  validateMongoDbID(categoryID);
  if (!category)
    throw new ServiceAPIError (
      `The Category with the id: ${categoryID} was not found to be deleted`
    );
  return category;
};

export const getCategoryService = async (category: string) => {
  const categoryExists = await ProductCategoryModel.findById({ _id: category });
  validateMongoDbID(category);
  if (!categoryExists)
    throw new ServiceAPIError (
      `The Product with the id: ${category} does not exist`
    );
  return categoryExists;
};

export const getAllCategoryService = async (): Promise<
  ProductCategoryInterface[]
> => {
  const getAllCategories = await ProductCategoryModel.find();
  if (getAllCategories.length <= 0) {
    throw new ServiceAPIError (`No category found`);
  }
  return getAllCategories;
};
