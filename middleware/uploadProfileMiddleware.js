import express from 'express';
import multer from 'multer';
import fs from 'fs-extra';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = `../public/uploads/`;
    fs.access(dest, function (error) {
      if (error) {
        console.log('Directory does not exist.');
        return fs.mkdir(dest, { recursive: true }, (error) => cb(error, dest));
      } else {
        return cb(null, dest);
      }
    });
  },
  filename: function (req, file, cb) {
    cb(null, `${file.originalname.toLowerCase()}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: '2mb',
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  },
});

export default upload.single('accountProfile');
