import multer from "multer";
import sharp from "sharp";
import path from "path";
import { Request, Response, NextFunction } from "express";
import fs from "fs";

// Setting up the multer Storage
const multerStorage = multer.diskStorage({
  destination: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: function (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + ".jpeg");
  },
});

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const productImageResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Use type assertion to convert req.files to Express.Multer.File[]
  const files = req.files as unknown as Express.Multer.File[];

  if (!files) return next();

  await Promise.all(
    files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(
          path.join(__dirname, `../public/images/products/${file.filename}`)
        );
      fs.unlinkSync(
        path.join(__dirname, `../public/images/products/${file.filename}`)
      );
    })
  );

  next();
};

export const blogImageResize = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Use type assertion to convert req.files to Express.Multer.File[]
  const files = req.files as unknown as Express.Multer.File[];

  if (!files) return next();

  await Promise.all(
    files.map(async (file) => {
      await sharp(file.path)
        .resize(300, 300)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(
          path.join(__dirname, `../public/images/blogs/${file.filename}`)
        );
      fs.unlinkSync(
        path.join(__dirname, `../public/images/blogs/${file.filename}`)
      );
    })
  );

  next();
};

// Setting up multer
export const uploadPhoto = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fieldSize: 2000000 },
});
