const multer = require("multer");


const storage = multer.diskStorage({
  filename: function (_res, file, cb) {
    const ext = file.originalname.split(".").pop(); // pdf / jpeg / mp3
    const fileName = Date.now(); // 12312321321
    cb(null, `${fileName}.${ext}`); // 123123213232.pdf
  },
  destination: function (_res, _file, cb) {
    cb(null, `./public`);
  },
});

const maxSize=2*1024*1024;
const upload = multer({ storage ,
  fileFilter: function (_req, file, cb) {

             var filetypes = /docx|doc|pdf/;
             var mimetype = filetypes.test(file.mimetype);
             var extname = filetypes.test(file.originalname.split(".").pop());
             if (mimetype && extname) {
                 return cb(null, true);
             }
             cb(new Error("Error: File upload only supports the following filetypes - " + filetypes));
         },
   limits: { fileSize: maxSize }});

module.exports = { upload }
