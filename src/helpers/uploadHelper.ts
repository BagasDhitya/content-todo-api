import multer, { FileFilterCallback } from "multer";
import path from "path";

const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  fileFilter: (req, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();

    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      return cb(new Error("Only JPG and PNG files are allowed"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB
  },
});
