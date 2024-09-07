import { Document, Types } from "mongoose";
import { SortByOptions } from "@/types/sortOptions";

// Defining the interface for the rating object
interface Rating {
  star: number;
  postedBy: Types.ObjectId;
}

export interface ProductDataInterface extends Document {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  sold: number;
  quantity: number;
  images: string[];
  color: string;
  ratings: Rating[]; // Ratings array with the Rating interface
  totalrating:  number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetAllProductsOptions {
  sortBy: string | "createdAt" | "title" | "price";
  sortOrder: "asc" | "desc";
  limit: number;
  page: number;
  category: string;
  brand: string;
}

export interface GetAllProductsQueryParams {
  sortBy?: SortByOptions;
  sortOrder?: "asc" | "desc";
  limit?: number;
  page?: number;
  category?: string;
  brand?: string;
}

export interface ProductInterface extends ProductDataInterface {
  count: number;
}