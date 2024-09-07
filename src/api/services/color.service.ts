import { ColorDataModel } from "@/models/colorModel";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { IColor } from "@/interfaces/colorInterface";

export class ProductColorService {
  public static async createColor(colorData: IColor): Promise<IColor> {
    try {
      const newColor = await ColorDataModel.create(colorData);
      if (!newColor) throw new Error(`The Color ${newColor} already exists.`);
      return newColor;
    } catch (error) {
      throw new Error("Error creating color");
    }
  }

  public static async getAllColors(): Promise<IColor[]> {
    try {
      const colors = await ColorDataModel.find();
      if (colors.length <= 0) throw new Error("There are no colors available");

      return colors;
    } catch (error) {
      throw new Error("Error getting colors");
    }
  }

  public static async updateColor(
    colorId: string,
    updatedData: IColor
  ): Promise<IColor | null> {
    try {
      validateMongoDbID(colorId);
      const updatedColor = await ColorDataModel.findByIdAndUpdate(
        colorId,
        updatedData,
        { new: true }
      );
      return updatedColor;
    } catch (error) {
      throw new Error("Error updating color");
    }
  }

  public static async getColorId(colorId: string): Promise<IColor | null> {
    try {
      validateMongoDbID(colorId);
      const color = await ColorDataModel.findById(colorId);
      if (!color)
        throw new Error("The Color with the ID " + colorId + "doesn't exist");
      return color;
    } catch (error) {
      throw new Error("Error getting color by ID");
    }
  }

  public static async deleteColor(colorID: string): Promise<void> {
    try {
      validateMongoDbID(colorID);
      const deleteColor = await ColorDataModel.findByIdAndDelete(colorID);
      if (!deleteColor)
        throw new Error(
          `Couldn't find color with the ID of ${colorID} to delete`
        );
    } catch (error) {
      throw new Error("Error deleting color");
    }
  }
}
