const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
// const upload = multer({dest: 'uploads/'});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_scret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "upload",
    format: async (req, file) => "png",
    // public_id: (req, file) => "computed-filename-using-request",
  },
  // folder: 'uploads',
  // format: ['jpeg', 'png'],
  // public_id: 'computed-filename-using-request'
  // // transformation: [{ width: 500, height: 500, crop: 'limit' }]
});
// const parser = multer({ storage });

const multerUploads = multer({ storage: storage });

module.exports = multerUploads;
