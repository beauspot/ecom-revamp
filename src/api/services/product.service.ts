import fs from "fs";
import { Service, Inject } from "typedi";
import { UploadedFile } from "express-fileupload";

import logger from "@/utils/logger";
import { productModel } from "@/models/productsModels";
import { FileWithNewPath } from "@/interfaces/filePath";
import { Paginated } from "@/interfaces/paginatedInterface";
import { cloudinaryUpload } from "@/config/cloudinaryconfig";
import {ServiceAPIError}  from "@/helpers/utils/custom-errors";
import { ProductDataInterface, GetAllProductsOptions } from "@/interfaces/product_Interface";


@Service()
export class ProductService {
  
  constructor(@Inject(() => productModel) private product: typeof productModel) { }
  
  //Create a Product Service
  createProductService = async (product: ProductDataInterface) => {
  const newProduct = await this.product.create({ ...product });
  if (!newProduct) 
    throw new ServiceAPIError (
      "Product creation failed"
    );
  return newProduct;
  };
  
  // Fetch All Products Services
getAllProductsService = async (
  options: GetAllProductsOptions
): Promise<Paginated<ProductDataInterface>> => {
  // Sorting, limiting and pagination of the Products
  const { sortBy, sortOrder, limit, page, category, brand } = options;
  const skip = (page - 1) * limit;

  const sortCriteria: any = {};
  sortCriteria[sortBy] = sortOrder === "asc" ? 1 : -1;

  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = brand;
  }

  const allProducts = await this.product
    .find(query)
    .sort(sortCriteria)
    .skip(skip)
    .limit(limit)
    .exec();

  if (allProducts.length <= 0) {
    throw new ServiceAPIError ("No products found");
  }
  const productsCount: number = await this.product.find(query).count();

  return {
    page: allProducts,
    currentPage: page,
    totalPages: Math.ceil(productsCount / limit),
    total: productsCount,
  };
};

  // Get a single product by its ID Service
  getSingleProductService = async (productID: string) => {
  const productExists = await this.product.findById({ _id: productID });
  // console.log(productExists);
  if (!productExists) {
    throw new ServiceAPIError (
      `the product with the id ${productID} does not exist`
    );
  }
  return productExists;
};

// updating a product Service
updateProductService = async (
  prodId: string,
  updateData: Partial<ProductDataInterface>
) => {
  // const { _id } = prodId;
  const updateProduct = await this.product.findByIdAndUpdate(
    { _id: prodId },
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );
  // console.log(prodId);
  if (!updateProduct)
    throw new ServiceAPIError (
      `The Product with the id: ${prodId} was not found to be updated.`
    );
  return updateProduct;
};

  // Deleting a product Service
  deleteProductService = async (prodID: string) => {
  const product = await this.product.findOneAndDelete({ _id: prodID });
  // console.log(product);
  if (!product)
    throw new ServiceAPIError (
      `The Product with the id: ${prodID} was not found to be deleted`
    );
  return product;
  };
  
  rateProductService = async (
    userID: string,
    prodID: string,
    star: number,
    comment: string
  ) => {
    try {
      const product = await this.product.findById(prodID);
      if (!product) {
        throw new ServiceAPIError (`Product not found`);
      }
      let alreadyRated = product.ratings.find(
        (rating) => rating.postedBy.toString() === userID
      );
      if (alreadyRated) {
        await this.product.updateOne(
          {
            "ratings.postedBy": userID,
          },
          {
            $set: { "ratings.$.star": star, "ratings.$.comment": comment },
          }
        );
      } else {
        await this.product.findByIdAndUpdate(prodID, {
          $push: {
            ratings: {
              star: star,
              comment: comment,
              postedBy: userID,
            },
          },
        });
      }
      const getAllRatings = await this.product.findById(prodID);
      if (!getAllRatings) {
        throw new ServiceAPIError (`Ratings not found`);
      }
      let totalRating = getAllRatings.ratings.length;
      let ratingsum =
        totalRating === 0
          ? 0
          : getAllRatings.ratings
              .map((item) => item.star)
              .reduce((prev, curr) => prev + curr, 0);
      let actualRating =
        totalRating === 0 ? 0 : Math.round(ratingsum / totalRating);
  
      const finalproduct = await this.product.findByIdAndUpdate(
        prodID,
        {
          totalrating: actualRating,
        },
        { new: true }
      );
      return finalproduct;
    } catch (err: any) {
      throw new ServiceAPIError(err.message);
    }
  };

  uploadImageService = async (
  id: string,
  files: Record<string, UploadedFile | UploadedFile[]>
): Promise<any> => {
  try {
    const uploader = async (path: string): Promise<FileWithNewPath> => {
      logger.info(`Uploading file from path: ${path}`);
      const result = await cloudinaryUpload(path);
      logger.info(`File uploaded successfully: ${result.url}`);
      return { path, url: result.url };
    };
    const urls: string[] = [];

    const fileArray = Array.isArray(files) ? files : [files];

    for (const file of fileArray) {
      if (file && file.path) {
        // Check if file and path are defined
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath.url);
        fs.unlinkSync(path);
      }
    }
    const findproduct = await this.product.findByIdAndUpdate(
      id,
      {
        images: urls.map((file) => {
          return file;
        }),
      },
      {
        new: true,
      }
    );
    return findproduct;
  } catch (error: any) {
    console.error(error);
    throw new ServiceAPIError(error.message);
  }
};

};