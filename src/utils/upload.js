const path = require("path");
const httpStatus = require("http-status");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const { v4: uuid } = require("uuid");
const { mimeToExt, isAllowedMime } = require("./mime");
const ApiError = require("./ApiError");
const { errorData } = require("./errorData");
const config = require("../config/config");

const { accessKeyId, secretAccessKey, region, bucket } = config.s3;

const autoContentType = (req, file, cb) => {
  if (
    file.mimetype !==
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    multerS3.AUTO_CONTENT_TYPE(req, file, cb);
  }
  cb(null);
};

const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey,
  region,
});

const requestFileToBody = (req, _, next) => {
  Object.keys(req.files).map((key) => {
    req.body[key] =
      req.files[key].length === 1
        ? req.files[key][0].path
        : req.files[key].map((file) => file.path);
    return req.body[key];
  });
  next();
};

const uploadLocal = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (req.locals == null) {
        req.locals = {};
      }
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      cb(null, `./uploads`);
    },
    // convert a file name
    filename: (req, file, cb) => {
      const fileName = uuid() + path.extname(file.originalname);
      req.locals.fileName = fileName;
      cb(null, fileName);
    },
  }),
});

const uploadAsPublic = multer({
  storage: multerS3({
    s3,
    acl: "public-read",
    bucket,
    contentType: autoContentType,
    key: (req, file, cb) => {
      try {
        // file original name converter
        // eslint-disable-next-line no-param-reassign
        file.originalname = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );
        const mime = file.mimetype;

        // Check whether it's allowed.
        if (!isAllowedMime(mime)) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            errorData.INVALID_MIMETYPE.message
          );
        }
        // Get appropriate extension.
        const ext = mimeToExt(mime);
        // Send final s3 object name.
        cb(null, `${uuid()}.${ext}`);
      } catch (e) {
        cb(e);
      }
    },
  }),
});

const upload = multer({
  storage: multerS3({
    s3,
    acl: "private",
    bucket,
    contentType: autoContentType,
    key: (req, file, cb) => {
      try {
        // file original name converter
        // eslint-disable-next-line no-param-reassign
        file.originalname = Buffer.from(file.originalname, "latin1").toString(
          "utf8"
        );
        const mime = file.mimetype;

        // Check whether it's allowed.
        if (!isAllowedMime(mime)) {
          throw new ApiError(
            httpStatus.BAD_REQUEST,
            errorData.INVALID_MIMETYPE.message
          );
        }

        // Get appropriate extension.
        const ext = mimeToExt(mime);

        // Send final s3 object name.
        cb(null, `${uuid()}.${ext}`);
      } catch (e) {
        cb(e);
      }
    },
  }),
});

const preSignedS3ObjectDuration = 24 * 60 * 60;

const getObject = (file) => {
  return file.location;
};

const preSignS3Object = (key) => {
  return s3.getSignedUrl("getObject", {
    Bucket: bucket,
    Key: key,
    Expires: preSignedS3ObjectDuration,
  });
};

module.exports = {
  upload,
  uploadLocal,
  uploadAsPublic,
  requestFileToBody,
  preSignS3Object,
  getObject,
};
