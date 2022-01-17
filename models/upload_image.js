/* eslint-disable valid-jsdoc */
import multer from "multer";


const fileStorageEngine = multer.memoryStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

export const uploadImage = multer({ storage: fileStorageEngine });
