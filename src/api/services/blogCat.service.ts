import { StatusCodes } from "http-status-codes";
import BlogCategoryModel from "@/models/Blog_categoryModels";
import CustomAPIError from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { BlogCategoryInterface } from "@/interfaces/blog_category_interface ";

export const createCategoryService = async (
  category: BlogCategoryInterface
) => {
  const newCategory = await BlogCategoryModel.create({ ...category });
  if (!newCategory) {
    throw new CustomAPIError(
      "Could not create Category",
      StatusCodes.BAD_REQUEST
    );
  }
  return newCategory;
};

export const updateCategoryService = async (
  categoryID: string,
  updateCategoryData: Partial<BlogCategoryInterface>
) => {
  const updateCategory = await BlogCategoryModel.findByIdAndUpdate(
    { _id: categoryID },
    updateCategoryData,
    {
      new: true,
      runValidators: true,
    }
  );
  validateMongoDbID(categoryID);
  if (!updateCategory)
    throw new CustomAPIError(
      `The Category ${categoryID} was not found to be updated`,
      StatusCodes.NOT_FOUND
    );
  return updateCategory;
};

export const deleteCategoryService = async (categoryID: string) => {
  const category = await BlogCategoryModel.findOneAndDelete({
    _id: categoryID,
  });
  validateMongoDbID(categoryID);
  if (!category)
    throw new CustomAPIError(
      `The Category with the id: ${categoryID} was not found to be deleted`,
      StatusCodes.BAD_REQUEST
    );
  return category;
};

export const getCategoryService = async (category: string) => {
  const categoryExists = await BlogCategoryModel.findById({ _id: category });
  validateMongoDbID(category);
  if (!categoryExists)
    throw new CustomAPIError(
      `The Product with the id: ${category} does not exist`,
      StatusCodes.NOT_FOUND
    );
  return categoryExists;
};

export const getAllCategoryService = async (): Promise<
  BlogCategoryInterface[]
> => {
  const getAllCategories = await BlogCategoryModel.find();
  if (getAllCategories.length <= 0) {
    throw new CustomAPIError(`No category found`, StatusCodes.NO_CONTENT);
  }
  return getAllCategories;
};
