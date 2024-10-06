import slugify from "slugify";
import * as dotenv from "dotenv";
import { Service, Inject } from "typedi";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import { UploadedFile } from "express-fileupload";
import { plainToInstance } from "class-transformer";

// import { createClient } from "redis";
import logger from "@/utils/logger";
import { ProductDTO } from "@/dto/product.dto";
import { ProductService } from "@/services/product.service";
import { CustomAPIError } from "@/utils/custom-errors";
import {
  GetAllProductsOptions,
  GetAllProductsQueryParams,
} from "@/interfaces/product_Interface";
import { AuthenticatedRequest } from "@/interfaces/authenticateRequest";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import runRedisOperation from "@/config/redis.config";

dotenv.config();

@Service()
export class ProductController {
  constructor(
    @Inject(() => ProductService) private productService: ProductService
  ) {}
  redis = runRedisOperation();

  // create a new product controller
  create_product = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }

      // calling the createProduct controller
      const newProduct = await this.productService.createProductService(
        req.body
      );
      //console.log(newProduct);

      const transformedProducts = plainToInstance(ProductDTO, newProduct, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      res.status(StatusCodes.CREATED).json(transformedProducts);
    }
  );

  // get all products controller
  get_all_products = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { sortBy, sortOrder, limit, page, category, brand } =
        req.query as GetAllProductsQueryParams;

      const filterOpt: GetAllProductsOptions = {
        sortBy: sortBy || "createdAt", // Default sort order
        sortOrder: sortOrder === "desc" ? "desc" : "asc",
        limit: limit ? parseInt(limit.toString(), 10) : 10,
        page: page ? parseInt(page.toString(), 10) : 1,
        category: category || "",
        brand: brand || "",
      };

      // Generate a unique key based on filter options
      const key = JSON.stringify(filterOpt);
      const redisClient = await runRedisOperation();

      if (redisClient) {
        const cachedValue = await redisClient.get(key);

        if (cachedValue) {
          const parsedValue = JSON.parse(cachedValue);
          res.status(StatusCodes.OK).json(parsedValue);
          return;
        }
      } else {
        logger.warn("Redis Client is null skipping cache.");
      }

      // if (cachedValue) {
      //   const parsedValue = JSON.parse(cachedValue);
      //   res.status(StatusCodes.OK).json(parsedValue);
      //   // return Promise.resolve(parsedValue);
      //   return;
      // }

      const paginatedProducts = await this.productService.getAllProductsService(
        filterOpt
      );

      const transformedProducts = plainToInstance(
        ProductDTO,
        paginatedProducts.page,
        {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        }
      );

      const response = {
        ...paginatedProducts,
        page: transformedProducts,
      };

      if (redisClient) {
        const value = JSON.stringify(response);

        redisClient.setEx(key, 3600, value);
      }

      res.status(StatusCodes.OK).json(response);
    }
  );

  // getting a single product
  getASingleProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;

      validateMongoDbID(id);
      //console.log(id);
      const productDataID = await this.productService.getSingleProductService(
        id
      );

      const transformedProducts = plainToInstance(ProductDTO, productDataID, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      res.status(StatusCodes.OK).json({ product: transformedProducts });
    }
  );

  // update a single product controller
  updateSingleProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      if (req.body.title) req.body.slug = slugify(req.body.title);

      const { id } = req.params;
      validateMongoDbID(id);
      // console.log(id);
      const updateProduct = await this.productService.updateProductService(
        id,
        req.body
      );

      const transformedProducts = plainToInstance(ProductDTO, updateProduct, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      res
        .status(StatusCodes.OK)
        .json({ status: "Successfully updated product", transformedProducts });
    }
  );

  // Deleting a product controller action
  deleteProduct = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const { id } = req.params;
      validateMongoDbID(id);
      const productDataID = await this.productService.deleteProductService(id);
      res.status(StatusCodes.OK).json({
        status: "Deleted product Successfully",
        productDataID: productDataID,
      });
    }
  );

  rateProduct = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req?.user?.id;
    if (userId) {
      const { star, prodId, comment } = req.body;

      try {
        const finalProduct = await this.productService.rateProductService(
          userId,
          prodId,
          star,
          comment
        );

        const transformedProduct = plainToInstance(ProductDTO, finalProduct, {
          excludeExtraneousValues: true,
          exposeUnsetFields: false,
        });
        res.json(transformedProduct);
      } catch (error: any) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error.message);
      }
    } else {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ error: "User not authenticated" });
    }
  };

  uploadImageCtrl = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    validateMongoDbID(id);
    const files = req.files as Record<string, UploadedFile | UploadedFile[]>;

    console.log(files);

    try {
      const findProduct = await this.productService.uploadImageService(
        id,
        files
      );

      const transformedProduct = plainToInstance(ProductDTO, findProduct, {
        excludeExtraneousValues: true,
        exposeUnsetFields: false,
      });

      res.status(StatusCodes.OK).json(transformedProduct);
    } catch (error: any) {
      throw new CustomAPIError(
        error.message,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  });
}
