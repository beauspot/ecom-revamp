import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { EnquiryService } from "@/services/enq.service";
import { IEnquiry } from "@/interfaces/enquiryInterface";

export class EnquiryController {
  public static createEnq = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const enqData: IEnquiry = req.body;
      const newEnq = await EnquiryService.createEnquiry(enqData);
      res.status(StatusCodes.CREATED).json({ enq_data: newEnq });
    }
  );

  public static getAllEnquiries = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const allEnq = await EnquiryService.getAllEnq();
      res.status(StatusCodes.OK).json({ enq_data: allEnq });
    }
  );

  public static getEnqByID = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const enqID = req.params.id;
      const enq = await EnquiryService.getEnqId(enqID);
      if (enq) res.status(StatusCodes.OK).json({ enquiry_data: enq });
      else
        res.status(StatusCodes.NOT_FOUND).json({ error: "Enquiry not found" });
    }
  );

  public static updateEnq = asyncHandler(
    async (req: Request, res: Response) => {
      const enqID = req.params.id;
      const updatedData: IEnquiry = req.body;
      const enq = await EnquiryService.updateEnquiry(enqID, updatedData);
      if (updatedData) res.status(StatusCodes.OK).json({ data: updatedData });
      else
        res
          .status(StatusCodes.NOT_FOUND)
          .json({ error: "Enquiry not found to be updated" });
    }
  );

  public static deleteEnqData = asyncHandler(
    async (req: Request, res: Response) => {
      const enqID = req.params.id;
      await EnquiryService.deleteEnq(enqID);
      res
        .status(StatusCodes.OK)
        .json({ message: "Enquiry deleted successfully" });
    }
  );
}
