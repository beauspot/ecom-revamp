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
