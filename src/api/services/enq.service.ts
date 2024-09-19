import { Inject, Service } from "typedi";

import { ServiceAPIError } from "@/utils/custom-errors";
import { EnquiryDataModel } from "@/models/enqModel";
import { validateMongoDbID } from "@/helpers/utils/validateDbId";
import { IEnquiry } from "@/interfaces/enquiryInterface";

@Service()
export class EnquiryService {
  constructor(
    @Inject(() => EnquiryDataModel)
    private enquirymodel: typeof EnquiryDataModel
  ) {}

  async createEnquiry(enqData: IEnquiry): Promise<IEnquiry> {
    try {
      const newEnquiry = await this.enquirymodel.create(enqData);
      if (!newEnquiry)
        throw new ServiceAPIError(`The enquiry ${newEnquiry} already exists`);
      return newEnquiry;
    } catch (error: any) {
      throw new ServiceAPIError(error.message);
    }
  }

  async getAllEnq(): Promise<IEnquiry[]> {
    try {
      const enquiry = await this.enquirymodel.find();
      if (enquiry.length <= 0)
        throw new ServiceAPIError("There are no enquieries available");
      return enquiry;
    } catch (error: any) {
      throw new ServiceAPIError(error.message);
    }
  }

  async updateEnquiry(
    enqID: string,
    updatedData: IEnquiry
  ): Promise<IEnquiry | null> {
    try {
      validateMongoDbID(enqID);
      const enqData = await this.enquirymodel.findByIdAndUpdate(
        enqID,
        updatedData,
        { new: true }
      );
      return enqData;
    } catch (error: any) {
      throw new ServiceAPIError(error.message);
    }
  }

  async getEnqId(enqID: string): Promise<IEnquiry | null> {
    try {
      validateMongoDbID(enqID);
      const enq = await this.enquirymodel.findById(enqID);
      if (!enq)
        throw new ServiceAPIError(
          `The Enquiry with the ID ${enqID} doesn't exist`
        );
      return enq;
    } catch (error: any) {
      throw new ServiceAPIError(error.message);
    }
  }

  async deleteEnq(enqID: string): Promise<void> {
    try {
      validateMongoDbID(enqID);
      const deleteEnquiry = this.enquirymodel.findByIdAndDelete(enqID);
      if (!deleteEnquiry)
        throw new ServiceAPIError(
          `Couldn't find the enquiry with ID of ${enqID} to delete`
        );
    } catch (error: any) {
      throw new ServiceAPIError(error.message);
    }
  }
}
