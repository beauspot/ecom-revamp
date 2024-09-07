import { v2 as cloudinary} from "cloudinary";

import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET_KEY,
});


export const cloudinaryUpload = async (
  fileToupload: string
): Promise<{ url: string; resource_type: string }> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(fileToupload, (error, results) => {
      if (error) {
        reject(error);
      } else if (results) {
        resolve({
          url: results.secure_url,
          resource_type: "auto",
        });
      } else {
        reject(new Error("Cloudinary upload results are undefined"));
      }
    });
  });
};
