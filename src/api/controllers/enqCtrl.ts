import {Inject, Service} from "typedi";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";


import { EnquiryService } from "@/services/enq.service";
import { IEnquiry } from "@/interfaces/enquiryInterface";

@Service()
export class EnquiryController {

  constructor(@Inject() private enquiryservice:EnquiryService){};

 createEnq = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const enqData: IEnquiry = req.body;
      const newEnq = await this.enquiryservice.createEnquiry(enqData);
      res.status(StatusCodes.CREATED).json({ enq_data: newEnq });
    }
  );

getAllEnquiries = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allEnq = await this.enquiryservice.getAllEnq();
      res.status(StatusCodes.OK).json({ enq_data: allEnq });
    }
  );

  getEnqByID = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const enqID = req.params.id;
      const enq = await this.enquiryservice.getEnqId(enqID);

      if (enq) res.status(StatusCodes.OK).json({ enquiry_data: enq });
      else
        res.status(StatusCodes.NOT_FOUND).json({ error: "Enquiry not found" });
    }
  );

  updateEnq = asyncHandler(
    async (req: Request, res: Response) => {
      const enqID = req.params.id;
      const updatedData: IEnquiry = req.body;

      const enq = await this.enquiryservice.updateEnquiry(enqID, updatedData);

      if (updatedData) res.status(StatusCodes.OK).json({ data: updatedData });
      else
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Enquiry not found to be updated" });
    }
  );

  deleteEnqData = asyncHandler(
    async (req: Request, res: Response) => {
      const enqID = req.params.id;

      await this.enquiryservice.deleteEnq(enqID);
      res
        .status(StatusCodes.OK)
        .json({ message: "Enquiry deleted successfully" });
    }
  );
}
