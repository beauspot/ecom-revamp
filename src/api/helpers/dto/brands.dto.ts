import { Expose, Exclude } from "class-transformer";

export class BrandsDTO {
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