import {Service, Inject} from "typedi";

import { ColorDataModel } from "@/models/colorModel";
import { IColor } from "@/interfaces/colorInterface";
import { ServiceAPIError } from "@/utils/custom-errors";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";

@Service()
export class ProductColorService {

  constructor(@Inject(() => ColorDataModel) private colordata: typeof ColorDataModel){};

  async createColor(colorData: IColor): Promise<IColor> {
    try {
      const newColor = await this.colordata.create(colorData);
      if (!newColor) throw new ServiceAPIError(`The Color ${newColor} already exists.`);
      return newColor;
    } catch (error:any) {
      throw new ServiceAPIError(error.message);
    }
  }

  async getAllColors(): Promise<IColor[]> {
    try {
      const colors = await this.colordata.find();
      if (colors.length <= 0) throw new ServiceAPIError("There are no colors available");

      return colors;
    } catch (error:any) {
      throw new ServiceAPIError(error.message);
    }
  }

  async updateColor(
    colorId: string,
    updatedData: IColor
  ): Promise<IColor | null> {
    try {
      validateMongoDbID(colorId);
      const updatedColor = await this.colordata.findByIdAndUpdate(
        colorId,
        updatedData,
        { new: true }
      );
      return updatedColor;
    } catch (error:any) {
      throw new ServiceAPIError(error.message);
    }
  }

 async getColorId(colorId: string): Promise<IColor | null> {
    try {
      validateMongoDbID(colorId);
      const color = await this.colordata.findById(colorId);
      if (!color)
        throw new ServiceAPIError("The Color with the ID " + colorId + "doesn't exist");
      return color;
    } catch (error:any) {
      throw new ServiceAPIError(error.message);
    }
  }

  async deleteColor(colorID: string): Promise<void> {
    try {
      validateMongoDbID(colorID);
      const deleteColor = await this.colordata.findByIdAndDelete(colorID);
      if (!deleteColor)
        throw new ServiceAPIError(
          `Couldn't find color with the ID of ${colorID} to delete`
        );
    } catch (error:any) {
      throw new ServiceAPIError(error.message);
    }
  }
};
