import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const filesPath = path.join(__dirname, '../../temp/');
    fs.mkdir(filesPath, { recursive: true }, (err) => {
      cb(null, filesPath)
    })
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  },

})

export const upload = multer(
  {
    storage,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  })