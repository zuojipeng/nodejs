// 引入数据库的配置文件
var mongoose = require('../configs/db_config.js');

// 定义一个 item 集合的骨架 (用来约束集合的,告诉集合需要存储哪些属性)
var articleSchema = new mongoose.Schema({
	itemId : {
		type: 'ObjectId',
		// 关联的集合
		ref: 'item'
	},
	title: 			String,
	author : 		String,
	keywords : 		String,
	description : 	String,
	imgurl: 		String,
	content: 		String,
	ctime: {
		type: Date,
		default: new Date()
	},
});


// 3. 创建数据库模型  在数据库里  会 变成 复数  item  -->  items 
var articleModel = mongoose.model('article', articleSchema);

// 暴露 itemModel
module.exports = articleModel;
