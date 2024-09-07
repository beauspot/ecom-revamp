import { EnquiryDataModel } from "@/models/enqModel";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { IEnquiry } from "@/interfaces/enquiryInterface";

export class EnquiryService {
  public static async createEnquiry(enqData: IEnquiry): Promise<IEnquiry> {
    try {
      const newEnquiry = await EnquiryDataModel.create(enqData);
      if (!newEnquiry)
        throw new Error(`The enquiry ${newEnquiry} already exists`);
      return newEnquiry;
    } catch (error) {
      throw new Error("Error creating enquiry");
    }
  }

  public static async getAllEnq(): Promise<IEnquiry[]> {
    try {
      const enquiry = await EnquiryDataModel.find();
      if (enquiry.length <= 0)
        throw new Error("There are no enquieries available");
      return enquiry;
    } catch (error) {
      throw new Error("Error getting colors");
    }
  }

  public static async updateEnquiry(
    enqID: string,
    updatedData: IEnquiry
  ): Promise<IEnquiry | null> {
    try {
      validateMongoDbID(enqID);
      const enqData = await EnquiryDataModel.findByIdAndUpdate(
        enqID,
        updatedData,
        { new: true }
      );
      return enqData;
    } catch (error) {
      throw new Error("Error updating Enquiry");
    }
  }

  public static async getEnqId(enqID: string): Promise<IEnquiry | null> {
    try {
      validateMongoDbID(enqID);
      const enq = await EnquiryDataModel.findById(enqID);
      if (!enq)
        throw new Error(`The Enquiry with the ID ${enqID} doesn't exist`);
      return enq;
    } catch (error) {
      throw new Error("Error getting enquiry");
    }
  }

  public static async deleteEnq(enqID: string): Promise<void> {
    try {
      validateMongoDbID(enqID);
      const deleteEnquiry = await EnquiryDataModel.findByIdAndDelete(enqID);
      if (!deleteEnquiry)
        throw new Error(
          `Couldn't find the enquiry with ID of ${enqID} to delete`
        );
    } catch (error) {
      throw new Error("Error deleting the enquiry");
    }
  }
}
