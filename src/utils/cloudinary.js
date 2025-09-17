import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

//dotenv
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const cloudinaryImageUpload = async (fileBuffer, public_id, folder) => {
  const streamUpload = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: folder,
              public_id: public_id,
              resource_type: "image",
              overwrite: true,
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

  const result = await streamUpload(fileBuffer);
  return result;
}

export default cloudinary;
