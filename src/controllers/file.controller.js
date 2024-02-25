const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { errorData } = require('../utils/errorData');
const { preSignS3Object, getObject } = require('../utils/upload');
const catchAsync = require('../utils/catchAsync');
const { Order } = require('../models');

const file = catchAsync(async (req, res) => {
  if (req.file === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, errorData.FILE_REQUIRED);
  }

  const tempUrl = preSignS3Object(req.file.key);

  res.status(httpStatus.CREATED).send({
    originalName: req.file.originalname,
    key: req.file.key,
    tempUrl,
  });
});

const fileAsPublic = catchAsync(async (req, res) => {
  if (req.file === undefined) {
    throw new ApiError(httpStatus.BAD_REQUEST, errorData.FILE_REQUIRED);
  }
  const tempUrl = getObject(req.file);
  let r = await Order.findOneAndUpdate(
    { "_id": req.body.orderId }, // 찾고자 하는 문서의 조건
    { $set: { [`items.${req.body.index}.imageSrc`]: tempUrl } }, // 업데이트할 내용
    { new: true } // 업데이트된 문서를 반환하도록 설정
  )
  
  res.status(httpStatus.CREATED).send({
    originalName: req.file.originalname,
    key: req.file.key,
    tempUrl,
  });
});

module.exports = {
  file,
  fileAsPublic,
};
