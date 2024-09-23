import { Expose, Exclude } from "class-transformer";

export class BlogsDTO {
  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  category: string;

  @Exclude()
  numViews: number;

  @Expose()
  isLiked: boolean;

  @Expose()
  isDisLiked: boolean;

  @Expose()
  likes: string[];

  @Expose()
  dislikes: string[];

  @Expose()
  image: string;

  @Expose()
  author: "admin";

  @Exclude()
  _id: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  __v: number;

  @Exclude()
  id: string;
};

export class BlogCategoryDTO {
  @Expose()
  title: string;

  @Exclude()
  _id: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;

  @Exclude()
  __v: number;
}