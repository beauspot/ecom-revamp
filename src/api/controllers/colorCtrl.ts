import { Service, Inject } from "typedi";

import { ProductColorService } from "@/services/color.service";
import { Request, Response } from "express";
import { IColor } from "@/interfaces/colorInterface";
import { StatusCodes } from "http-status-codes";

@Service()
export class ProductColorController {
  constructor(@Inject() private productcolor: ProductColorService) {}

  async createColor(req: Request, res: Response): Promise<void> {
    try {
      const colorData: IColor = req.body;
      const newColor = await this.productcolor.createColor(colorData);
      res.status(StatusCodes.CREATED).json({ color: newColor });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async getAllColors(req: Request, res: Response): Promise<void> {
    try {
      const colors = await this.productcolor.getAllColors();
      res.status(StatusCodes.OK).json({ colorData: colors });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async getColorByID(req: Request, res: Response): Promise<void> {
    try {
      const colorID = req.params.id;
      const color = await this.productcolor.getColorId(colorID);
      if (color) res.status(StatusCodes.OK).json({ color_data: color });
      else res.status(StatusCodes.NOT_FOUND).json({ error: "Color not found" });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async updateColor(req: Request, res: Response): Promise<void> {
    try {
      const colorID = req.params.id;
      const updatedData: IColor = req.body;
      const updatedColor = await this.productcolor.updateColor(
        colorID,
        updatedData
      );
      if (updatedColor) res.status(StatusCodes.OK).json({ data: updatedColor });
      else res.status(StatusCodes.NOT_FOUND).json({ error: "Color not found" });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }

  async deleteColor(req: Request, res: Response): Promise<void> {
    try {
      const colorID = req.params.id;
      await this.productcolor.deleteColor(colorID);
      res
        .status(StatusCodes.OK)
        .json({ message: "Color Successfully deleted" });
    } catch (error: any) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message });
    }
  }
}
