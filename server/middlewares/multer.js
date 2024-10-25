import multer from "multer";
const multerUpload = multer({
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
});

export const singleAvatar = multerUpload.single("avatar");
export const attachment = multerUpload.array("files", 5);
