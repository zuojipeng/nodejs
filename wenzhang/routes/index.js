var express = require('express');
var router = express.Router();

var indexController=require('../controllers/indexController.js')

// 首页
router.get('/',indexController.Index);

// 列表页
router.get('/List/:_id',indexController.List)

// 详情页
router.get('/Edit/:_id',indexController.Edit)

module.exports = router;
