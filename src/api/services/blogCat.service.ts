import {Service, Inject} from "typedi";
import BlogCategoryModel from "@/models/Blog_categoryModels";
import {ServiceAPIError}  from "@/helpers/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { BlogCategoryInterface } from "@/interfaces/blog_category_interface ";

@Service()
export class BlogCatService {

  constructor(@Inject(() => BlogCategoryModel) private blogcategory : typeof BlogCategoryModel) {};

  createCategoryService = async (
    category: BlogCategoryInterface
  ) => {
    const newCategory = await this.blogcategory.create({ ...category });
    if (!newCategory) {
      throw new ServiceAPIError (
        "Could not create Category",
        
      );
    }
    return newCategory;
  };
  
   updateCategoryService = async (
    categoryID: string,
    updateCategoryData: Partial<BlogCategoryInterface>
  ) => {
    const updateCategory = await this.blogcategory.findByIdAndUpdate(
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
    const category = await this.blogcategory.findOneAndDelete({
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
    const categoryExists = await this.blogcategory.findById({ _id: category });
    validateMongoDbID(category);
    if (!categoryExists)
      throw new ServiceAPIError (
        `The Product with the id: ${category} does not exist`
      );
    return categoryExists;
  };
  
   getAllCategoryService = async (): Promise<
    BlogCategoryInterface[]
  > => {
    const getAllCategories = await this.blogcategory.find();
    if (getAllCategories.length <= 0) {
      throw new ServiceAPIError (`No category found`);
    }
    return getAllCategories;
  };
  
};

 