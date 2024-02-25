const express = require('express');
const fileController = require('../../controllers/file.controller');
const { upload, uploadAsPublic } = require('../../utils/upload');

const router = express.Router();

router.post('/', upload.single('file'), fileController.file);
router.post('/public', uploadAsPublic.single('file'), fileController.fileAsPublic);

module.exports = router;
