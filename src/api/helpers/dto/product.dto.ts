import { Exclude, Expose } from "class-transformer";

export class ProductDTO {
    @Exclude()
    _id: string;

    @Expose()
    title: string;

    @Exclude()
    slug: string;

    @Expose()
    description: string;

    @Expose()
    category: string;

    @Expose()
    brand: string;

    @Expose()
    images: string[];

    @Expose()
    color: string;

    @Expose()
    totalrating: number;

    @Expose()
    ratings: number[];

    @Exclude()
    _: number;

    @Expose()
    price: number;

    @Expose()
    sold: number;
};

export class ProductCategoryDTO {
@Expose()
title: string;

@Exclude()
_id: string;

@Expose()
createdAt: Date;

@Expose()
updatedAt: Date;

@Exclude()
 __v: number;
};