import { Service, Inject } from "typedi";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";

import ProductCategoryModel from "@/models/Prod_categoryModels";
import { ServiceAPIError } from "@/helpers/utils/custom-errors";
import { ProductCategoryInterface } from "@/interfaces/prod_category_interface";


@Service()
export class ProductCategoryService {
  constructor(@Inject(() => ProductCategoryModel) private productCatModel: typeof ProductCategoryModel){};

  createCategoryService = async (
   category: ProductCategoryInterface
 ) => {
   const newCategory = await this.productCatModel.create({ ...category });
   if (!newCategory) {
     throw new ServiceAPIError (
       "Could not create Category"
     );
   }
   return newCategory;
 };


 updateCategoryService = async (
  categoryID: string,
  updateCategoryData: Partial<ProductCategoryInterface>
 ) => {
  const updateCategory = await this.productCatModel.findByIdAndUpdate(
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
  
 deleteCategoryService = async (categoryID: string) => {
  const category = await this.productCatModel.findOneAndDelete({
    _id: categoryID,
  });
  validateMongoDbID(categoryID);
  if (!category)
    throw new ServiceAPIError (
      `The Category with the id: ${categoryID} was not found to be deleted`
    );
  return category;
 };

 getCategoryService = async (category: string) => {
  const categoryExists = await this.productCatModel.findById({ _id: category });
  validateMongoDbID(category);
  if (!categoryExists)
    throw new ServiceAPIError (
      `The Product with the id: ${category} does not exist`
    );
  return categoryExists;
 };

 getAllCategoryService = async (): Promise<
  ProductCategoryInterface[]
 > => {
  const getAllCategories = await this.productCatModel.find();

  if (getAllCategories.length <= 0) {
    throw new ServiceAPIError (`No Product category found`);
  };
  
  return getAllCategories;
 };
};