// 管理员的控制器
var adminController={};

 // 引入item数据库模型
var itemModel=require('../models/itemModel.js');

// 引入 item 数据库模型
var articleModel = require('../models/articleModel.js');

// 引入lianjie数据库模型
var lianjieModel=require('../models/lianjieModel.js')

// 引入 admin 数据库模型
var adminModel = require('../models/adminModel.js');

// 管理员首页
adminController.Index=function(req, res) {

 // 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');
  res.render('admin/index');
}

// 栏目页面
adminController.ItemAdd=function(req,res){

	// 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
    if(!req.session.user) res.redirect('/admin/login');
	res.render('admin/itemAdd');
}

// 添加栏目
adminController.ItemInsert=function(req,res){
     // 插入数据
     itemModel.create(req.body,function(err){
     	if(err){
     		res.send('数据插入失败');
     	}else{
            res.redirect('/admin/itemList');
     	}
     })
}

// 管理员栏目列表
adminController.ItemList=function(req,res){

	// 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');

	itemModel.find({}).sort({order:1}).exec(function(err,data){
        if(err){
        	res.send('数据插入失败');
        }else{
        	// console.log(data);
        	res.render('admin/itemList',{data,data})
        }
	})
}

// 编辑栏目页面
adminController.ItemEdit=function(req,res){

	// 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');
	// console.log(req.params._id)
	itemModel.find({_id:req.params._id},function(err,data){
		if(err){
			console.log('查询数据失败');
		}else{
			// console.log(data);
			res.render('admin/itemEdit',{data:data[0]})
		}
	})
}

// 修改提交栏目页面
adminController.itemUpdate=function(req,res){
	itemModel.update({_id:req.body._id},req.body,function(err){
		if(err){
			console.log('数据更新失败')
		}else{
			res.redirect('/admin/itemList')
		}
	})
}

// 删除栏目
adminController.itemDel=function(req,res){
	// console.log(req.params._id);
	itemModel.remove({_id:req.params._id},function(err){
         if(err){
         	console.log('删除数据失败');
         }else{
         	res.redirect('/admin/itemList')
         }
	})
}


// 发布文章
adminController.ArticleAdd=function(req,res){
	 // 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');

	itemModel.find({},function(err,data){
		if(err){
			console.log('栏目查询失败')
		}else{
            res.render('admin/articleAdd',{items:data})
		}
	})
}


// 插入文章数据
adminController.ArticleInsert=function(req,res){
    
    // 允许接受图片的类型
    var imgType=['image/jpeg','image/png','image/gif'];
    // 图片大小
    var fileSize=1024*1024*10;
    // 图片的位置
    var imgPath='uploads';

    // 引入图片上传配置的模块
    var imgUpload=require('../configs/imgUpload_config.js');

    var upload=imgUpload(imgPath,imgType,fileSize).single('imgurl');

    upload(req,res,function(err){
         if(err){
         	res.send('图片上传失败');
         }else{
         	// 获取上传图片的名称  给 req.body
			req.body.imgurl =  req.file.filename;
			// 插入数据
			articleModel.create(req.body,function(error){
				if(error){
				   res.send('数据插入失败');
				}else{
					// res.send('数据插入成功');
				   res.redirect('/admin/articleList');
				}
			})
         }
    })
}


adminController.ArticleList=function(req,res){

	 // 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');
	// 当前页面 (用户如果没有 传 page 参数 就 让 page 默认 1)
	var page = req.query.page?req.query.page:1;

	// 每页显示多少条数据
	var pageSize = 4;

	// 一共有多少页
	articleModel.find().count(function(err,total){
		// 最大页码
		var maxPageNumber =  Math.ceil(total/pageSize);

		// 判断上一页 和下一页的边界
		if(page < 1) page = 1;
		if(page > maxPageNumber) page = maxPageNumber;

		// 查询数据的偏移量
		var offsetPage = pageSize * (page-1);		

		articleModel.find({}).limit(pageSize).skip(offsetPage).populate('itemId',{name:1}).exec(function(err,data){
			if(err){
				res.send('查询数据失败');
			}else{
				console.log(data);
				// 响应模版
				res.render('admin/articleList',{articles:data,maxPageNumber:maxPageNumber,page:page});		
			}
		})
	})
}

// 文章编辑页面
adminController.ArticleEdit = function(req,res){


	 // 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');
		// 查询数据
	articleModel.find({_id:req.params._id},function(err,data){
		if(err){
			res.send('数据插入失败');
		}else{
			// 查询栏目列表
			itemModel.find({},function(err,itemdata){
				if(err){
					res.send('栏目查询失败');
				}else{
					// 响应模版
  					res.render('admin/articleEdit',{data:data[0],itmes:itemdata});		
				}
			})
		}
	})
}

// 修改文章数据
adminController.ArticleUpdate = function(req,res){
	// 更新数据   
	articleModel.update({_id:req.body._id},req.body,function(err){
		if(err){
			res.send('数据更新失败');
		}else{
			res.redirect('/admin/articleList');
		}
	})
}


// 修改文章封面
adminController.ArticleUpdateImage = function(req,res){

	// 允许接收图片的类型
	var imgType = ['image/jpeg','image/png','image/gif'];
	// 图片大小
	var fileSize = 1024 * 1024 * 5;
	// 图片的存在位置
	var imgPath = 'uploads';

	// 引入 图片上传配置的模块
	var imgUpload = require('../configs/imgUpload_config.js');
	var upload = imgUpload(imgPath,imgType,fileSize).single('imgurl');
	upload(req,res,function(err){
		if(err){
			res.send('图片上传失败');
		}else{
			// 更新数据   
			articleModel.update({_id:req.body._id},{$set:{imgurl:req.file.filename}},function(err){
				if(err){
					res.send('数据更新失败');
				}else{
					res.redirect('/admin/articleList');
				}
			})
		}
	})
}


// 删除文章
adminController.ArticleRemove = function(req,res){
	//删除数据
	articleModel.remove({_id:req.params._id},function(err){
		if(err){
			res.send('数据删除失败');
		}else{
			res.redirect('/admin/articleList');
		}
	})
}


// 链接页面
adminController.LianjieAdd=function(req,res){
	// 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');
	res.render('admin/lianjieAdd');
}

// 添加链接页面
adminController.LianjieInsert=function(req,res){
     // 插入数据
     lianjieModel.create(req.body,function(err){
     	if(err){
     		res.send('数据插入失败');
     	}else{
     		// res.send('数据插入成功');
            res.redirect('/admin/lianjieList');
     	}
     })
}

// 友情链接列表
adminController.LianjieList=function(req,res){
	 // 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');

	lianjieModel.find({}).sort({order:1}).exec(function(err,lianjiedata){
        if(err){
        	res.send('数据插入失败');
        }else{
        	console.log(lianjiedata);
        	res.render('admin/lianjieList',{lianjiedata,lianjiedata})
        }
	})
}



// 添加管理员

adminController.AdminAdd=function(req,res){

	 // 看session 里面有没有 user 属性 ;如果用户没有登录  就跳转到登录页面
   if(!req.session.user) res.redirect('/admin/login');
	res.render('admin/adminAdd')
}

// 注册管理员
adminController.AdminInsert=function(req,res){


	// 引入 md5 的模块 用来加密密码
	var md5 = require('md5');

    // console.log(req.session.code);

	// console.log(req.body);
	if(req.session.code!=req.body.code){
        console.log('验证码不正确');
        return;
	}

	// 判断用户密码
	if(req.body.password!=req.body.password1){

		res.send('两次密码不一致');
	}
    // 去掉用户名两边空白
	var username = req.body.username.trim();
 	
    // 获取管理员数据
	var userdata = {
		username:username,
		password:md5(req.body.password),
		tel:req.body.tel
	}

	adminModel.create(userdata,function(err,data){
		if(err){
			res.send('添加管理员失败');
		}else{
			res.send('添加管理员成功');
		}
	})
}

// 登录的页面
adminController.Login = function(req,res){
	// 响应模版
	res.render('admin/login');
}

// 登录的操作
adminController.DoLogin = function(req,res){

	// 判断验证码是否正确
	if(req.body.code != req.session.code){
		res.redirect('/admin/login');
		console.log('验证码不正确');
		return ;
	}

	// 引入 md5 的模块 用来加密密码
	var md5 = require('md5');
	// 去掉 用户名和密码 两端的空白字符 接收
	var username = req.body.username.trim();
	var password = md5(req.body.password.trim());

	// 查询 账号对应的数据
	adminModel.findOne({username:username},function(err,data){
		if(data == null){
			console.log('用户名不存在');
			res.redirect('/admin/login');
		}else{
			// 判断密码是否正确
			if(password==data.password){
				// 把登录成功的信息 记录 session 里
				req.session.user = data;
				// 登录成功
				res.redirect('/admin');
			}else{
				console.log('密码不正确');
				res.redirect('/admin/login');
			}			
		}
	})
}


// 退出登录操作
adminController.Logout = function(req,res){
	// 把 session 的user 信息赋值 null
	req.session.user = null;
	// 跳转到登录页面
	res.redirect('/admin/login');
}

// 验证码
adminController.Code=function(req,res){

	// 引入验证码模块
	var captchapng=require('captchapng');

	// 验证码
	var code=parseInt(Math.random()*9000+1000);

	// 把验证码存到session
	req.session.code=code;

	// console.log(code)

	// 把验证码存到session
	var p = new captchapng(80,30,code); 
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    var imgbase64 = new Buffer(img,'base64');
    res.send(imgbase64);

}
// 暴露控制器
module.exports=adminController;