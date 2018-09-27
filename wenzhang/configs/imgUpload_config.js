// 引入 path 模块
var path = require('path');
// 引入 日期的模块
var timestamp = require('time-stamp');
// 引入uid 模块
var uid = require('uid');
// 引入 multer 模块
var multer  = require('multer');

function imgUpload(imgPath,imgType,fileSize){

	// 配置参数
	var storage = multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, imgPath)
		},
		// 设置文件名称
		filename: function (req, file, cb) {
			var extname = path.extname(file.originalname);
			// 设置文件名称
			cb(null, file.fieldname + '-' + timestamp('YYYYMMDD')+'-'+uid() + extname);
		}
	})

	// 文件过滤函数
	function fileFilter (req, file, cb) {
		if( imgType.indexOf(file.mimetype) == -1){
			// 拒绝这个文件，使用`false`，像这样:
			cb(null, false)		
			// 如果有问题，你可以总是这样发送一个错误:
			cb(new Error('文件格式不正确!'))
		}else{
			// 接受这个文件，使用`true`，像这样:
			cb(null, true)
		}
	}

	// 文件上传配置
	var upload = multer({
		// 基本配置
		storage: storage,
		// 文件过滤器的配置
		fileFilter:fileFilter,
		// 限制文件大小
		limits:{
			// 单位 :字节
			fileSize: fileSize
		}
	})
	// 返回
	return upload;
}


// 暴露上传图片的函数
module.exports = imgUpload;